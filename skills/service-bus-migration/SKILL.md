---
name: service-bus-migration
description: "Migrate from MSMQ to Azure Service Bus with patterns for topic/subscription mapping, dead-letter handling, message serialization, retry policies, transactional messaging, and hybrid bridge architecture during migration."
---

# Service Bus Migration Skill

## Overview

This skill provides comprehensive guidance for migrating enterprise messaging systems from Microsoft Message Queuing (MSMQ) to Azure Service Bus. It covers migration patterns, architecture decisions, and operational best practices for transitioning messaging workloads with minimal downtime and risk.

## MSMQ to Azure Service Bus Migration Patterns

### Direct Lift-and-Shift Pattern

The simplest approach for applications with straightforward messaging needs:

```csharp
// Legacy MSMQ code
var queuePath = @".\Private$\OrderQueue";
using (var queue = new MessageQueue(queuePath))
{
    var msg = new Message { Body = "Order Data" };
    queue.Send(msg);
}

// Azure Service Bus equivalent
var connectionString = "Endpoint=sb://mynamespace.servicebus.windows.net/...";
var queueName = "order-queue";
var client = new QueueClient(connectionString, queueName);
await client.SendAsync(new Message(Encoding.UTF8.GetBytes("Order Data")));
```

### Gradual Migration Pattern

Implement a message routing layer that forwards messages from MSMQ to Service Bus during transition:

```csharp
public class MessageRouter
{
    private readonly MessageQueue _msmqQueue;
    private readonly IQueueClient _serviceBusClient;

    public async Task RouteMessage(Message msmqMessage)
    {
        // Parse MSMQ message
        var body = msmqMessage.Body.ToString();
        var correlationId = msmqMessage.CorrelationId;

        // Create Service Bus message with preserved correlation
        var sbMessage = new Message(Encoding.UTF8.GetBytes(body))
        {
            CorrelationId = correlationId,
            MessageId = Guid.NewGuid().ToString()
        };

        // Add migration tracking
        sbMessage.UserProperties["MigratedFrom"] = "MSMQ";
        sbMessage.UserProperties["MigrationDate"] = DateTime.UtcNow;

        await _serviceBusClient.SendAsync(sbMessage);
    }
}
```

## Topic/Subscription Mapping

### Queue to Topic Mapping

Map MSMQ distribution lists to Service Bus topics with subscriptions:

```csharp
// MSMQ multicast equivalent using Service Bus topics
public class TopicPublisher
{
    private readonly ITopicClient _topicClient;

    public async Task PublishOrderEvent(OrderEvent orderEvent)
    {
        var message = new Message(JsonConvert.SerializeObject(orderEvent).GetBytes())
        {
            ContentType = "application/json",
            MessageId = orderEvent.Id.ToString(),
            CorrelationId = orderEvent.CorrelationId
        };

        // User properties for filtering
        message.UserProperties["EventType"] = "OrderCreated";
        message.UserProperties["Priority"] = orderEvent.Priority.ToString();

        await _topicClient.SendAsync(message);
    }
}
```

### Subscription Filters

Implement content-based filtering to replace MSMQ label-based routing:

```csharp
// Setup subscription with filter
var subscriptionDescription = new SubscriptionDescription("order-events", "high-priority-orders")
{
    DefaultMessageTtl = TimeSpan.FromHours(1),
    LockDuration = TimeSpan.FromSeconds(30),
    MaxDeliveryCount = 10
};

var filter = new SqlFilter("Priority = 'High' AND Status = 'Pending'");
await managementClient.CreateSubscriptionAsync(subscriptionDescription, filter);
```

## Dead-Letter Handling

### Configure Dead-Letter Queues

Ensure all entities have dead-letter processing:

