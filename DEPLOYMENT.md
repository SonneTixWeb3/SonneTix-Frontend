# SonneTix Frontend - Deployment Guide

Complete guide for deploying the SonneTix frontend to your VPS with Docker and Nginx.

---

## 🌐 **Deployment Overview**

- **Domain**: sonnetix.izcy.tech
- **Server**: VPS with *.izcy.tech DNS configured
- **Container**: Docker + Nginx (port 3001)
- **Proxy**: System Nginx reverse proxy
- **SSL**: Let's Encrypt via Certbot

---

## 📋 **Prerequisites**

Your VPS should have:
- [x] Docker installed
- [x] Docker Compose installed
- [x] Nginx installed
- [x] Certbot installed
- [x] DNS: *.izcy.tech pointing to server IP
- [x] Ports 80 and 443 open

### **Verify Prerequisites**

```bash
# Check Docker
docker --version

# Check Docker Compose
docker-compose --version

# Check Nginx
nginx -v

# Check Certbot
certbot --version
```

---

## 🚀 **Quick Deployment (Automated)**

### **Option 1: One-Command Deployment**

```bash
cd /home/AgentZcy/sonnetix/sonnetix-fe
./deploy.sh
```

This script will:
1. Build the Docker image
2. Start the container on port 3001
3. Configure Nginx reverse proxy
4. Reload Nginx

After deployment, set up SSL:

```bash
sudo certbot --nginx -d sonnetix.izcy.tech
```

---

## 🔧 **Manual Deployment (Step-by-Step)**

### **Step 1: Build Docker Image**

```bash
cd /home/AgentZcy/sonnetix/sonnetix-fe

# Build the image
docker-compose build

# Verify image was created
docker images | grep sonnetix
```

### **Step 2: Start Container**

```bash
# Start in detached mode
docker-compose up -d

# Check if container is running
docker-compose ps

# View logs
docker-compose logs -f
```

### **Step 3: Test Container**

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test main page
curl http://localhost:3001
```

You should see "OK" from health check and HTML from main page.

### **Step 4: Configure Nginx**

```bash
# Copy nginx configuration
sudo cp sonnetix.izcy.tech.conf /etc/nginx/sites-available/

# Create symlink
sudo ln -sf /etc/nginx/sites-available/sonnetix.izcy.tech.conf /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### **Step 5: Test Nginx Proxy**

```bash
# Test without domain (using server IP)
curl http://localhost

# Or test with domain (if DNS is configured)
curl http://sonnetix.izcy.tech
```

### **Step 6: Set Up SSL Certificate**

```bash
# Run Certbot for the domain
sudo certbot --nginx -d sonnetix.izcy.tech

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose redirect option (2 - recommended)
```

Certbot will:
- Generate SSL certificate
- Update Nginx configuration automatically
- Set up auto-renewal

### **Step 7: Verify HTTPS**

```bash
# Test HTTPS
curl https://sonnetix.izcy.tech

# Check SSL certificate
curl -vI https://sonnetix.izcy.tech 2>&1 | grep -i "SSL certificate"
```

---

## 📁 **File Structure**

```
sonnetix-fe/
├── Dockerfile                      # Multi-stage build configuration
├── docker-compose.yml              # Container orchestration
├── nginx.conf                      # Nginx config inside container
├── sonnetix.izcy.tech.conf        # Nginx config for VPS
├── deploy.sh                       # Automated deployment script
├── .dockerignore                   # Files to exclude from image
└── DEPLOYMENT.md                   # This file
```

---

## 🔄 **Common Operations**

### **Restart Container**

```bash
docker-compose restart
```

### **Stop Container**

```bash
docker-compose down
```

### **Rebuild After Code Changes**

```bash
# Stop container
docker-compose down

# Rebuild image
docker-compose build --no-cache

# Start container
docker-compose up -d
```

### **View Logs**

```bash
# Follow logs in real-time
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail=100

# View logs for specific time
docker-compose logs --since 30m
```

### **Check Container Status**

```bash
# List all containers
docker ps -a

# Check resource usage
docker stats sonnetix-fe

# Inspect container
docker inspect sonnetix-fe
```

---

## 🐛 **Troubleshooting**

### **Container Won't Start**

```bash
# Check logs
docker-compose logs

# Check if port 3001 is already in use
sudo lsof -i :3001

# Rebuild without cache
docker-compose build --no-cache
```

### **Nginx Errors**

```bash
# Check Nginx error logs
sudo tail -f /var/log/nginx/sonnetix.error.log

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### **SSL Certificate Issues**

```bash
# Test certificate renewal
sudo certbot renew --dry-run

