# .NET Breaking Changes Catalog

Reference catalog of breaking changes for upgrading from .NET 6 to .NET 8, and from .NET 8 to .NET 10. Each entry includes a description, affected area, severity, and before/after code examples.

---

## .NET 6 → .NET 8

### 1. `IHostedService` — `BackgroundService.ExecuteAsync` exception behavior

**Area:** Hosting | **Severity:** High

In .NET 6, an unhandled exception in `BackgroundService.ExecuteAsync` logged a warning but did not stop the host. In .NET 8, an unhandled exception crashes the host process by default.

```csharp
// .NET 6 — unhandled exception logged but host continues
public class MyWorker : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        throw new InvalidOperationException("Unhandled!"); // host stayed up
    }
}

// .NET 8 — host terminates; wrap exceptions or configure BackgroundServiceExceptionBehavior
public class MyWorker : BackgroundService
{
    private readonly ILogger<MyWorker> _logger;

    public MyWorker(ILogger<MyWorker> logger) => _logger = logger;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            await DoWorkAsync(stoppingToken);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            _logger.LogError(ex, "Worker faulted");
            // Re-throw to let the host handle shutdown, or swallow to keep running
        }
    }
}
```

**Remediation:** Wrap `ExecuteAsync` bodies in `try/catch`, or configure the behavior in `Program.cs`:

```csharp
builder.Services.Configure<HostOptions>(options =>
{
    options.BackgroundServiceExceptionBehavior =
        BackgroundServiceExceptionBehavior.Ignore; // restores .NET 6 behavior
});
```

---

### 2. `IServiceCollection.AddScoped` / DI scope validation in production

**Area:** Dependency Injection | **Severity:** Medium

.NET 8 enables `ValidateScopes` and `ValidateOnBuild` in production by default in the new Generic Host. Code that previously worked in production (with scoped services incorrectly injected into singletons) now throws at startup.

```csharp
// Problematic — scoped service captured by singleton
builder.Services.AddSingleton<IMySingleton, MySingleton>(); // depends on IMyScoped
builder.Services.AddScoped<IMyScoped, MyScoped>();

// .NET 8 startup throws:
// InvalidOperationException: Cannot consume scoped service 'IMyScoped' from singleton 'IMySingleton'.
```

**Remediation:** Fix the DI graph — inject `IServiceScopeFactory` instead of the scoped service directly:

```csharp
public class MySingleton : IMySingleton
{
    private readonly IServiceScopeFactory _scopeFactory;

    public MySingleton(IServiceScopeFactory scopeFactory)
        => _scopeFactory = scopeFactory;

    public async Task DoWorkAsync()
    {
        using var scope = _scopeFactory.CreateScope();
        var scoped = scope.ServiceProvider.GetRequiredService<IMyScoped>();
        await scoped.ExecuteAsync();
    }
}
```

---

### 3. Minimal APIs — `IResult` interface changes

**Area:** ASP.NET Core | **Severity:** Medium

`IResult` gained a `ExecuteAsync(HttpContext)` method that is now required for custom result types. Types that implemented `IResult` without this method in .NET 6 no longer compile.

```csharp
// .NET 6 — custom IResult without ExecuteAsync compiled fine
public class MyResult : IResult
{
    public Task ExecuteAsync(HttpContext httpContext) =>
        throw new NotImplementedException();
}

// .NET 8 — IResult is unchanged but IStatusCodeHttpResult, IValueHttpResult,
// and IContentTypeHttpResult were added. Implement the correct interface:
public class MyJsonResult : IResult, IStatusCodeHttpResult, IValueHttpResult
{
    public int? StatusCode => 200;
    public object? Value { get; init; }

    public async Task ExecuteAsync(HttpContext httpContext)
    {
        httpContext.Response.StatusCode = StatusCode ?? 200;
        await httpContext.Response.WriteAsJsonAsync(Value);
    }
}
```

---

### 4. `System.Text.Json` — non-public member serialization

**Area:** Serialization | **Severity:** Medium

.NET 8 tightened `System.Text.Json` source generation to require public members. Types relying on private or internal property serialization without explicit `[JsonInclude]` attributes are silently skipped or cause source-gen errors.

```csharp
// .NET 6 — runtime reflection serialized internal properties
public class Order
{
    internal string InternalNote { get; set; } = "";
    public int Id { get; set; }
}

// .NET 8 source-gen — InternalNote is excluded unless annotated
[JsonSerializable(typeof(Order))]
public partial class AppJsonContext : JsonSerializerContext { }

// Fix: add [JsonInclude] and make the member public, or use runtime reflection context
public class Order
{
    [JsonInclude]
    public string InternalNote { get; set; } = "";
    public int Id { get; set; }
}
```

---

### 5. Rate Limiting Middleware — `RateLimitLease` disposal

**Area:** ASP.NET Core Middleware | **Severity:** Low

`RateLimiter` was introduced in .NET 7 and stabilized in .NET 8. Code using pre-release `System.Threading.RateLimiting` NuGet packages must be migrated to the inbox version; the lease object's `Dispose` is now mandatory.

