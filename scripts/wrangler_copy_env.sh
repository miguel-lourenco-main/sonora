#!/bin/bash

# Check if CLOUDFLARE_PROJECT_NAME is set
if [ -z "$CLOUDFLARE_PROJECT_NAME" ]; then
    echo "Error: CLOUDFLARE_PROJECT_NAME environment variable is not set" >&2
    exit 1
fi

# Check if both files exist
if [ ! -f ".env" ] && [ ! -f ".env.production" ]; then
    echo "Error: Neither .env nor .env.production found" >&2
    exit 1
fi

# Create/clear wrangler.toml with initial content
cat > wrangler.toml << EOL
name = "$CLOUDFLARE_PROJECT_NAME"

[vars]
EOL

# Add variables from .env to [vars] section if it exists
if [ -f ".env" ]; then
    grep -v '^#' ".env" | grep -v '^$' | while read -r line; do
        key=$(echo "$line" | cut -d= -f1 | xargs)
        value=$(echo "$line" | cut -d= -f2- | xargs)
        if [ -n "$key" ]; then
            echo "$key = \"$value\"" >> wrangler.toml
        fi
    done
    echo "Added development variables from .env"
fi

# Add production variables section
printf "\n[env.production.vars]\n" >> wrangler.toml

# Add variables from .env.production if it exists
if [ -f ".env.production" ]; then
    grep -v '^#' ".env.production" | grep -v '^$' | while read -r line; do
        key=$(echo "$line" | cut -d= -f1 | xargs)
        value=$(echo "$line" | cut -d= -f2- | xargs)
        if [ -n "$key" ]; then
            echo "$key = \"$value\"" >> wrangler.toml
        fi
    done
    echo "Added production variables from .env.production"
fi

echo "Successfully created wrangler.toml"
exit 0