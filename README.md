
# Structure

- `apps/web`: a template app for all other apps. Edit this one if you want to proliferate a change into every app
- `packages/`: packages common to all apps


# Update from Makerkit

## Setup
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

## Pull
```bash
git checkout update_makerkit

# Fetch and update our mirror branch
git fetch remote/makerkit main
git checkout mirror/makerkit
git merge remote/makerkit/main
git push origin mirror/makerkit

# Merge skeleton makerkit into update_makerkit
git checkout update_makerkit
git merge mirror/makerkit

##### Create MR and merge to main WITHOUT SQUASHING COMMITS (we want makerkit's commits intact)

# Pull main
git checkout main
git pull

# Delete update_makerkit branch locally (on remote, it was probably deleted in the MR process)
git branch -D update_makerkit

# Update subtree
git subtree split --prefix=apps/web --branch=subtree/apps-web
git push origin subtree/apps-web
```

## Proliferate app subtree's new updates into app submodules
```bash
cd apps/polydoc

# Fetch and update our mirror branch
git fetch remote/frontend subtree/apps-web
git checkout mirror/apps-web
git merge remote/frontend/subtree/apps-web
git push origin mirror/apps-web

# Merge mirror into main
git checkout main
git merge mirror/apps-web
git push origin
```