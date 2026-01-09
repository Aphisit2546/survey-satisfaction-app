#!/bin/bash

# ============================================
# Build Script for Render Deployment
# ============================================

echo "🚀 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
  echo "✅ Build completed successfully!"
  echo "📁 Output directory: dist/"
  
  # List files in dist
  echo "📋 Build output:"
  ls -lh dist/
else
  echo "❌ Build failed!"
  exit 1
fi

echo "🎉 Build process completed!"