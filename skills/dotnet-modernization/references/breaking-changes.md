---
name: .NET Breaking Changes Reference
description: Comprehensive catalog of breaking changes across .NET versions (6, 8, 10) with code examples and mitigation strategies
---

# .NET Breaking Changes Reference

This document catalogs breaking changes across .NET versions, organized by category with code examples and migration paths.

## .NET Framework 4.8 → .NET 8 / .NET 10

### Framework & Namespace Removals

#### ❌ System.Web (Complete Removal)

**Affected:** ASP.NET apps relying on System.Web

**Removed:**
- `System.Web.HttpContext`, `HttpRequest`, `HttpResponse`
- `System.Web.Mvc` (use ASP.NET Core instead)
- Application state, session management (moved to middleware)

**Before (.NET Framework):**
```csharp
public class Global : HttpApplication {
    protected void Application_Start() {
        // Application initialization
    }
}

var context = HttpContext.Current;
var session = context.Session["key"];
```

**After (.NET Core / .NET 8):**
```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSession();
var app = builder.Build();
app.UseSession();

// In controller/middleware
public class MyController : ControllerBase {
    private readonly IHttpContextAccessor _httpContextAccessor;
    
    public MyController(IHttpContextAccessor httpContextAccessor) {
        _httpContextAccessor = httpContextAccessor;
    }
    
    public IActionResult MyAction() {
        var session = _httpContextAccessor.HttpContext.Session;
        session.SetString("key", "value");
        return Ok();
    }
}
```

**Migration Path:**
1. Replace `HttpContext.Current` with dependency-injected `IHttpContextAccessor`
2. Use middleware for cross-cutting concerns
3. Use configuration providers for app settings
4. Migrate from `IIS` to Kestrel (built-in web server)

---

#### ❌ AppDomains & Remoting

**Removed:**
- `System.AppDomain` and child domains
- `System.Runtime.Remoting`
- `MarshalByRefObject`

**Why:** Single AppDomain per process in .NET Core. Remoting replaced by gRPC/HTTP APIs.

**Before:**
```csharp
// .NET Framework 4.8
AppDomain childDomain = AppDomain.CreateDomain("ChildDomain");
var obj = childDomain.DoCallBack(() => { /* code */ });
```

**After:**
```csharp
// .NET 8 - Use processes or services
// Option 1: Separate process
var process = Process.Start("app.exe");

// Option 2: gRPC or HTTP service
public class MyService {
    // Implement as service instead of RemotingServices
}
```

---

### Data Access & Entity Framework

#### EF6 → EF Core Breaking Changes

**See:** `entity-framework-migration` skill for detailed guidance

Key changes:
- DbContext initialization patterns
- Lazy loading requires explicit configuration
- LINQ translation differences
- Migration generation and structure

---

### Async & Threading

#### ❌ SynchronizationContext Changes

**What Changed:**
- ASP.NET Core does not set a `SynchronizationContext` by default
- `.Wait()` or `.Result` can cause deadlocks with async code

**Before:**
```csharp
public async Task MyAsyncMethod() {
    var result = SomeAsyncOperation().Result;  // Blocked waiting!
}
```

**After:**
```csharp
public async Task MyAsyncMethod() {
    var result = await SomeAsyncOperation();  // Correct
}
```

**Fix:**
```csharp
// BAD - can deadlock on different contexts
var result = MyAsyncMethod().Result;

// GOOD - use await
var result = await MyAsyncMethod();

// OK - if you must block (rare)
var result = MyAsyncMethod().GetAwaiter().GetResult();
```

---

#### ❌ ConfigureAwait(false) Behavior

**What Changed:**
- In .NET Core, `ConfigureAwait(false)` behavior changed for UI libraries
- Most ASP.NET scenarios don't need it (no SynchronizationContext)

**Recommendation:**
```csharp
// .NET Framework (required to avoid deadlock)
var result = await SomeAsync().ConfigureAwait(false);

// .NET 8 (optional, but doesn't hurt)
var result = await SomeAsync().ConfigureAwait(false);  // Still safe
```

---

### LINQ & Reflection

#### ❌ LINQ to Objects Behavior Changes

**Problem:** Some LINQ operators behave differently:
- `GroupBy` with null keys
- `OrderBy` stability
- Null propagation in queries

**Before:**
```csharp
// .NET Framework - null keys grouped separately
var grouped = items.GroupBy(x => x.Category);
```

**After:**
```csharp
// .NET 8 - null handling consistent
var grouped = items.GroupBy(x => x.Category ?? "Uncategorized");
```

---

#### ❌ Assembly Reflection Changes

**Breaking:** 
- `Assembly.LoadFile` and `Assembly.LoadWithPartialName` removed
- `AppDomain.AssemblyLoad` event removed

**Before:**
```csharp
var asm = Assembly.LoadFile("path/to/assembly.dll");
```

**After:**
```csharp
var asm = AssemblyLoadContext.Default.LoadFromAssemblyPath(
    Path.GetFullPath("path/to/assembly.dll"));
```

---

### Configuration & Startup

#### ❌ Web.config / App.config

**Removed:**
- `web.config` for ASP.NET Core (use `appsettings.json` instead)
- `app.config` for console apps (use configuration providers)

**Before:**
```xml
<!-- web.config -->
<configuration>
  <appSettings>
    <add key="Setting1" value="Value1" />
  </appSettings>
  <connectionStrings>
    <add name="Default" connectionString="..." />
  </connectionStrings>
</configuration>
```

