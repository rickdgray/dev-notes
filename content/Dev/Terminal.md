---
title: Terminal
author: Rick Gray
year: 2023
---
# Windows
## Microsoft.PowerShell_profile.ps1
```powershell
Import-Module posh-git
oh-my-posh init pwsh --config "~/Documents/PowerShell/theme.omp.json" | Invoke-Expression

function repos {
	& cd ~/source/repos
}

function edit {
	param (
		$Filename
	)

	& "C:/Program Files/Notepad++/notepad++.exe" $Filename
}

New-Alias which get-command

clear
```
## Generate theme
```powershell
$alignment = 'left'
$textColorPrimary = '#ffffff'
$textColorSecondary = '#ff0000'
$style = 'plain'
$type = 'prompt'

$username = @{
	'foreground' = $textColorPrimary
	'style' = $style
	'template' = "<$textColorSecondary>┏[</>{{ .UserName }}<$textColorSecondary>]</>"
	'type' = 'session'
}

$git = @{
	'foreground' = $textColorPrimary
	'style' = $style
	'template' = "<$textColorSecondary>[</>{{ .HEAD }}<$textColorSecondary>]</>"
	'type' = 'git'
}

$root = @{
	'foreground' = $textColorPrimary
	'style' = $style
	'template' = "<$textColorSecondary>[</>⚡<$textColorSecondary>]</>"
	'type' = 'root'
}

$exitCode = @{
	'foreground' = $textColorPrimary
	'style' = $style
	'template' = "<$textColorSecondary>[x</>{{ .Meaning }}<$textColorSecondary>]</>"
	'type' = 'exit'
}

$path = @{
	'foreground' = $textColorPrimary
	'style' = $style
	'template' = "<$textColorSecondary>┖[</>{{ .Path }}<$textColorSecondary>]></>"
	'type' = 'path'
	'properties' = @{
		'style' = 'full'
	}
}

$firstLine = @{
	'alignment' = $alignment
	'segments' = @(
		$username,
		$git,
		$root,
		$exitCode
	)
	'type' = $type
}

$secondLine = @{
	'alignment' = $alignment
	'segments' = @(
		$path
	)
	'type' = $type
	'newline' = $true
}

@{
	'$schema' = 'https://raw.githubusercontent.com/JanDeDobbeleer/oh-my-posh/main/themes/schema.json'
	'blocks' = @(
		$firstLine,
		$secondLine
	)
	'final_space' = $true
	'version' = 2
} | ConvertTo-Json -Depth 5 | Out-File -FilePath .\theme.omp.json
```
# Linux
