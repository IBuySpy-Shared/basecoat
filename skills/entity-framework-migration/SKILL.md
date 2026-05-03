---
name: entity-framework-migration
title: Entity Framework Migration (EF6 to EF Core)
description: Migrate data access from Entity Framework 6 to EF Core, configure DbContext, apply Code First migrations, and establish EF Core testing patterns using in-memory or SQLite providers.
compatibility: ["agent:backend-dev", "agent:data-tier"]
metadata:
  domain: data-access
  maturity: production
  audience: [backend-engineer, architect]
allowed-tools: [csharp, dotnet-cli]
---

# Entity Framework Migration Skill

Comprehensive guidance for migrating data access from Entity Framework 6 (EF6) to Entity Framework Core (EF Core). Covers API and behaviour differences, DbContext configuration, Code First migrations, and testing patterns using lightweight in-memory and SQLite providers.

## When to Use

- Migrating an existing EF6 application to .NET 6+ / EF Core
- Configuring a new DbContext for a greenfield EF Core project
- Designing a testable data access layer using EF Core's test providers
- Resolving breaking changes or missing APIs when upgrading EF versions

## EF6 to EF Core: Key Differences

| Concern | EF6 | EF Core |
|---|---|---|
| Target framework | .NET Framework | .NET 5+ / .NET Standard 2.1 |
| EDMX designer | Supported | Not supported — use Code First |
| Lazy loading | Default on | Opt-in (proxy or `UseLazyLoadingProxies`) |
| `ObjectContext` | Available | Removed — use `DbContext` only |
| Inheritance mapping | TPT, TPH | TPT, TPH, TPC (EF Core 7+) |
| Raw SQL | `SqlQuery<T>` | `FromSqlRaw` / `ExecuteSqlRaw` |
| Bulk operations | Not built-in | `ExecuteUpdate` / `ExecuteDelete` (EF Core 7+) |
| Second-level cache | Via third-party | Not built-in |

## DbContext Configuration

### Basic DbContext (EF Core)

```csharp
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderLine> OrderLines { get; set; }
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(AppDbContext).Assembly);
    }
}
```

### Entity Configuration (IEntityTypeConfiguration)

Prefer `IEntityTypeConfiguration<T>` over `OnModelCreating` for large models.

```csharp
public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");
        builder.HasKey(o => o.Id);

        builder.Property(o => o.Reference)
               .HasMaxLength(50)
               .IsRequired();

        builder.HasMany(o => o.Lines)
               .WithOne(l => l.Order)
               .HasForeignKey(l => l.OrderId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
```

### Registration (ASP.NET Core DI)

```csharp
// Program.cs
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("Default"),
        sqlOptions => sqlOptions.EnableRetryOnFailure()));
```

### Connection String (appsettings.json)

```json
{
  "ConnectionStrings": {
    "Default": "Server=(localdb)\\mssqllocaldb;Database=AppDb;Trusted_Connection=True"
  }
}
```

## EF6 to EF Core Migration Steps

1. **Audit the EF6 model** — list all entities, mappings, stored procedures, and custom conventions.
2. **Remove EDMX** — delete `.edmx`, `.tt`, and generated files; switch to Code First classes.
3. **Replace `System.Data.Entity`** — update `using` statements to `Microsoft.EntityFrameworkCore`.
4. **Update `DbContext`** — inherit from `DbContext`, inject `DbContextOptions`, remove `Database.SetInitializer`.
5. **Rewrite fluent mappings** — replace `EntityTypeConfiguration<T>` with `IEntityTypeConfiguration<T>`.
6. **Replace removed APIs**:
   - `DbEntityEntry` → `EntityEntry`
   - `SqlQuery<T>` → `FromSqlRaw<T>`
   - `ObjectSet<T>` → `DbSet<T>`
   - `.Include(x => x.Nav)` chaining is unchanged, but `Select` projections inside `Include` are not supported.
7. **Handle lazy loading** — enable explicitly or convert to eager loading:

   ```csharp
   // Option A: proxy-based lazy loading
   builder.Services.AddDbContext<AppDbContext>(o =>
       o.UseLazyLoadingProxies().UseSqlServer(conn));

   // Option B: explicit eager loading (preferred in new code)
   var orders = await db.Orders
       .Include(o => o.Lines)
           .ThenInclude(l => l.Product)
       .ToListAsync();
   ```

8. **Add Code First migrations** — scaffold an initial migration from the new model:

   ```bash
   dotnet ef migrations add InitialCreate --project src/Data --startup-project src/Api
   dotnet ef database update --project src/Data --startup-project src/Api
   ```

9. **Validate** — run integration tests against a real database; compare query counts and results with the EF6 baseline.

## Code First Migrations

### Adding and Applying Migrations

```bash
# Add a migration
dotnet ef migrations add AddProductDescription \
  --project src/Data \
  --startup-project src/Api

# Apply to the target database
dotnet ef database update \
  --project src/Data \
  --startup-project src/Api \
  --connection "Server=...;Database=...;..."

# Generate a SQL script (for DBA review)
dotnet ef migrations script \
  --idempotent \
  --output migrations.sql
```

