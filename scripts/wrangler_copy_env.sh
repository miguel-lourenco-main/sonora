#!/bin/bash

# Check if both files exist
if [ ! -f ".env" ] && [ ! -f ".env.production" ]; then
    echo "Error: Neither .env nor .env.production found" >&2
    exit 1
fi

# Create/clear .dev.vars
> .dev.vars

# Concatenate .env if it exists
if [ -f ".env" ]; then
    if cat ".env" >> ".dev.vars"; then
        echo "Added contents from .env"
        # Add two newlines after .env
        echo -e "\n\n" >> ".dev.vars"
    else
        echo "Error: Failed to copy from .env" >&2
        exit 1
    fi
fi

# Concatenate .env.production if it exists
if [ -f ".env.production" ]; then
    if cat ".env.production" >> ".dev.vars"; then
        echo "Added contents from .env.production"
    else
        echo "Error: Failed to copy from .env.production" >&2
        exit 1
    fi
fi

echo "Successfully created .dev.vars"
exit 0