rm -r -fo content/Dev
mkdir content/Dev
cp notes/*.md content/Dev
hugo -d docs
git add ./*
git commit -m "publish"
git push