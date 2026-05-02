---
name: Entity Framework Migration
description: Guide for migrating from Entity Framework 6 to EF Core with code patterns, configuration, and testing strategies
maturity: beta
category: data-access
tags:
  - entity-framework
  - ef-core
  - data-access
  - orm
  - migration
audience:
  - backend-developers
  - data-engineers
  - platform-engineers
compatibility:
  - github-copilot
  - ide
  - terminal
  - cli
allowed-tools:
  - terminal
  - dotnet-cli
  - text-editor
  - visual-studio
---

## Entity Framework 6 → EF Core Migration Guide

This skill provides detailed guidance for migrating from Entity Framework 6 (or earlier) to Entity Framework Core, covering code patterns, configuration, testing, and common pitfalls.

---

## Part 1: Assessment & Planning

### 1.1 Current State Analysis

Before migration, inventory your EF6 usage:

```csharp
// Common EF6 patterns to track
1. DbContext initialization
2. DbSet declarations and queries
3. Migrations and data initialization
4. Lazy loading configuration
5. Custom value converters
6. Stored procedures and raw SQL
7. Relationships (1-to-many, many-to-many)
8. Inheritance patterns (TPH, TPT, TPC)
```

**Checklist:**
- [ ] DbContext classes: Count ___
- [ ] Entities: Count ___
- [ ] Migrations: Count ___
- [ ] Stored procedures: Count ___
- [ ] Raw SQL queries: Count ___
- [ ] Custom value converters: Count ___
- [ ] Inheritance patterns used (TPH/TPT/TPC): ___

### 1.2 Compatibility Assessment

Check for EF6-specific features:

```csharp
// EF6 ONLY - No direct EF Core equivalent
1. Code-First with legacy databases (possible but complex)
2. EDMX (Entity Data Model XML) designer
3. T4 templates for code generation
4. Automatic migrations
5. Custom conventions at model level
6. Entity splitting (one entity → multiple tables)

// EF Core Equivalent Available
1. Database-First (use Scaffold-DbContext)
2. Fluent API (enhanced in EF Core)
3. Migrations (improved, but different syntax)
4. Lazy loading (via lazy loading proxies package)
5. Global query filters
6. Shadow properties
```

**Decision Matrix:**
| Feature | EF6 | EF Core | Migration Path |
|---------|-----|---------|-----------------|
| DbContext | ✓ | ✓ | Direct |
| Migrations | ✓ | ✓ | Rewrite |
| Lazy Loading | ✓ | Via package | Add package |
| EDMX Designer | ✓ | ✗ | Use Fluent API |
| Automatic Migrations | ✓ | ✗ | Manual migrations |

---

## Part 2: DbContext Migration

### 2.1 DbContext Class

**EF6 Pattern:**
```csharp
public class MyDbContext : DbContext {
    public MyDbContext() : base("name=MyConnectionString") {
        // Connection string from app.config
    }
    
    public DbSet<User> Users { get; set; }
    public DbSet<Order> Orders { get; set; }
    
    protected override void OnModelCreating(DbModelBuilder modelBuilder) {
        // Configure model
        modelBuilder.Entity<User>().HasMany(u => u.Orders);
    }
}
```

**EF Core Pattern:**
```csharp
public class MyDbContext : DbContext {
    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options) {
        // Constructor injection of options
    }
    
    public DbSet<User> Users { get; set; }
    public DbSet<Order> Orders { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        // Configure model (fluent API enhanced)
        modelBuilder.Entity<User>()
            .HasMany(u => u.Orders)
            .WithOne(o => o.User)
            .HasForeignKey(o => o.UserId);
    }
}
```

**Key Changes:**
1. Constructor takes `DbContextOptions<T>` (dependency injection)
2. No parameterless constructor (options come from DI)
3. `DbModelBuilder` → `ModelBuilder`
4. Fluent API is the primary configuration method

### 2.2 Dependency Injection Setup

**Old Pattern (Startup.cs or Application_Start):**
```csharp
// Web.config connection string
<configuration>
  <connectionStrings>
    <add name="MyConnectionString" 
         connectionString="Server=...;" />
  </connectionStrings>
</configuration>
```

**New Pattern (Program.cs):**
```csharp
// appsettings.json
{
  "ConnectionStrings": {
    "MyConnectionString": "Server=...;"
  }
}

// Program.cs
var builder = WebApplication.CreateBuilder(args);

// Register DbContext with connection string
builder.Services.AddDbContext<MyDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("MyConnectionString")));

var app = builder.Build();
```

