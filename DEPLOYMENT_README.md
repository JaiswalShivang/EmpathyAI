
# 🚀 EmpathyAI Deployment Guide

## 📋 Prerequisites

Before deploying, ensure you have:

- **Node.js 18+** installed
- **MongoDB** (local or cloud instance)
- **Docker & Docker Compose** (for containerized deployment)
- **Domain name** (for production)
- **SSL certificate** (Let's Encrypt recommended)

## 🔧 Environment Setup

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd empathyai
```

### 2. Environment Configuration

#### For Local Development:
```bash
# Client environment (client/.env)
VITE_BACKEND_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000
VITE_ZEGO_APP_ID=461444031
VITE_ZEGO_SERVER_SECRET=28390747711be586d315a64a67fbae81

# Server environment (server/.env)
MONGO_URI=mongodb://localhost:27017/empathy-ai
JWT_SECRET=your-super-secure-jwt-secret
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
GOOGLE_API_KEY=your-google-api-key
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX_NAME=empathyai
ZEGO_APP_ID=461444031
ZEGO_SERVER_SECRET=28390747711be586d315a64a67fbae81
```

#### For Production:
Update the production environment files:
- `client/.env.production`
- `server/.env.production`

Replace placeholder values with your actual:
- Domain name
- Database connection string
- API keys
- Secure JWT secret

## 🐳 Docker Deployment (Recommended)

### Quick Start with Docker Compose
```bash
# 1. Set environment variables
cp .env.example .env
# Edit .env with your production values

# 2. Build and run
docker-compose up -d

# 3. Check logs
docker-compose logs -f empathyai

# 4. Access application
# Frontend: http://localhost
# API: http://localhost/api
```

### Manual Docker Build
```bash
# Build the image
docker build -t empathyai .

# Run the container
docker run -d \
  --name empathyai-app \
  -p 5000:5000 \
  --env-file .env \
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```
## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```
#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```
#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```
#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```
#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```
### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```
#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
  empathyai
```

## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel --prod
```

#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 2: AWS EC2 + MongoDB Atlas

#### 1. Launch EC2 Instance:
```bash
# Ubuntu 20.04 LTS, t2.medium or larger
# Security group: ports 22, 80, 443, 5000
```

#### 2. Server Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodeserver.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd empathyai

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build
```

#### 3. Configure Environment:
```bash
# Copy production environment files
cp ../server/.env.production server/.env
cp ../client/.env.production client/.env

# Edit with your production values
nano server/.env
nano client/.env
```

#### 4. Start Application:
```bash
# Start server with PM2
cd server
pm2 start server.js --name "empathyai"
pm2 startup
pm2 save

# Serve client files
cd ../client
pm2 serve dist 3000 --name "empathyai-client" --spa
```

### Option 3: DigitalOcean App Platform

#### 1. Create App Spec:
```yaml
# .do/app.yaml
name: empathyai
services:
- name: api
  source_dir: server
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: ${MONGO_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  # ... other environment variables

- name: client
  source_dir: client
  github:
    repo: yourusername/empathyai
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```

#### 2. Deploy:
```bash
# Install doctl
# Deploy via DigitalOcean dashboard or CLI
doctl apps create --spec .do/app.yaml
```

## 🔒 Security Checklist

### Before Going Live:
- [ ] Change default JWT secret to a strong, random string
- [ ] Set up HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up monitoring and logging