```csharp
// .NET 8 — always dispose the lease
using var lease = await _rateLimiter.AcquireAsync(permitCount: 1, cancellationToken);
if (!lease.IsAcquired)
{
    return Results.StatusCode(StatusCodes.Status429TooManyRequests);
}

// process request
```

---

### 6. `HttpClient` — `SocketsHttpHandler` default pool timeout change

**Area:** Networking | **Severity:** Low

The default `PooledConnectionLifetime` dropped from unlimited (keep-alive forever) to **15 minutes** in .NET 8's default `SocketsHttpHandler`. Long-running services may see more TCP connection churn.

```csharp
// Explicit configuration for predictable behavior
var handler = new SocketsHttpHandler
{
    PooledConnectionLifetime = TimeSpan.FromMinutes(5),
    PooledConnectionIdleTimeout = TimeSpan.FromMinutes(2)
};
var client = new HttpClient(handler);
```

---

### 7. Blazor — render mode API

**Area:** Blazor | **Severity:** High

Blazor Server and Blazor WebAssembly are unified in .NET 8 under a single app model with explicit render modes. Projects migrating from .NET 6 Blazor Server or WASM must adopt render-mode annotations.

```razor
@* .NET 6 Blazor Server — no render mode annotation needed *@
<Counter />

@* .NET 8 — specify render mode explicitly *@
@using static Microsoft.AspNetCore.Components.Web.RenderMode

<Counter @rendermode="RenderMode.InteractiveServer" />
```

**Remediation:** Add `@rendermode` to interactive components or set a global default in `App.razor`.

---

### 8. `Regex` — `RegexOptions.NonBacktracking` default change

**Area:** Core Libraries | **Severity:** Low

Source-generated regexes in .NET 8 default to `RegexOptions.NonBacktracking` where safe. Patterns relying on backtracking-only features (backreferences, lookahead/lookbehind) must opt out.

```csharp
// Explicit options to preserve backtracking behavior
[GeneratedRegex(@"(\w+)\s+\1", RegexOptions.Compiled)]
private static partial Regex RepeatedWordRegex();
```

---

## .NET 8 → .NET 10

### 1. `HttpClient` — `IHttpClientFactory` resilience pipeline (Microsoft.Extensions.Http.Resilience)

**Area:** Networking | **Severity:** High

.NET 10 promotes the resilience extension (`Microsoft.Extensions.Http.Resilience`) as the preferred replacement for Polly-based retry. The `AddTransientHttpErrorPolicy` pattern from Polly 7 no longer compiles with the new inbox resilience API.

```csharp
// .NET 8 — Polly 7 via Microsoft.Extensions.Http.Polly
services.AddHttpClient<IWeatherClient, WeatherClient>()
    .AddTransientHttpErrorPolicy(policy =>
        policy.WaitAndRetryAsync(3, _ => TimeSpan.FromSeconds(1)));

// .NET 10 — Microsoft.Extensions.Http.Resilience (Polly 8 under the hood)
services.AddHttpClient<IWeatherClient, WeatherClient>()
    .AddStandardResilienceHandler(options =>
    {
        options.Retry.MaxRetryAttempts = 3;
        options.Retry.Delay = TimeSpan.FromSeconds(1);
    });
```

**Remediation:** Replace `Microsoft.Extensions.Http.Polly` with `Microsoft.Extensions.Http.Resilience`. Update `UseHttpClientMetrics` calls — the extension method moved to `Microsoft.Extensions.Diagnostics.HealthChecks.HttpClient`.

---

### 2. LINQ — `Order` / `OrderDescending` replace `OrderBy(x => x)` idiom

**Area:** Core Libraries | **Severity:** Low

`Enumerable.Order()` and `Enumerable.OrderDescending()` were introduced in .NET 7 and fully stabilized in .NET 10. Analyzers in .NET 10 produce warnings for `OrderBy(x => x)` patterns.

```csharp
// .NET 8 — verbose identity ordering
var sorted = items.OrderBy(x => x).ToList();

// .NET 10 — preferred
var sorted = items.Order().ToList();

// Descending
var sortedDesc = items.OrderDescending().ToList();
```

---

### 3. Native AOT — reflection-based code paths removed from ASP.NET Core defaults

**Area:** ASP.NET Core / AOT | **Severity:** High

.NET 10 makes Native AOT a first-class citizen for ASP.NET Core Minimal APIs and Worker Services. Reflection-based serialization, runtime `Type.GetType`, and non-source-generated `JsonSerializer` calls are trimmed away in AOT-published apps.

```csharp
// .NET 8 — works with reflection in non-AOT builds
app.MapGet("/order/{id}", (int id) =>
    Results.Ok(JsonSerializer.Serialize(new Order(id))));

// .NET 10 — use source-generated context for AOT compatibility
[JsonSerializable(typeof(Order))]
internal partial class AppJsonContext : JsonSerializerContext { }

app.MapGet("/order/{id}", (int id) =>
    Results.Ok(new Order(id))); // Minimal API auto-wires source-gen context
```

