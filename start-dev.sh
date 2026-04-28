#!/bin/bash
# 🚀 AI Election Assistant - Local Development Startup Script
# Usage: ./start-dev.sh

echo "🎉 AI Election Assistant - Development Environment"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running from correct directory
if [ ! -f "backend/package.json" ]; then
    echo -e "${YELLOW}⚠️  Please run this script from the election-assistant directory${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed. Please install Node.js first${NC}"
    exit 1
fi

# Check if MongoDB is running (optional)
echo ""
echo -e "${BLUE}📋 Checking MongoDB...${NC}"
if ! command -v mongosh &> /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB CLI not found. Make sure MongoDB is running:${NC}"
    echo "   - MongoDB Atlas (cloud): Use connection string from atlas.mongodb.com"
    echo "   - Local MongoDB: Run 'mongod' in another terminal"
    echo ""
    read -p "   Press Enter to continue anyway..."
fi

# Install backend dependencies
echo ""
echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "   Creating .env from .env.example..."
    cp .env.example .env
    echo -e "${YELLOW}   ⚠️  Please update .env with your MongoDB connection string!${NC}"
    echo ""
    read -p "   Open .env now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Try to open in default editor
        if command -v code &> /dev/null; then
            code .env
        elif command -v nano &> /dev/null; then
            nano .env
        fi
    fi
fi

# Start backend server
echo ""
echo -e "${GREEN}✓ Starting backend server...${NC}"
echo -e "${BLUE}Server running on http://localhost:5000${NC}"
echo ""

# Show API endpoints
echo -e "${BLUE}Available endpoints:${NC}"
echo "  GET  http://localhost:5000/api/health"
echo "  POST http://localhost:5000/api/auth/register"
echo "  POST http://localhost:5000/api/auth/login"
echo "  POST http://localhost:5000/api/vote"
echo "  GET  http://localhost:5000/api/votes"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""

# Start server with nodemon
npm run dev
