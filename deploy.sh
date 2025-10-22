#!/bin/bash

# SonneTix Frontend Deployment Script
# This script builds and deploys the containerized app to *.izcy.tech

set -e  # Exit on any error

echo "🚀 Starting SonneTix Frontend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="sonnetix.izcy.tech"
NGINX_CONF="/etc/nginx/sites-available/sonnetix.izcy.tech.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/sonnetix.izcy.tech.conf"

echo -e "${YELLOW}📦 Step 1: Building Docker image...${NC}"
docker compose build

echo -e "${YELLOW}🛑 Step 2: Stopping existing container (if any)...${NC}"
docker compose down || true

echo -e "${YELLOW}🚀 Step 3: Starting Docker container...${NC}"
docker compose up -d

echo -e "${YELLOW}⏳ Step 4: Waiting for container to be healthy...${NC}"
sleep 5

# Check if container is running
if docker ps | grep -q sonnetix-fe; then
    echo -e "${GREEN}✅ Container is running!${NC}"
else
    echo -e "${RED}❌ Container failed to start. Check logs with: docker compose logs${NC}"
    exit 1
fi

# Test if the container is serving content
if curl -f http://localhost:3003/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Container health check passed!${NC}"
else
    echo -e "${RED}❌ Container health check failed${NC}"
    exit 1
fi

echo -e "${YELLOW}🌐 Step 5: Configuring Nginx...${NC}"

# Copy nginx config if it doesn't exist
if [ ! -f "$NGINX_CONF" ]; then
    echo "Copying Nginx configuration..."
    sudo cp sonnetix.izcy.tech.conf "$NGINX_CONF"
    echo -e "${GREEN}✅ Nginx config copied${NC}"
else
    echo -e "${YELLOW}ℹ️  Nginx config already exists. Updating...${NC}"
    sudo cp sonnetix.izcy.tech.conf "$NGINX_CONF"
fi

# Create symlink if it doesn't exist
if [ ! -L "$NGINX_ENABLED" ]; then
    echo "Creating symlink..."
    sudo ln -sf "$NGINX_CONF" "$NGINX_ENABLED"
    echo -e "${GREEN}✅ Symlink created${NC}"
else
    echo -e "${YELLOW}ℹ️  Symlink already exists${NC}"
fi

# Test nginx configuration
echo "Testing Nginx configuration..."
if sudo nginx -t; then
    echo -e "${GREEN}✅ Nginx config is valid${NC}"
else
    echo -e "${RED}❌ Nginx config has errors${NC}"
    exit 1
fi

# Reload nginx
echo "Reloading Nginx..."
sudo systemctl reload nginx
echo -e "${GREEN}✅ Nginx reloaded${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "📍 Application is now running at:"
echo -e "   ${YELLOW}http://localhost:3003${NC} (Docker container)"
echo -e "   ${YELLOW}http://$DOMAIN${NC} (Nginx proxy)"
echo ""
echo -e "🔐 To enable HTTPS with SSL certificate, run:"
echo -e "   ${YELLOW}sudo certbot --nginx -d $DOMAIN${NC}"
echo ""
echo -e "📊 Useful commands:"
echo -e "   ${YELLOW}docker compose logs -f${NC}     - View container logs"
echo -e "   ${YELLOW}docker compose ps${NC}          - Check container status"
echo -e "   ${YELLOW}docker compose restart${NC}     - Restart container"
echo -e "   ${YELLOW}docker compose down${NC}        - Stop and remove container"
echo ""
