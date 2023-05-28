---
title: Database
lastmod: 2023-05-27T22:00:16-05:00
---
# Database
## EF Migrations
The migration tool has to be able to build the DbContext to know what's in it.
```bash
dotnet add package Microsoft.EntityFrameworkCore.Design
```
Add a new migration
```powershell
param(
    [Parameter(Mandatory=$true)]
    [string] $MigrationName
)

dotnet ef --startup-project ../App.Api/ migrations add $MigrationName
```
Update database
```powershell
param(
    [string] $TargetMigration
)

# TODO print names of last 5 migrations to allow user to input
if ([string]::IsNullOrEmpty($TargetMigration)) {
    dotnet ef --startup-project ../App.Api/ database update
}
else {
    dotnet ef --startup-project ../App.Api/ database update $TargetMigration
}
```
## DB Backup
PowerShell script for automating the creation of new databases in a local environment setting.
```powershell
#Requires -RunAsAdministrator

# If SqlServer module isn't installed
if (!(Get-module SqlServer))
{
	Write-Host "Installing SqlServer module..."
	Install-Module SqlServer
}

Write-Host "Loading SqlServer module..."
Import-Module SqlServer

$localServer = "(localdb)\MSSQLLocalDB"

Write-Host "Select database to copy:"
$database = Get-SqlDatabase -ServerInstance $localServer | Where-Object { $_.Owner -ne "sa" } | Out-GridView -Title "Select database to copy" -PassThru

if ($database -eq $null)
{
	Write-Error "A database was not selected."
	exit 1;
}

$databaseName = $database.Name

$newDatabaseName  = Read-Host -Prompt "Enter name of new database [${databaseName}_Copy]"
if (-not [bool]$newDatabaseName) { $newDatabaseName = "${databaseName}_Copy" }

# Check if name already exists
Get-SqlDatabase -ServerInstance $localServer | ForEach-Object -Process {
	if ($_.Name -eq $newDatabaseName)
	{
		Write-Error "Database $newDatabaseName already exists."
		exit 1;
	}
}

Write-Host "Creating $newDatabaseName on $localServer..."
$server = New-Object Microsoft.SqlServer.Management.Smo.Server($localServer)
$newDatabase = New-Object Microsoft.SqlServer.Management.Smo.Database($server, $newDatabaseName)
$newDatabase.Create()

Write-Host "Backing up $databaseName to ${HOME}\${databaseName}.bak..."
if (Test-Path "${HOME}\${databaseName}.bak" -PathType Leaf)
{
	Rename-Item -Path "${HOME}\${databaseName}.bak" -NewName "${databaseName}.old.bak"
}
Backup-SqlDatabase -ServerInstance $localServer -Database $databaseName -BackupFile "${HOME}\${databaseName}.bak"
if ((Test-Path "${HOME}\${databaseName}.bak" -PathType Leaf) -and (Test-Path "${HOME}\${databaseName}.old.bak" -PathType Leaf))
{
	Remove-Item -Path "${HOME}\${databaseName}.old.bak"
}

# Read backup file to get logical names of .mdf and .ldf
Write-Host "Parsing data in ${databaseName}.bak..."
$restoreObject = New-Object Microsoft.SqlServer.Management.Smo.Restore
$backupDeviceItem = New-Object Microsoft.SqlServer.Management.Smo.BackupDeviceItem("${HOME}\${databaseName}.bak", 'File')
$restoreObject.Devices.Add($backupDeviceItem)
$fileList = $restoreObject.ReadFileList($server)
$mdfLogicalName = $fileList.select("Type = 'D'")[0].LogicalName
$ldfLogicalName = $fileList.select("Type = 'L'")[0].LogicalName

# Set new file locations and restore to new DB
Write-Host "Assigning data relocation for ${newDatabaseName}..."
$RelocateData = New-Object Microsoft.SqlServer.Management.Smo.RelocateFile("$mdfLogicalName", "${HOME}\${newDatabaseName}.mdf")
$RelocateLog = New-Object Microsoft.SqlServer.Management.Smo.RelocateFile("$ldfLogicalName", "${HOME}\${newDatabaseName}_log.ldf")
Write-Host "Restoring data to $newDatabaseName on $localServer..."
Restore-SqlDatabase -ReplaceDatabase -ServerInstance $localServer -Database $newDatabaseName -BackupFile "${HOME}\${databaseName}.bak" -RelocateFile @($RelocateData,$RelocateLog)

Write-Host "Updating connection strings to ${newDatabaseName}..."
& $PSScriptRoot\switch-environment.ps1 -Database $newDatabaseName
```
## Conn String Updater
PowerShell script to change what environment your connection string points to.
```powershell
param (
	[string]$Environment,
	[string]$Database
)

if ($Environment.Length -gt 0 -and $Environment -ne "Development" -and $Database.Length -gt 0)
{
	Write-Host "You can only set a database on the Development environment"
	return
}

if ($Database.Length -gt 0)
{
	$Environment = "Development"
}

if ($Environment.Length -eq 0)
{
	Write-Host "0) Development"
	Write-Host "1) Sandbox"
	Write-Host "2) Playground"
	Write-Host "3) Treehouse"
	Write-Host "4) Park"
	Write-Host "5) Alpha"
	Write-Host "6) Beta"
	$selectedEnvironment = Read-Host -Prompt "Select environment [Development]"
	Switch ($selectedEnvironment)
	{
		1 { $Environment = "sandbox" }
		2 { $Environment = "playground" }
		3 { $Environment = "treehouse" }
		4 { $Environment = "park" }
		5 { $Environment = "alpha" }
		6 { $Environment = "beta" }
		Default { $Environment = "Development" }
	}

	if ($Environment -eq "Development")
	{
		$Database = Read-Host -Prompt "Enter name of database [App]"
	}
}

$appsettings = Get-Content $PSScriptRoot\App.Api\appsettings.local.json -raw | ConvertFrom-Json
$newAppsettings = Get-Content $PSScriptRoot\App.Api\appsettings.$Environment.json -raw | ConvertFrom-Json
$appsettings.ConnectionStrings.AppDbContext = $newAppsettings.ConnectionStrings.AppDbContext

if ($Database.Length -gt 0)
{
	$appsettings.ConnectionStrings.AppDbContext = $appsettings.ConnectionStrings.AppDbContext.replace("Initial Catalog=App;", "Initial Catalog=${Database};")
}

$appsettings | ConvertTo-Json -depth 32 | Set-Content $PSScriptRoot\App.Api\appsettings.local.json
```
