#!/bin/bash

echo "Stopping servers..."

# FastAPI
pkill -9 -f uvicorn

# Vite
pkill -9 -f vite

# NestJS
pkill -9 -f "nest start"
pkill -9 -f "start:dev"
pkill -9 -f "node.*dist/main"
pkill -9 -f "ts-node"
pkill -9 -f "ts-node-dev"

echo "Done."