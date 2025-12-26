#!/bin/bash

# Build deps image for frontend (Svelte)
cd invoice-svelte
docker build -f Dockerfile.build -t invoice-svelte-deps .
cd ..

# Build deps image for backend (NestJS)
cd invoice-nest
docker build -f Dockerfile.build -t invoice-nest-deps .
cd ..

echo "Deps images built successfully."