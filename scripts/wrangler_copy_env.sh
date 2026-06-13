#!/bin/bash
# Generate wrangler.toml for Cloudflare Pages deploy from local env files.
# Vercel builds static output; this script maps .env vars into Wrangler's
# [env.production.vars] so Pages functions see the same secrets at runtime.

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
# pages_build_output_dir matches Next.js static export via Vercel adapter output.
cat > wrangler.toml << EOL
name = "$CLOUDFLARE_PROJECT_NAME"
pages_build_output_dir = ".vercel/output/static"
compatibility_date = "2024-12-12"
compatibility_flags = ["nodejs_compat"]

[env.production.vars]
EOL

# .env is written first; .env.production entries below override duplicate keys in the final wrangler.toml.
# Add variables from .env to [env.production.vars] section if it exists
if [ -f ".env" ]; then
    # Pipeline to while-read runs in a subshell; safe here because we only append to wrangler.toml.
    grep -v '^#' ".env" | grep -v '^$' | while read -r line; do
        key=$(echo "$line" | cut -d= -f1 | xargs)
        value=$(echo "$line" | cut -d= -f2- | xargs)
        if [ -n "$key" ]; then
            echo "$key = \"$value\"" >> wrangler.toml
        fi
    done
    echo "Added development variables from .env"
fi

# .env.production is appended second so duplicate keys override .env values.
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