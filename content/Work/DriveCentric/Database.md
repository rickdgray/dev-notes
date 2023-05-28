---
title: Database
lastmod: 2023-05-27T22:02:46-05:00
---
# Database
## Migrations
I added this to my powershell profile to make builds easier
```powershell
$env:ASPNETCORE_ENVIRONMENT='Local'
```
The commands to successfully run migrations are these.
```powershell
# location
cd C:\Repos\Atlas-InventoryService\Inventory.Database

# add new migration
dotnet ef migrations add NewMigration --startup-project ..\Inventory.Api\Inventory.Api.csproj --context InventoryContext

# update database
dotnet ef database update --startup-project ..\Inventory.Api\Inventory.Api.csproj --context InventoryContext
```
Note that it specifically must be this way. `.\InventoryContext` will not work. `InventoryContext.cs` will not work. I don't know why.