#!/bin/bash
# Netlify build script
set -e

echo "Starting Netlify build with legacy peer deps..."

# Force Node 18
export NODE_VERSION=18

# Install with legacy peer deps
npm ci --legacy-peer-deps

# Build the project
npm run build

echo "Build completed successfully!"
