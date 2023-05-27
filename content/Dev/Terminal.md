---
title: Terminal
author: Rick Gray
date: 2017-10-19T15:26:15Z
lastmod: 2019-10-26T15:26:15Z
publishdate: 2018-11-23T15:26:15Z
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

# github copilot cli
function ?? { 
    $TmpFile = New-TemporaryFile
    github-copilot-cli what-the-shell ('use powershell to ' + $args) --shellout $TmpFile
    if ([System.IO.File]::Exists($TmpFile)) { 
        $TmpFileContents = Get-Content $TmpFile
            if ($TmpFileContents -ne $nill) {
            Invoke-Expression $TmpFileContents
            Remove-Item $TmpFile
        }
    }
}
 
function git? {
    $TmpFile = New-TemporaryFile
    github-copilot-cli git-assist $args --shellout $TmpFile
    if ([System.IO.File]::Exists($TmpFile)) {
        $TmpFileContents = Get-Content $TmpFile
            if ($TmpFileContents -ne $nill) {
            Invoke-Expression $TmpFileContents
            Remove-Item $TmpFile
        }
    }
}

function gh? {
    $TmpFile = New-TemporaryFile
    github-copilot-cli gh-assist $args --shellout $TmpFile
    if ([System.IO.File]::Exists($TmpFile)) {
        $TmpFileContents = Get-Content $TmpFile
            if ($TmpFileContents -ne $nill) {
            Invoke-Expression $TmpFileContents
            Remove-Item $TmpFile
        }
    }
}

New-Alias which Get-Command
New-Alias ll Get-ChildItem

clear
```
## GitHub Copilot CLI
Install the npm package [here](https://www.npmjs.com/package/@githubnext/github-copilot-cli).  The above functions were pulled from [here](https://www.hanselman.com/blog/github-copilot-for-cli-for-powershell).
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
