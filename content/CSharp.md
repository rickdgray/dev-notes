---
title: CSharp
friendlyTitle: C#
lastmod: 2023-05-28T00:01:35-05:00
---
# C#
I'm tired of having to look up simple things that I can't immediately remember.
## Configuration
Given this example `appsettings.json`
```json
{
	"Position": {
		"Title": "Editor",
		"Name": "Joe Smith"
	}
}
```
### Access in Program/Startup
Accessing configuration info in builder
```csharp
var test = builder.Configuration["Position:Title"];
Console.Writeline(test);
```
### IOptions Pattern
Matching class
```csharp
public class PositionOptions
{
    public const string Name = "Position";

    public string Title { get; set; } = String.Empty;
    public string Name { get; set; } = String.Empty;
}
```
binding in program.cs
```csharp
builder.Services.Configure<PositionOptions>(
    builder.Configuration.GetSection(PositionOptions.Name));
```
dependency injection
```csharp
private readonly PositionOptions _positionOptions;

public MyController(IOptions<PositionOptions> positionOptions)
{
	_positionOptions = positionOptions.Value;
}
```
## Date and Time
```csharp
// Declare specific date and time
var d = new DateTime(2023, 2, 8, 10, 00, 00).AddDays(120);

// Date only
var c = new DateOnly(2023, 6, 8);
Console.WriteLine(c.AddDays(-30).ToShortDateString());

// Parse from ISO
DateTime.ParseExact("2023-04-14T15:24:22.3552219-05:00", "o", CultureInfo.InvariantCulture);

// Print ISO
Console.WriteLine(b.ToString("F"));

// Few ways to get string of month; 13th month is blank string. There is no enum.
CultureInfo.CurrentCulture.DateTimeFormat.MonthNames.First();
CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(DateTime.Now.Month);
DateTimeFormatInfo.CurrentInfo.MonthNames.First();
DateTimeFormatInfo.CurrentInfo.GetMonthName(DateTime.Now.Month);

// Day of week enum
System.DayOfWeek.Monday
```
### Leap year bug
This will throw an exception when a leap day comes around!
```csharp
var nextYear = new DateTime(current.Year + 1, current.Month, current.Day);
```
Be sure to instead use the built in method.
```csharp
var nextYear = current.AddYears(1);
```
## Time Zone
```csharp
// TBD? Probably just use nodatime
```
## File I/O
### Read Entire File
```csharp
var path = @"c:\temp\MyTest.txt";
if (!File.Exists(path))
{
	File.WriteAllLines(path, "new text, ");
	File.AppendAllText(path, "appended text");
	File.ReadAllLines(path);
}
```
### Read by Line
```csharp
var workingDirectory = new DirectoryInfo(Directory.GetCurrentDirectory());
var path = Path.Combine(
	workingDirectory?.FullName ?? throw new DirectoryNotFoundException(),
	"file.txt"
);
using var fileStream = File.OpenRead(path);
using var streamReader = new StreamReader(fileStream);

var data = new List<string>();
string? line;
while ((line = streamReader.ReadLine()) != null)
{
    data.Add(line);
}
```
## XML Parsing
```csharp
using System.Xml;
using System.Xml.Linq;

using var readStream = File.OpenRead(path);
using XmlReader reader = XmlReader.Create(readStream, new XmlReaderSettings
{
	IgnoreComments = false
});

while (reader.Read())
{
	switch (reader.NodeType)
	{
		case XmlNodeType.Element:
			var data = XElement.Parse(reader.Value);
			break;
		case XmlNodeType.Text:
			break;
		case XmlNodeType.CDATA:
			break;
		default:
			break;
	}
}
```
## LINQ
```csharp
// TBD
```
## String Literal Variants
### Composite
This is the old way and should only be used for logging. [Alignment](https://learn.microsoft.com/en-us/dotnet/standard/base-types/composite-formatting#alignment-component) of tabular data is also possible.
```csharp
string.Format("The time is {0}", DateTime.Now)
```
### Interpolation
The preferred way mostly. [Alignment](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/tokens/interpolated#structure-of-an-interpolated-string) also possible.
```csharp
$"The time is {DateTime.Now}"
```
### Verbatim
For when your string will require many escaped characters. Allows for multiline strings. You still have to escape double quotes, however.
```csharp
@"c:\documents\files\u0066.txt"
@"He said, ""This is the last \u0063hance\x0021"""
```
### Verbatim Interpolated
To interpolate your verbatim string. Can use both `@$` or `$@` to indicate.
```csharp
$@"The time is
    {DateTime.Now}"
```
### Raw
Even easier multiline strings. No escaped characters and includes whitespace and new lines. New lines at the beginning and end are trimmed, however.
```csharp
"""
This is a multi-line
    string literal with the second line indented.
"""
```
### Raw Interpolated
To interpolate your raw string. Also allows printing braces with interpolation.
```csharp
$"""The point "{X}, {Y}" is {Math.Sqrt(X * X + Y * Y)} from the origin"""
$$"""The point {{{X}}, {{Y}}} is {{Math.Sqrt(X * X + Y * Y)}} from the origin"""
```
### UTF-8
.NET strings are UTF-16 by default, but UTF-8 is the standard for web. They are not compile time and cannot be interpolated.
```csharp
"AUTH "u8
```
## Exceptions
Never throw caught exceptions!
```csharp
try
{
	throw new Exception();
}
catch (Exception e)
{
	throw e; // Don't do this!!
}
```
Do this instead:
```csharp
catch (Exception e)
{
	_logger.Error("Error: ", e);
	throw; // Note the missing parameter!
}
```

Calling `throw;` without passing in an exception as an argument acts as a handoff; the original exception simply continues to bubble up the stack. Passing the exception as an argument creates a **new** exception with only some of the data in the original exception.

Why is this bad?

**Because the newly created exception does not contain the complete call stack. You are losing valuable information!**

Furthermore, if you have nothing add, just don't catch the exception.

**Always throw exceptions as far down the stack as possible.**
**Always catch exceptions as far up the stack as possible.**

This will provide the most information and context to exactly what went wrong and allow you to handle the exception with the best judgement.

## Signatures
Parameters should be as as generic as possible, and return types should be as specific as possible.
Don't do this:
```csharp
public IEnumerable<int> Calculate(List<int> nums) { ... }
```
Do this:
```csharp
public List<int> Calculate(IEnumerable<int> nums) { ... }
```
TODO: explain
## Access Modifiers
An [assembly](https://learn.microsoft.com/en-us/dotnet/standard/glossary#assembly) is a _.dll_ or _.exe_ created by compiling one or more _.cs_ files in a single compilation. In short, another project.

| Caller's location                      | `public` | `protected internal` | `protected` | `internal` | `private protected` | `private` |
| -------------------------------------- | :------: | :------------------: | :---------: | :--------: | :-----------------: | :-------: |
| Within the class                       |    ✔️️     |          ✔️           |      ✔️      |     ✔️      |          ✔️          |     ✔️     |
| Derived class                          |    ✔️     |          ✔️           |      ✔️      |     ✔️      |          ✔️          |     ❌     |
| Non-derived class                      |    ✔️     |          ✔️           |      ❌      |     ✔️      |          ❌          |     ❌     |
| Derived class, different assembly      |    ✔️     |          ✔️           |      ✔️      |     ❌      |          ❌          |     ❌     |
| Non-derived class, different assembly  |    ✔️     |          ❌           |      ❌      |     ❌      |          ❌          |     ❌     |

* Classes can only be `public` or `internal`.
* Structs don't support inheritance, so they and their members cannot be marked `protected`.
* Members are not greater in accessibility than their class unless overriding virtual methods in a public base class.
## Autoprops
### Mutable
Old school:
```csharp
class Point
{
	private int _x;
    public int X
    {
	    get { return _x; }
	    set { _x = value; }
    }
    
    private int _y;
    public int Y
    {
	    get { return _y; }
	    set { _y = value; }
    }
}
```
Auto-Implemented Properties:
```csharp
class Point
{
	public int X { get; set; }
    public int Y { get; set; }
}
```
### Immutable
Old school:
```csharp
class Point
{
    private int _x;
    public int X
    {
	    get { return _x; }
    }
    
    private int _y;
    public int Y
    {
	    get { return _y; }
    }
	
    public Point(int x, int y)
    {
        this._x = x;
        this._y = y;
    }
}
```
Auto-Implemented Properties:
```csharp
class Point
{
    public int X { get; }
    public int Y { get; }
	
    public Point(int x, int y)
    {
        this.X = x;
        this.Y = y;
    }
}
```
Init Only Setter:
```csharp
class Point
{
    public int X { get; init; }
    public int Y { get; init; }
}
```
Using the init only setter, we have the option to create immutable objects like this along with the standard constructor option:
```csharp
var p = new Point() { X = 42, Y = 13 };
```
