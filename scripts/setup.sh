#!/bin/bash

# ============================================
# Quick Setup Script
# ============================================
# สคริปต์นี้จะช่วยติดตั้งและตั้งค่าโปรเจกต์อัตโนมัติ
# ============================================

echo "🚀 Survey Satisfaction App - Quick Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully!"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found"
    echo "📝 Creating .env from template..."
    
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ .env file created!"
        echo ""
        echo "⚠️  IMPORTANT: Please edit .env and add your Supabase credentials:"
        echo "   - VITE_SUPABASE_URL"
        echo "   - VITE_SUPABASE_ANON_KEY"
        echo ""
    else
        echo "❌ .env.example not found"
        exit 1
    fi
else
    echo "✅ .env file exists"
    echo ""
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p public
mkdir -p scripts
mkdir -p src/assets/images
mkdir -p src/assets/icons

echo "✅ Directories created!"
echo ""

# Make scripts executable
echo "🔐 Making scripts executable..."
chmod +x scripts/*.sh 2>/dev/null || true

echo "✅ Scripts are now executable!"
echo ""

# Summary
echo "=========================================="
echo "✨ Setup Complete!"
echo "=========================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Edit .env file with your Supabase credentials"
echo "2. Create database in Supabase using the SQL schema"
echo "3. Run development server:"
echo "   npm run dev"
echo ""
echo "4. Build for production:"
echo "   npm run build"
echo ""
echo "5. Deploy to Render:"
echo "   - Push to GitLab/GitHub"
echo "   - Follow DEPLOYMENT.md guide"
echo ""
echo "=========================================="
echo "Happy coding! 🎉"
echo "=========================================="