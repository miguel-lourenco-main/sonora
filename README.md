# Frontend

## Mirror

### Setup
```bash
git remote add remote/makerkit git@github.com:makerkit/next-supabase-saas-kit-turbo.git
git fetch remote/makerkit main

# create mirror/makerkit
git checkout -b mirror/makerkit remote/makerkit/main
git push origin mirror/makerkit
git branch --set-upstream-to=origin/mirror/makerkit mirror/makerkit

# create subtree/apps-web
git subtree split --prefix=apps/web --branch=subtree/apps-web
git checkout subtree/apps-web
git push origin subtree/apps-web
git branch --set-upstream-to=origin/subtree/apps-web subtree/apps-web
```

### Pull
```bash
# Save current branch 
current_branch=$(git rev-parse --abbrev-ref HEAD)

# Fetch and update our mirror branch
git fetch remote/makerkit main
git checkout mirror/makerkit
git merge remote/makerkit/main
git push origin mirror/makerkit

# Merge skeleton makerkit into current branch
git checkout $current_branch
git merge mirror/makerkit


```