```csharp
public class DeadLetterProcessor
{
    private readonly ISubscriptionClient _deadLetterClient;

    public DeadLetterProcessor(string connectionString, string topic, string subscription)
    {
        var deadLetterPath = $"{topic}/Subscriptions/{subscription}/$DeadLetterQueue";
        _deadLetterClient = new SubscriptionClient(connectionString, topic, subscription, 
            ReceiveMode.PeekLock);
    }

    public async Task ProcessDeadLetterMessages()
    {
        _deadLetterClient.RegisterMessageHandler(
            async (message, cancellationToken) =>
            {
                try
                {
                    var body = message.Body.ToString();
                    var reason = message.DeadLetterReason;
                    var errorDescription = message.DeadLetterErrorDescription;

                    // Log for analysis
                    Console.WriteLine($"Dead-lettered: {reason} - {errorDescription}");
                    Console.WriteLine($"Body: {body}");

                    await _deadLetterClient.CompleteAsync(message.SystemProperties.LockToken);
                }
                catch (Exception ex)
                {
                    await _deadLetterClient.AbandonAsync(message.SystemProperties.LockToken);
                }
            },
            new MessageHandlerOptions(ExceptionReceivedHandler)
            {
                MaxConcurrentCalls = 1,
                AutoComplete = false
            });
    }

    private Task ExceptionReceivedHandler(ExceptionReceivedEventArgs exceptionReceivedEventArgs)
    {
        Console.WriteLine($"Exception: {exceptionReceivedEventArgs.Exception}");
        return Task.CompletedTask;
    }
}
```

## Message Serialization Conversion

### Handling Legacy Serialization

Convert between MSMQ's Binary Formatters and modern JSON:

```csharp
public class MessageSerializationAdapter
{
    public static Message ConvertMsmqToServiceBus(System.Messaging.Message msmqMsg)
    {
        string body;

        // Detect serialization format
        if (IsBinaryFormatted(msmqMsg))
        {
            // Deserialize binary and convert to JSON
            var legacyObject = DeserializeBinary(msmqMsg.Body as byte[]);
            body = JsonConvert.SerializeObject(legacyObject);
        }
        else
        {
            body = msmqMsg.Body.ToString();
        }

        var sbMessage = new Message(Encoding.UTF8.GetBytes(body))
        {
            ContentType = "application/json",
            MessageId = msmqMsg.Id,
            CorrelationId = msmqMsg.CorrelationId
        };

        // Preserve custom properties
        foreach (DictionaryEntry entry in msmqMsg.Properties)
        {
            sbMessage.UserProperties[entry.Key.ToString()] = entry.Value;
        }

        return sbMessage;
    }

    private static bool IsBinaryFormatted(System.Messaging.Message msg)
    {
        return msg.Formatter is BinaryMessageFormatter;
    }

    private static object DeserializeBinary(byte[] data)
    {
        // WARNING: BinaryFormatter is banned (RCE vulnerability, see SYSLIB0011).
        // Use System.Text.Json for new code. This helper exists only for
        // reading legacy MSMQ messages during migration; remove after cutover.
        using (var ms = new MemoryStream(data))
        {
            return System.Text.Json.JsonSerializer.Deserialize<object>(ms);
        }
    }
}
```

## Retry Policies

### Exponential Backoff Configuration

Define retry strategies for transient failures:

```csharp
public class ServiceBusRetryPolicy
{
    public static RetryPolicy CreateExponentialBackoff()
    {
        return new RetryPolicy(
            new ServiceBusTransientErrorDetectionStrategy(),
            "ServiceBusRetryPolicy",
            maxRetryCount: 5,
            minBackoff: TimeSpan.FromSeconds(1),
            maxBackoff: TimeSpan.FromSeconds(30),
            deltaBackoff: TimeSpan.FromSeconds(2));
    }

    public static void ApplyRetryPolicy(
        ITopicClient topicClient,
        ISubscriptionClient subscriptionClient)
    {
        var retryPolicy = CreateExponentialBackoff();

        ServiceBusConnection.SetRetryPolicy(
            topicClient,
            retryPolicy);

        ServiceBusConnection.SetRetryPolicy(
            subscriptionClient,
            retryPolicy);
    }
}
```

### Message Handler with Retry Logic

