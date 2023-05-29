git submodule update --init --remote
Copy-Item .\notes\* .\content\ -Recurse -Container
Remove-Item -r .\content\.obsidian
Remove-Item -r .\content\Templates
Remove-Item .\content\.gitignore
Remove-Item .\content\LICENSE