**Remediation:** Add `[JsonSerializable]` source context for all serialized types. Remove runtime `Type.GetType` calls and replace with generic overloads or source-generated factories.

---

### 4. `TimeProvider` — replaces `DateTime.UtcNow` in testable code

**Area:** Core Libraries | **Severity:** Medium

`TimeProvider` was introduced in .NET 8 and is the standard abstraction in .NET 10. SDK analyzers warn on direct `DateTime.UtcNow` and `DateTimeOffset.UtcNow` usage in service code.

```csharp
// .NET 8 — direct static access, hard to test
public class TokenService
{
    public bool IsExpired(DateTimeOffset expiry) =>
        DateTimeOffset.UtcNow > expiry;
}

// .NET 10 — inject TimeProvider
public class TokenService
{
    private readonly TimeProvider _time;

    public TokenService(TimeProvider time) => _time = time;

    public bool IsExpired(DateTimeOffset expiry) =>
        _time.GetUtcNow() > expiry;
}

// Registration
services.AddSingleton(TimeProvider.System);

// Testing — use FakeTimeProvider from Microsoft.Extensions.TimeProvider.Testing
var fakeTime = new FakeTimeProvider(DateTimeOffset.UtcNow);
var svc = new TokenService(fakeTime);
fakeTime.Advance(TimeSpan.FromHours(2));
Assert.True(svc.IsExpired(DateTimeOffset.UtcNow - TimeSpan.FromHours(1)));
```

---

### 5. `System.Text.Json` — `JsonSerializerOptions` is now sealed/frozen after first use

**Area:** Serialization | **Severity:** Medium

In .NET 10, mutating a `JsonSerializerOptions` instance after it has been used for serialization throws `InvalidOperationException`. Code that lazily added converters after first use breaks.

```csharp
// Broken — mutating after use
var options = new JsonSerializerOptions();
_ = JsonSerializer.Serialize(new Order(), options); // options frozen here
options.Converters.Add(new MyConverter()); // throws in .NET 10

// Fixed — configure before first use
var options = new JsonSerializerOptions();
options.Converters.Add(new MyConverter());
var json = JsonSerializer.Serialize(new Order(), options);
```

---

### 6. `System.Runtime.Loader.AssemblyLoadContext` — `IsCollectible` isolation

**Area:** Runtime | **Severity:** Low

.NET 10 enforces stricter isolation for collectible `AssemblyLoadContext` instances. Objects that cross ALC boundaries in non-collectible contexts no longer receive implicit GC roots, which can cause premature collection of type handles.

**Remediation:** Use `AssemblyLoadContext.Default` for shared types and ensure plugin types do not leak references into the default ALC.

---

### 7. `Span<T>` and `Memory<T>` — `BinaryPrimitives` API additions (behavioral note)

**Area:** Core Libraries | **Severity:** Low

.NET 10 adds overloads to `BinaryPrimitives` for 128-bit integers (`Int128`, `UInt128`). Existing code is unaffected, but callers relying on overload resolution with `long` may need explicit casts if ambiguity warnings appear.

```csharp
// Explicit cast to avoid ambiguity
BinaryPrimitives.WriteInt64BigEndian(buffer, (long)myValue);
```

---

### 8. Blazor — `NavigationManager.NavigateTo` query-string encoding change

**Area:** Blazor | **Severity:** Medium

In .NET 10, `NavigationManager.NavigateTo` percent-encodes special characters in the query string by default. Code that manually encoded query parameters before passing them now double-encodes.

```csharp
// .NET 8 — manual encoding required
navManager.NavigateTo($"/search?q={Uri.EscapeDataString(query)}");

// .NET 10 — NavigateTo handles encoding; pass raw value
navManager.NavigateTo($"/search?q={query}");
```

---

## Migration Tools

| Tool | Purpose | Command |
|------|---------|---------|
| `dotnet-upgrade-assistant` | Automated upgrade analysis and scaffolding | `dotnet tool install -g upgrade-assistant` |
| `dotnet-compatibility` | Cross-version API compatibility checker | Included in SDK |
| `dotnet outdated` | NuGet package update scanner | `dotnet tool install -g dotnet-outdated-tool` |

---

## References

- [.NET 8 Breaking Changes — Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/core/compatibility/8.0)
- [.NET 9 Breaking Changes — Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/core/compatibility/9.0)
- [.NET 10 Breaking Changes — Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/core/compatibility/10.0)
- [.NET Upgrade Assistant](https://learn.microsoft.com/en-us/dotnet/core/porting/upgrade-assistant-overview)
- [System.Text.Json migration guide](https://learn.microsoft.com/en-us/dotnet/standard/serialization/system-text-json/migrate-from-newtonsoft)
- [ASP.NET Core 8.0 migration guide](https://learn.microsoft.com/en-us/aspnet/core/migration/70-80)
- [ASP.NET Core 9.0 to 10.0 migration guide](https://learn.microsoft.com/en-us/aspnet/core/migration/90-100)