---

### 2.3 Entity Configuration

**EF6 Fluent API:**
```csharp
protected override void OnModelCreating(DbModelBuilder modelBuilder) {
    modelBuilder.Entity<User>()
        .HasKey(u => u.Id)
        .ToTable("Users");
    
    modelBuilder.Entity<User>()
        .Property(u => u.Email)
        .IsRequired()
        .HasMaxLength(256);
    
    modelBuilder.Entity<User>()
        .HasMany(u => u.Orders)
        .WithRequired(o => o.User)
        .HasForeignKey(o => o.UserId)
        .WillCascadeOnDelete(true);
}
```

**EF Core Fluent API:**
```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder) {
    modelBuilder.Entity<User>(entity => {
        entity.HasKey(u => u.Id);
        entity.ToTable("Users");
        
        entity.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(256);
        
        entity.HasMany(u => u.Orders)
            .WithOne(o => o.User)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    });
}
```

**Data Annotations (alternative to Fluent API):**
```csharp
public class User {
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(256)]
    public string Email { get; set; }
    
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}

public class Order {
    [Key]
    public int Id { get; set; }
    
    [ForeignKey(nameof(User))]
    public int UserId { get; set; }
    
    public User User { get; set; }
}
```

---

## Part 3: Queries & LINQ

### 3.1 LINQ Translation Differences

**EF6 vs. EF Core Query Behavior:**

**Lazy Evaluation (same in both):**
```csharp
// Neither executes immediately
var query = context.Users.Where(u => u.IsActive);

// Executes when enumerated
var users = query.ToList();
```

**Different LINQ Translation:**

❌ **EF6 - Client-side evaluation:**
```csharp
// EF6 moved evaluation to client if not translatable
var users = context.Users
    .Where(u => u.Email.ToLower() == "test@example.com")  // May be client-side
    .ToList();
```

✅ **EF Core - Server-side translation:**
```csharp
// EF Core logs a warning for non-translatable queries
var users = context.Users
    .Where(u => u.Email.ToLower() == "test@example.com")  // Translated to server
    .ToList();

// Or be explicit
var users = context.Users
    .Where(u => EF.Functions.Like(u.Email, "test%"))  // SQL functions
    .ToList();
```

### 3.2 Lazy Loading Changes

**EF6 Lazy Loading (by default):**
```csharp
var user = context.Users.Find(userId);
// This query automatically loads User.Orders (lazy loaded)
foreach (var order in user.Orders) { }
```

**EF Core: Explicit Loading Required:**
```csharp
var user = context.Users.Find(userId);
// Without explicit load, Orders is empty
await context.Entry(user).Collection(u => u.Orders).LoadAsync();

// Or use Include (eager loading)
var user = context.Users
    .Include(u => u.Orders)
    .FirstOrDefault(u => u.Id == userId);
```

**Enable Lazy Loading Proxies (if needed):**
```csharp
// In Program.cs
builder.Services.AddDbContext<MyDbContext>(options =>
    options.UseSqlServer(connectionString)
           .UseLazyLoadingProxies());  // Requires NuGet: Microsoft.EntityFrameworkCore.Proxies

// Then EF6-style lazy loading works
var user = context.Users.Find(userId);
foreach (var order in user.Orders) { }  // Auto-loaded
```

---

## Part 4: Relationships & Inheritance

### 4.1 Relationships

**One-to-Many:**
```csharp
// EF Core Fluent API
modelBuilder.Entity<User>()
    .HasMany(u => u.Orders)
    .WithOne(o => o.User)
    .HasForeignKey(o => o.UserId);

// Alternative: Data Annotations
public class Order {
    [ForeignKey(nameof(User))]
    public int UserId { get; set; }
    public User User { get; set; }
}
```

**Many-to-Many:**
```csharp
// EF6 - Required join table entity
public class Student {
    public int Id { get; set; }
    public ICollection<Enrollment> Enrollments { get; set; }
}

public class Course {
    public int Id { get; set; }
    public ICollection<Enrollment> Enrollments { get; set; }
}

public class Enrollment {
    public int StudentId { get; set; }
    public int CourseId { get; set; }
    public Student Student { get; set; }
    public Course Course { get; set; }
}
```

```csharp
// EF Core - Automatic join table
public class Student {
    public int Id { get; set; }
    public ICollection<Course> Courses { get; set; } = new List<Course>();
}

public class Course {
    public int Id { get; set; }
    public ICollection<Student> Students { get; set; } = new List<Student>();
}

// Configure in OnModelCreating
modelBuilder.Entity<Student>()
    .HasMany(s => s.Courses)
    .WithMany(c => c.Students)
    .UsingEntity(j => j.ToTable("StudentCourses"));
```

