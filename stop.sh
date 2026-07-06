#!/bin/bash

pkill -f "uvicorn"
pkill -f "vite"

echo "Stopped all servers."