**After:**
```json
// appsettings.json
{
  "Setting1": "Value1",
  "ConnectionStrings": {
    "Default": "Server=...;"
  }
}
```

**Access:**
```csharp
// In Program.cs
var builder = WebApplication.CreateBuilder(args);
var settings = builder.Configuration["Setting1"];
var connStr = builder.Configuration.GetConnectionString("Default");
```

---

#### ❌ Startup Class Changes

**Before (.NET Core 3.1):**
```csharp
public class Startup {
    public void ConfigureServices(IServiceCollection services) { }
    public void Configure(IApplicationBuilder app) { }
}
```

**After (.NET 6+):**
```csharp
// Program.cs - minimal hosting model
var builder = WebApplication.CreateBuilder(args);

// ConfigureServices equivalent
builder.Services.AddScoped<IMyService, MyService>();

var app = builder.Build();

// Configure equivalent
app.UseRouting();
app.MapControllers();

app.Run();
```

---

### Collections & Generics

#### ❌ Collection Initialization Syntax

**Problem:** Some implicit conversions removed

**Before:**
```csharp
// .NET Framework - implicit conversion
List<int> list = new int[] { 1, 2, 3 };  // Works
```

**After:**
```csharp
// .NET 8 - explicit conversion needed
List<int> list = new int[] { 1, 2, 3 }.ToList();  // Correct
// Or
int[] array = { 1, 2, 3 };  // Direct array
List<int> list = new List<int> { 1, 2, 3 };  // Direct list
```

---

### Serialization

#### ❌ System.Runtime.Serialization / DataContractSerializer

**Removed:**
- `DataContractSerializer` (moved to NuGet package)
- `ISerializable` interface (recommend alternatives)

**Before:**
```csharp
[DataContract]
public class MyClass {
    [DataMember]
    public string Name { get; set; }
}
```

**After (Recommended: System.Text.Json):**
```csharp
public class MyClass {
    public string Name { get; set; }
}

// Serialize
var json = JsonSerializer.Serialize(obj);
// Deserialize
var obj = JsonSerializer.Deserialize<MyClass>(json);
```

---

### Globalization & Encoding

#### ⚠ Default Encoding Changes

**What Changed:**
- Default encoding is UTF-8 in .NET 5+
- Code pages not available on non-Windows platforms

**Before:**
```csharp
var encoding = Encoding.Default;  // Might be ANSI
var bytes = encoding.GetBytes("hello");
```

**After:**
```csharp
// Explicit is better than implicit
var encoding = Encoding.UTF8;
var bytes = encoding.GetBytes("hello");
```

---

### Platform-Specific APIs

#### ❌ Windows-Only APIs

**Removed:** Many Windows-specific APIs not supported on Linux/macOS

**Affected:**
- Registry access (`Microsoft.Win32.Registry`)
- Event logs
- Performance counters
- COM interop (limited)

**Solution:**
```csharp
if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows)) {
    // Windows-specific code
    var registry = Microsoft.Win32.Registry.CurrentUser;
} else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux)) {
    // Linux-specific code
}
```

---

## .NET Core 3.1 → .NET 8 / .NET 10

Most changes are additive, but some behavioral changes exist:

### ⚠ Minor Breaking Changes

#### Nullable Reference Types Enforcement

**What Changed:** Nullable reference types enabled by default

**Before (.NET Core 3.1):**
```csharp
string? nullable = null;  // Explicitly nullable
string notNull = "value";
```

**After (.NET 8+):**
```csharp
#nullable enable  // Enable if not already

string? nullable = null;
string notNull = "value";  // Compiler warns if assignment could be null
```

---

#### LINQ Query Parameter Ordering

**What Changed:** Some query operator behaviors modified for performance

**Example:**
```csharp
// May have different execution order in .NET 8
var query = items
    .Where(x => x.IsActive)
    .OrderBy(x => x.Name)
    .Take(10);
```

**Safe:** Behavior depends on LINQ provider (IQueryable vs. IEnumerable)

---

## Migration Decision Matrix

| Issue | Severity | Strategy | Effort |
|-------|----------|----------|--------|
| System.Web removal | Critical | Migrate to middleware | 2-5 days |
| AppDomain/Remoting | Critical | Use services/gRPC | 1-3 days |
| EF6 → EF Core | High | Use migration skill | 3-7 days |
| Web.config → appsettings | High | Configuration provider | 1-2 days |
| Async/await patterns | Medium | Code review & fix | 1-2 days |
| LINQ behavior | Low | Add tests, verify | 1 day |
| Reflection APIs | Low | Use new reflection | 0.5-1 day |

---

## Quick Checklist

Before upgrading, verify:

- [ ] All direct NuGet dependencies support target .NET version
- [ ] No System.Web, AppDomain, or Remoting usage (or migrate first)
- [ ] Configuration moved from web.config to appsettings.json
- [ ] Entity Framework usage identified (EF6 → EF Core migration needed)
- [ ] No Windows-only APIs required (or use platform checks)
- [ ] Async/await patterns reviewed for SynchronizationContext issues
- [ ] Tests pass with new target framework
- [ ] Performance baseline established and validated

---

## Additional Resources

- [Microsoft: Breaking Changes in .NET](https://learn.microsoft.com/en-us/dotnet/core/compatibility/)
- [Breaking Changes in .NET 8](https://learn.microsoft.com/en-us/dotnet/core/compatibility/8.0)
- [Breaking Changes in .NET 9/10](https://learn.microsoft.com/en-us/dotnet/core/compatibility/9.0)
- [Entity Framework Core Migration](https://learn.microsoft.com/en-us/ef/core/)