```csharp
public class ResilientMessageHandler
{
    private readonly int _maxRetries = 5;
    private readonly TimeSpan _initialDelay = TimeSpan.FromSeconds(1);

    public async Task ProcessMessageWithRetry(Message message, Func<Message, Task> handler)
    {
        int retryCount = 0;

        while (retryCount < _maxRetries)
        {
            try
            {
                await handler(message);
                return;
            }
            catch (ServiceBusException ex) when (ex.IsTransient)
            {
                retryCount++;
                var delay = TimeSpan.FromMilliseconds(
                    _initialDelay.TotalMilliseconds * Math.Pow(2, retryCount - 1));

                if (retryCount < _maxRetries)
                {
                    await Task.Delay(delay);
                }
            }
            catch (Exception)
            {
                // Non-transient error - move to dead-letter
                throw;
            }
        }

        throw new InvalidOperationException($"Failed after {_maxRetries} retries");
    }
}
```

## Transactional Messaging

### Outbox Pattern for Distributed Transactions

Implement guaranteed message delivery without distributed transactions:

```csharp
public class OutboxPattern
{
    private readonly IServiceBusClient _serviceBusClient;
    private readonly IRepository<OutboxMessage> _outboxRepository;

    public async Task SendOrderWithOutbox(Order order)
    {
        using (var transaction = _dbContext.Database.BeginTransaction())
        {
            try
            {
                // Save order
                _dbContext.Orders.Add(order);
                await _dbContext.SaveChangesAsync();

                // Record outbox message in same transaction
                var outboxMessage = new OutboxMessage
                {
                    MessageId = Guid.NewGuid(),
                    AggregateId = order.Id,
                    EventType = "OrderCreated",
                    Payload = JsonConvert.SerializeObject(order),
                    CreatedAt = DateTime.UtcNow,
                    IsPublished = false
                };

                _outboxRepository.Add(outboxMessage);
                await _dbContext.SaveChangesAsync();

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        // Publish messages (separate operation - can retry)
        await PublishOutboxMessages();
    }

    public async Task PublishOutboxMessages()
    {
        var unpublished = await _outboxRepository.GetWhere(m => !m.IsPublished);

        foreach (var outboxMsg in unpublished)
        {
            try
            {
                var message = new Message(Encoding.UTF8.GetBytes(outboxMsg.Payload))
                {
                    MessageId = outboxMsg.MessageId.ToString(),
                    UserProperties = { ["AggregateId"] = outboxMsg.AggregateId.ToString() }
                };

                await _serviceBusClient.SendAsync(message);

                outboxMsg.IsPublished = true;
                await _outboxRepository.UpdateAsync(outboxMsg);
            }
            catch
            {
                // Retry on next publication cycle
            }
        }
    }
}
```

## Hybrid Bridge Pattern During Migration

### Bidirectional Message Bridge

Maintain compatibility during gradual cutover by bridging MSMQ and Service Bus:

```csharp
public class HybridMessageBridge
{
    private readonly MessageQueue _msmqQueue;
    private readonly IQueueClient _serviceBusClient;
    private readonly IQueueClient _msmqToSbBridge;
    private readonly IQueueClient _sbToMsmqBridge;

    public async Task StartBridging(CancellationToken cancellationToken)
    {
        var tasks = new[]
        {
            BridgeMsmqToServiceBus(cancellationToken),
            BridgeServiceBusToMsmq(cancellationToken)
        };

        await Task.WhenAll(tasks);
    }

    private async Task BridgeMsmqToServiceBus(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                var msmqMessage = _msmqQueue.Receive(TimeSpan.FromSeconds(1));

                if (msmqMessage != null)
                {
                    var sbMessage = ConvertMessage(msmqMessage);
                    sbMessage.UserProperties["Source"] = "MSMQ";
                    sbMessage.UserProperties["BridgedAt"] = DateTime.UtcNow;

                    await _serviceBusClient.SendAsync(sbMessage);
                    msmqMessage.Acknowledge();
                }
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Bridge error: {ex.Message}");
                await Task.Delay(TimeSpan.FromSeconds(5), cancellationToken);
            }
        }
    }

    private async Task BridgeServiceBusToMsmq(CancellationToken cancellationToken)
    {
        _sbToMsmqBridge.RegisterMessageHandler(
            async (sbMessage, lockToken) =>
            {
                try
                {
                    // Only bridge messages that originated from Service Bus
                    if (!sbMessage.UserProperties.ContainsKey("Source") ||
                        sbMessage.UserProperties["Source"].ToString() != "MSMQ")
                    {
                        var msmqMessage = new System.Messaging.Message
                        {
                            Body = sbMessage.Body,
                            Label = sbMessage.Label ?? "Bridged",
                            CorrelationId = sbMessage.CorrelationId
                        };

                        _msmqQueue.Send(msmqMessage);
                    }

                    await _sbToMsmqBridge.CompleteAsync(lockToken);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Bridge error: {ex.Message}");
                    await _sbToMsmqBridge.AbandonAsync(lockToken);
                }
            },
            new MessageHandlerOptions(ExceptionHandler) { AutoComplete = false });
    }

    private Message ConvertMessage(System.Messaging.Message msmqMsg)
    {
        var body = msmqMsg.Body is string str ? str : msmqMsg.Body.ToString();
        return new Message(Encoding.UTF8.GetBytes(body))
        {
            MessageId = msmqMsg.Id,
            CorrelationId = msmqMsg.CorrelationId,
            Label = msmqMsg.Label,
            TimeToLive = msmqMsg.TimeToBeReceived == TimeSpan.MaxValue
                ? TimeSpan.MaxValue
                : msmqMsg.TimeToBeReceived
        };
    }

    private Task ExceptionHandler(ExceptionReceivedEventArgs args)
    {
        Console.WriteLine($"Exception in bridge: {args.Exception}");
        return Task.CompletedTask;
    }
}
```