### Applying Migrations at Runtime

```csharp
// Startup / program entry point
using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
await db.Database.MigrateAsync();
```

### Rolling Back a Migration

```bash
# Revert to a named migration
dotnet ef database update PreviousMigrationName \
  --project src/Data --startup-project src/Api

# Remove the last unapplied migration from the snapshot
dotnet ef migrations remove --project src/Data --startup-project src/Api
```

## Testing Patterns

### In-Memory Provider (Unit Tests)

Use `Microsoft.EntityFrameworkCore.InMemory` for pure unit tests where SQL semantics are not required.

```csharp
public class OrderServiceTests
{
    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task PlaceOrder_PersistsOrderAndLines()
    {
        await using var db = CreateContext();
        var service = new OrderService(db);

        await service.PlaceOrderAsync(new PlaceOrderRequest
        {
            Reference = "ORD-001",
            Lines = [new OrderLineRequest { ProductId = 1, Quantity = 2 }]
        });

        var order = await db.Orders.Include(o => o.Lines).FirstAsync();
        Assert.Equal("ORD-001", order.Reference);
        Assert.Single(order.Lines);
    }
}
```

> **Limitation**: The in-memory provider does not enforce referential integrity, constraints, or raw SQL. Use the SQLite provider for those scenarios.

### SQLite Provider (Integration Tests)

Use `Microsoft.EntityFrameworkCore.Sqlite` with `DataSource=:memory:` for tests that require real SQL semantics without an external database.

```csharp
public class OrderRepositoryTests : IDisposable
{
    private readonly SqliteConnection _connection;
    private readonly AppDbContext _db;

    public OrderRepositoryTests()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(_connection)
            .Options;

        _db = new AppDbContext(options);
        _db.Database.EnsureCreated();
    }

    [Fact]
    public async Task GetOrderById_ReturnsCorrectOrder()
    {
        _db.Orders.Add(new Order { Reference = "ORD-001" });
        await _db.SaveChangesAsync();

        var repo = new OrderRepository(_db);
        var order = await repo.GetByIdAsync(1);

        Assert.Equal("ORD-001", order.Reference);
    }

    public void Dispose()
    {
        _db.Dispose();
        _connection.Dispose();
    }
}
```

### Shared Test DbContextFactory

Centralise context creation to avoid duplication across test classes.

```csharp
public static class TestDbContextFactory
{
    public static AppDbContext CreateSqlite()
    {
        var connection = new SqliteConnection("DataSource=:memory:");
        connection.Open();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(connection)
            .Options;

        var db = new AppDbContext(options);
        db.Database.EnsureCreated();
        return db;
    }

    public static AppDbContext CreateInMemory() =>
        new(new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options);
}
```

### Repository Abstraction Pattern

Wrap DbContext behind an interface to keep business logic testable without EF Core dependencies in upper layers.

```csharp
public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<Order>> GetAllAsync(CancellationToken ct = default);
    void Add(Order order);
    Task SaveChangesAsync(CancellationToken ct = default);
}

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _db;
    public OrderRepository(AppDbContext db) => _db = db;

    public Task<Order?> GetByIdAsync(int id, CancellationToken ct = default) =>
        _db.Orders.Include(o => o.Lines).FirstOrDefaultAsync(o => o.Id == id, ct);

    public Task<IReadOnlyList<Order>> GetAllAsync(CancellationToken ct = default) =>
        _db.Orders.AsNoTracking()
                  .ToListAsync(ct)
                  .ContinueWith(t => (IReadOnlyList<Order>)t.Result, ct);

    public void Add(Order order) => _db.Orders.Add(order);

    public Task SaveChangesAsync(CancellationToken ct = default) =>
        _db.SaveChangesAsync(ct);
}
```

## Migration Checklist

- [ ] Audit all EF6 entities, mappings, and custom conventions
- [ ] Remove EDMX and generated files; switch to Code First
- [ ] Replace `System.Data.Entity` references with `Microsoft.EntityFrameworkCore`
- [ ] Rewrite `DbContext` and entity configurations
- [ ] Replace removed or renamed APIs (`SqlQuery`, `ObjectSet`, etc.)
- [ ] Decide on lazy loading strategy (proxy vs explicit eager loading)
- [ ] Scaffold Code First migrations from the new model
- [ ] Apply migrations in a dev environment and validate schema
- [ ] Add `Database.MigrateAsync()` to startup for automatic migration
- [ ] Write unit tests using the in-memory provider
- [ ] Write integration tests using the SQLite in-memory provider
- [ ] Validate query behaviour and performance parity with EF6 baseline

## References

- [EF Core documentation](https://learn.microsoft.com/ef/core/)
- [Porting from EF6 to EF Core](https://learn.microsoft.com/ef/efcore-and-ef6/porting/)
- [EF Core migrations overview](https://learn.microsoft.com/ef/core/managing-schemas/migrations/)
- [Testing with EF Core](https://learn.microsoft.com/ef/core/testing/)