### 4.2 Inheritance Patterns

**Table-Per-Hierarchy (TPH):**
```csharp
// Both EF6 and EF Core support TPH (default)
public abstract class Vehicle {
    public int Id { get; set; }
    public string Type { get; set; }  // Discriminator column
}

public class Car : Vehicle {
    public int NumberOfDoors { get; set; }
}

public class Truck : Vehicle {
    public double PayloadCapacity { get; set; }
}

// EF Core configuration
modelBuilder.Entity<Vehicle>()
    .HasDiscriminator<string>("Type")
    .HasValue<Car>("Car")
    .HasValue<Truck>("Truck");
```

**Table-Per-Type (TPT):**
```csharp
// EF Core supports TPT (new in EF Core 5.0)
modelBuilder.Entity<Vehicle>().ToTable("Vehicles");
modelBuilder.Entity<Car>().ToTable("Cars");
modelBuilder.Entity<Truck>().ToTable("Trucks");
```

---

## Part 5: Migrations

### 5.1 Initial Migration

**Create initial migration from existing database:**

```powershell
# Scaffold DbContext from existing database
dotnet ef dbcontext scaffold "Server=...;" Microsoft.EntityFrameworkCore.SqlServer `
    --context MyDbContext `
    --output-dir Models `
    --use-database-names
```

**Create initial migration for Code-First:**

```powershell
# Add initial migration
dotnet ef migrations add InitialCreate

# Apply migration to database
dotnet ef database update
```

### 5.2 Migration Syntax Differences

**EF6 Migration:**
```csharp
public override void Up() {
    CreateTable(
        "dbo.Users",
        c => new {
            Id = c.Int(nullable: false, identity: true),
            Email = c.String(maxLength: 256),
        })
        .PrimaryKey(t => t.Id);
}

public override void Down() {
    DropTable("dbo.Users");
}
```

**EF Core Migration:**
```csharp
protected override void Up(MigrationBuilder migrationBuilder) {
    migrationBuilder.CreateTable(
        name: "Users",
        schema: "dbo",
        columns: table => new {
            Id = table.Column<int>(type: "int", nullable: false)
                .Annotation("SqlServer:Identity", "1, 1"),
            Email = table.Column<string>(type: "nvarchar(256)", nullable: true),
        },
        constraints: table => {
            table.PrimaryKey("PK_Users", x => x.Id);
        });
}

protected override void Down(MigrationBuilder migrationBuilder) {
    migrationBuilder.DropTable("Users", "dbo");
}
```

---

## Part 6: Raw SQL & Stored Procedures

### 6.1 Raw SQL Queries

**EF6:**
```csharp
var users = context.Users
    .SqlQuery("SELECT * FROM Users WHERE IsActive = 1")
    .ToList();
```

**EF Core:**
```csharp
var users = context.Users
    .FromSqlRaw("SELECT * FROM Users WHERE IsActive = 1")
    .ToList();

// With parameters (safer)
var isActive = true;
var users = context.Users
    .FromSqlInterpolated($"SELECT * FROM Users WHERE IsActive = {isActive}")
    .ToList();
```

### 6.2 Stored Procedures

**EF6:**
```csharp
var result = context.Database.ExecuteSqlCommand(
    "EXEC sp_UpdateUser @UserId, @Email",
    new SqlParameter("@UserId", userId),
    new SqlParameter("@Email", email));
```

**EF Core:**
```csharp
var result = await context.Database.ExecuteSqlRawAsync(
    "EXEC sp_UpdateUser @UserId, @Email",
    new SqlParameter("@UserId", userId),
    new SqlParameter("@Email", email));

// Or map to entity type
var users = await context.Users
    .FromSqlRaw("EXEC sp_GetActiveUsers")
    .ToListAsync();
```

---

## Part 7: Testing

### 7.1 Test DbContext Setup

**Option 1: In-Memory Database (testing only):**
```csharp
var options = new DbContextOptionsBuilder<MyDbContext>()
    .UseInMemoryDatabase(databaseName: "TestDb")
    .Options;

