git restore --staged .\notes
git restore .\notes
git submodule update --init --remote
Copy-Item .\notes\* .\content\ -Recurse -Container -Force
Remove-Item -r .\content\.obsidian
Remove-Item -r .\content\Templates
Remove-Item -r .\content\Work
Remove-Item .\content\.git -Force
Remove-Item .\content\.gitignore
Remove-Item .\content\LICENSE
