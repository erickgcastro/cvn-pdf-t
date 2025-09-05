#!/bin/bash

echo "🐳 Building and running API..."

# Build e executar com docker-compose
docker-compose up --build

echo "✅ API running on http://localhost:5000"
echo "📖 Documentation: http://localhost:5000/reference"