using (var context = new MyDbContext(options)) {
    // Arrange: Add test data
    context.Users.Add(new User { Id = 1, Email = "test@example.com" });
    context.SaveChanges();
    
    // Act: Test query
    var user = context.Users.FirstOrDefault(u => u.Email == "test@example.com");
    
    // Assert
    Assert.NotNull(user);
}
```

**Option 2: SQLite for File-Based Tests:**
```csharp
var connection = new SqliteConnection("DataSource=:memory:");
connection.Open();

var options = new DbContextOptionsBuilder<MyDbContext>()
    .UseSqlite(connection)
    .Options;

using (var context = new MyDbContext(options)) {
    context.Database.EnsureCreated();  // Create schema
    // ... test code ...
}
```

**Option 3: Mock IQueryable (most isolated):**
```csharp
var mockUsers = new List<User> {
    new User { Id = 1, Email = "test@example.com" }
}.AsQueryable();

var mockSet = new Mock<DbSet<User>>();
mockSet.As<IQueryable<User>>().Setup(m => m.Provider).Returns(mockUsers.Provider);
mockSet.As<IQueryable<User>>().Setup(m => m.Expression).Returns(mockUsers.Expression);
mockSet.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(mockUsers.ElementType);
mockSet.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(mockUsers.GetEnumerator());

var mockContext = new Mock<MyDbContext>();
mockContext.Setup(c => c.Users).Returns(mockSet.Object);

// Use mockContext in test
```

### 7.2 Validation Patterns

**Test: Entity Configuration**
```csharp
[Test]
public void User_Email_IsRequired() {
    var options = new DbContextOptionsBuilder<MyDbContext>()
        .UseInMemoryDatabase("Test")
        .Options;
    
    using (var context = new MyDbContext(options)) {
        var user = new User { Email = null };
        context.Users.Add(user);
        
        // Should throw validation error
        var ex = Assert.Throws<DbUpdateException>(
            () => context.SaveChanges());
    }
}
```

**Test: Relationships**
```csharp
[Test]
public void Order_UserRelationship_Works() {
    var options = new DbContextOptionsBuilder<MyDbContext>()
        .UseInMemoryDatabase("Test")
        .Options;
    
    using (var context = new MyDbContext(options)) {
        var user = new User { Email = "test@example.com" };
        var order = new Order { UserId = 1, User = user };
        
        context.Users.Add(user);
        context.Orders.Add(order);
        context.SaveChanges();
        
        // Reload and verify
        var savedOrder = context.Orders
            .Include(o => o.User)
            .FirstOrDefault();
        
        Assert.AreEqual("test@example.com", savedOrder.User.Email);
    }
}
```

---

## Common Issues & Troubleshooting

### Issue: "No tracked entity with key..."

**Problem:** Trying to update/delete entity not tracked by context

```csharp
// BAD
var user = new User { Id = 1, Email = "new@example.com" };
context.Users.Update(user);
context.SaveChanges();

// GOOD
var user = context.Users.Find(1);
user.Email = "new@example.com";
context.SaveChanges();

// Or
context.Users.Update(new User { Id = 1, Email = "new@example.com" });
context.SaveChanges();
```

### Issue: "Sequence contains no matching element"

**Problem:** LINQ query returns no results but code assumes one

```csharp
// BAD
var user = context.Users.First(u => u.Email == "nonexistent@example.com");

// GOOD
var user = context.Users.FirstOrDefault(u => u.Email == "nonexistent@example.com");
if (user != null) {
    // Use user
}
```

### Issue: Performance Degradation

**Problem:** Lazy loading or N+1 queries in EF Core

```csharp
// BAD - N+1 queries
var users = context.Users.ToList();
foreach (var user in users) {
    var orders = user.Orders;  // Separate query per user
}

// GOOD - Eager loading
var users = context.Users
    .Include(u => u.Orders)
    .ToList();
```

---

## References

- [EF Core Documentation](https://learn.microsoft.com/en-us/ef/core/)
- [EF6 vs. EF Core Feature Comparison](https://learn.microsoft.com/en-us/ef/efcore-and-ef6/)
- [EF Core LINQ Translation](https://learn.microsoft.com/en-us/ef/core/querying/how-query-works)
- [EF Core Migrations](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/)
- [EF Core Testing](https://learn.microsoft.com/en-us/ef/core/testing/)

---

## Next Steps

1. **Audit** — Use Part 1 to assess current EF6 usage
2. **Plan** — Identify which patterns to migrate first
3. **Migrate** — Follow Parts 2-5 for DbContext, queries, and migrations
4. **Test** — Use Part 7 patterns for validation
5. **Deploy** — Validate in staging before production

Questions? Use the `.NET Modernization Advisor` agent for guidance.
