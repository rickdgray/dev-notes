---
title: CSharp For Newbies
friendlyTitle: C# For Newbies
lastmod: 2023-05-27T22:14:39-05:00
---
# C# for Newbies
Stuff I wish I knew when I started
## General Syntax
Microsoft encourages the use of `var`. They've gone back and forth on this a few times, but I think they've settled on `var` for good now.

Know [null conditional operators](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/member-access-operators#null-conditional-operators--and-) and the [null coalescing operator](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/null-coalescing-operator) too.

Classes are nullable by default; primitives are not. You can make primitives nullable using the `?`.
```csharp
bool? nullableBool;
```
If you don't want your classes to be nullable by default, you can set that option in the `.csproj` file.
```xml
<Nullable>enable</Nullable>
```

You can set default parameters on methods by just using an equal sign:
```csharp
void add(int i, int j = 1);
```

Don't use `+` to combine strings; it's gross. Don't use composite strings either. Use [interpolation](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/tokens/interpolated). See examples [here](CSharp#String%20Literal%20Variants).

To convert from string to something, use `.TryParse()`. It returns a bool and has an `out` parameter that you must pass by reference for the parser to populate.
```csharp
var a = "1";
if (int.TryParse(a, out int number))
	return number;
```

The `DateTime` and `TimeSpan` classes are [amazing](CSharp#Date%20and%20Time).

## Collections
`List`, `Dictionary` (C# version of hashmaps), and other collections implement [`IEnumberable`](https://docs.microsoft.com/en-us/dotnet/api/system.collections.ienumerable). It allows for the use of `foreach` and other things. It does not have a `.Count` for tracking iteration however; it's meant to be used declaratively. Use a `for` loop instead for that.

Unlike most languages, `Dictionary` throws an exception if the key isn't found so be sure to check with `.ContainsKey(key)`.

## Classes
[Know the difference](https://stackoverflow.com/questions/295104/what-is-the-difference-between-a-field-and-a-property) between a field and a property. See examples [here](CSharp#Autoprops).

You can instantiate properties of a class at the same time you declare the class itself. You don't even need the parenthesis:
```csharp
var dude = new Person
{
	Name = "Jake"
};
```

## Concurrency
`async`, `await`, and `Task` are [crucial to know](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/async/) and very easy to use.

[Actions](https://docs.microsoft.com/en-us/dotnet/api/system.action-2) and [Functions](https://docs.microsoft.com/en-us/dotnet/api/system.func-2) are formalized delegates. In other words, they are classes used to construct callbacks or promises. You can make your own delegate manually if you like but it's a really deep and complicated topic. Don't recommend; just stick with actions or even just lambdas.

## LINQ
LINQ has two "formats": one being literal psuedoSQL and the other using lambda expressions. Naturally, I like lambdas more.

Try to stick to the [`OrDefault()` options](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.firstordefault). They almost always return null for default (in other words, couldn't find the thing). The non-`OrDefault()` options throw an exception.

## EF Core
TODO: this section is very dense and technical. Need to make it friendly

The main ORM used in the .NET ecosystem is [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/querying/). It replaces the old Entity Framework 6. Confusingly, both are often referred to just as Entity Framework (EF). When looking up documentation, be sure you are reading about EF Core, not EF 6.

Foreign keys in Entity Framework only require the actual ID property to work, but if you want to be able to access the linked entity's properties, you need a [navigation property](https://learn.microsoft.com/en-us/ef/core/modeling/relationships/navigations) which is just a "virtual" of the class with the same name minus "Id." EF will populate it automatically and track all changes.
```csharp
class student
{
	Guid Id;
	Guid ClassId;
	virtual Class class;
}
```

If you don't wanna track changes, such as when only reading data from the database, use `AsNoTracking()`.

## Serialization
Nearly all `json` serializing is done using [Newtonsoft](https://www.newtonsoft.com/json), also called Json.NET. For years Microsoft had not written their own and, surprisingly, a lot of their official code and documentation rely on it. They have created their own now, but adoption has been *very* slow. Newtonsoft is still the dominate option and I realistically don't expect that to change.

## Dependency Injection
A dependency injection tool only very recently was developed by MS and it's my favorite. Before that, you used a 3rd party one like Ninject, Autofac, or Unity (those are the big ones).

The universally accepted but not-written-down-anywhere naming convention is to use an underscore at the beginning of injected services. See examples [here](CSharp#Dependency%20Injection).

## ASP.NET
Do a [tutorial](https://learn.microsoft.com/en-us/aspnet/core/web-api/) on creating a web API with ASP.NET. It'll get you familiar with how controllers are set up as well as the initialization.

There's been a few variants to how the `Program.cs` and `Startup.cs` classes work over the years. Now, the default way is called a [Minimal API](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/overview). It is quite nice and simple and eliminates the `Startup.cs` class altogether. You can of course always revert to the more complete style.

## Visual Studio
TODO: explain csproj file more

Use `ctrl+.` in Visual Studio to get recommendations on errors or the little gray dotted underlines. It will automatically fill out your class if you didn't completely impliment your interface, for example. TODO: .editorconfig

## Advanced Topics
### Reflection
Look at `Type.GetProperties` and `GetType`.