### Migration Control Plane

Manage cutover progression with feature flags:

```csharp
public class MigrationControlPlane
{
    private readonly IFeatureManager _featureManager;

    public enum RoutingMode
    {
        MsmqOnly,
        MsmqPrimary_ServiceBusSecondary,
        ServiceBusPrimary_MsmqSecondary,
        ServiceBusOnly
    }

    public async Task<Message> SendMessage(
        string queueName,
        string payload,
        CancellationToken cancellationToken)
    {
        var mode = await GetCurrentRoutingMode();

        return mode switch
        {
            RoutingMode.MsmqOnly => await SendViaMsmq(queueName, payload),
            RoutingMode.MsmqPrimary_ServiceBusSecondary =>
                await SendWithFallback(SendViaMsmq, SendViaServiceBus, queueName, payload),
            RoutingMode.ServiceBusPrimary_MsmqSecondary =>
                await SendWithFallback(SendViaServiceBus, SendViaMsmq, queueName, payload),
            RoutingMode.ServiceBusOnly => await SendViaServiceBus(queueName, payload),
            _ => throw new InvalidOperationException("Unknown routing mode")
        };
    }

    private async Task<Message> SendWithFallback(
        Func<string, string, Task<Message>> primary,
        Func<string, string, Task<Message>> fallback,
        string queue,
        string payload)
    {
        try
        {
            return await primary(queue, payload);
        }
        catch
        {
            return await fallback(queue, payload);
        }
    }
}
```

## Migration Checklist

- [ ] Audit current MSMQ topology and message volumes
- [ ] Plan Service Bus namespace and tier (Standard vs Premium)
- [ ] Design topic/subscription structure
- [ ] Implement message serialization adapter
- [ ] Configure dead-letter processing
- [ ] Set up monitoring and alerting
- [ ] Deploy hybrid bridge
- [ ] Run parallel operation period
- [ ] Validate message delivery and ordering
- [ ] Cutover application configuration
- [ ] Decommission MSMQ infrastructure
- [ ] Archive historical data

## Additional Resources

- [Azure Service Bus Documentation](https://learn.microsoft.com/azure/service-bus-messaging/)
- [Migrate from MSMQ to Service Bus](https://learn.microsoft.com/azure/service-bus-messaging/service-bus-migrate-msmq-to-service-bus)
- [Outbox Pattern](https://learn.microsoft.com/dotnet/architecture/microservices/multi-container-microservice-docker-application/subscribe-events#designing-atomicity-and-idempotency-when-publishing-integration-events-across-microservices)
- [Service Bus Patterns and Performance](https://learn.microsoft.com/azure/service-bus-messaging/service-bus-performance-optimizations)