# Check certificate status
sudo certbot certificates

# Manually renew certificate
sudo certbot renew
```

### **Container Health Check Failing**

```bash
# Check if container is responding
curl http://localhost:3001/health

# Enter container
docker exec -it sonnetix-fe sh

# Check nginx inside container
docker exec sonnetix-fe nginx -t
```

### **Cannot Access from Domain**

```bash
# Check DNS resolution
nslookup sonnetix.izcy.tech

# Check if Nginx is listening
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443

# Check firewall
sudo ufw status
```

---

## 🔐 **Security Best Practices**

### **1. Keep SSL Certificate Updated**

Certbot auto-renewal is configured. Verify:

```bash
# Check renewal timer
sudo systemctl status certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

### **2. Update Docker Image Regularly**

```bash
# Pull latest base images
docker-compose pull

# Rebuild
docker-compose build

# Restart with new image
docker-compose up -d
```

### **3. Monitor Logs**

```bash
# Set up log rotation (already configured by Docker)
docker inspect sonnetix-fe | grep LogConfig

# Check Nginx logs regularly
sudo tail -f /var/log/nginx/sonnetix.access.log
```

### **4. Limit Resource Usage**

Add to `docker-compose.yml`:

```yaml
services:
  sonnetix-frontend:
    # ... existing config
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          memory: 256M
```

---

## 📊 **Monitoring**

### **Container Metrics**

```bash
# Real-time stats
docker stats sonnetix-fe

# Disk usage
docker system df
```

### **Application Logs**

```bash
# Nginx access logs
sudo tail -f /var/log/nginx/sonnetix.access.log

# Nginx error logs
sudo tail -f /var/log/nginx/sonnetix.error.log

# Container logs
docker-compose logs -f
```

---

## 🔄 **Continuous Deployment**

### **Update Workflow**

```bash
# 1. Pull latest code
cd /home/AgentZcy/sonnetix/sonnetix-fe
git pull

# 2. Rebuild and restart
./deploy.sh

# Or manually:
docker-compose down
docker-compose build
docker-compose up -d
```

### **Automated Updates (Optional)**

Create a cron job:

```bash
# Edit crontab
crontab -e

# Add line to rebuild daily at 2 AM
0 2 * * * cd /home/AgentZcy/sonnetix/sonnetix-fe && git pull && docker-compose build && docker-compose up -d
```

---

## 🌍 **Multi-Environment Setup**

To deploy to different subdomains:

```bash
# Copy and modify nginx config
sudo cp sonnetix.izcy.tech.conf /etc/nginx/sites-available/demo.izcy.tech.conf

# Edit the domain name
sudo nano /etc/nginx/sites-available/demo.izcy.tech.conf
# Change: server_name demo.izcy.tech;

# Enable and reload
sudo ln -sf /etc/nginx/sites-available/demo.izcy.tech.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL
sudo certbot --nginx -d demo.izcy.tech
```

---

## 📞 **Support & Maintenance**

### **Useful Commands Reference**

```bash
# Docker
docker-compose ps              # Status
docker-compose logs -f         # Logs
docker-compose restart         # Restart
docker-compose down            # Stop
docker-compose up -d           # Start

# Nginx
sudo nginx -t                  # Test config
sudo systemctl reload nginx    # Reload
sudo systemctl restart nginx   # Restart
sudo systemctl status nginx    # Status

# SSL
sudo certbot certificates      # List certs
sudo certbot renew            # Renew certs
sudo certbot --nginx -d domain # New cert

# System
sudo lsof -i :3001            # Check port
sudo netstat -tlnp            # All ports
docker system prune -a        # Clean up
```

---

## ✅ **Deployment Checklist**

- [ ] Prerequisites installed (Docker, Nginx, Certbot)
- [ ] DNS configured (sonnetix.izcy.tech → server IP)
- [ ] Code pulled to server
- [ ] Docker image built successfully
- [ ] Container running on port 3001
- [ ] Container health check passing
- [ ] Nginx configuration in place
- [ ] Nginx test passing
- [ ] Nginx reloaded
- [ ] HTTP access working
- [ ] SSL certificate obtained
- [ ] HTTPS access working
- [ ] Auto-renewal configured
- [ ] Logs monitored

---

## 🎉 **Success!**

Once deployed, your application will be available at:
- **HTTP**: http://sonnetix.izcy.tech
- **HTTPS**: https://sonnetix.izcy.tech

The container will automatically restart on server reboot thanks to the `restart: unless-stopped` policy in docker-compose.yml.
