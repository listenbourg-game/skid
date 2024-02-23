echo "# skid" >> README.md
git init
git add * */*
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/listenbourg-game/skid.git
git push -u origin main
del init.cmd 