# Entropy Garden - Docker Guide

Complete guide for running Entropy Garden with Docker and Docker Compose.

## 🐳 Docker Setup

### Prerequisites

- Docker >= 20.10
- Docker Compose >= 2.0
- 4GB RAM minimum
- 10GB free disk space

### Quick Start

#### Development Mode

```bash
# Clone repository
git clone https://github.com/kaaner/entropy-garden.git
cd entropy-garden

# Start development environment
docker-compose up

# Access application
# Web App: http://localhost:3000
# n8n: http://localhost:5678 (admin/changeme)
```

#### Production Mode

```bash
# Copy environment file
cp .env.example .env

# Edit .env and set your passwords
nano .env

# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

## 📁 File Structure

```
entropy-garden/
├── Dockerfile              # Production multi-stage build
├── Dockerfile.dev          # Development build
├── docker-compose.yml      # Development compose
├── docker-compose.prod.yml # Production compose
├── .dockerignore          # Files to exclude from build
└── .env.example           # Environment template
```

## 🔧 Configuration

### Environment Variables

Create `.env` file from template:

```bash
cp .env.example .env
```

**Important variables:**

```env
# n8n Configuration
N8N_USER=admin
N8N_PASSWORD=your_secure_password_here
N8N_WEBHOOK_URL=http://localhost:5678/
TIMEZONE=Europe/Istanbul

# Application
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Port Configuration

Default ports:
- **Web App:** 3000
- **n8n:** 5678

To change ports, edit `docker-compose.yml`:

```yaml
services:
  web:
    ports:
      - "8080:3000"  # Change 8080 to your desired port
```

## 🚀 Docker Commands

### Development

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f web

# Rebuild after code changes
docker-compose up --build

# Stop services
docker-compose down

# Remove volumes (clean slate)
docker-compose down -v
```

### Production

```bash
# Build and start
docker-compose -f docker-compose.prod.yml up -d --build

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart specific service
docker-compose -f docker-compose.prod.yml restart web

# Stop and remove
docker-compose -f docker-compose.prod.yml down

# Update images
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## 🔨 Building Images

### Production Image

```bash
# Build production image
docker build -t entropy-garden:latest .

# Build with specific tag
docker build -t entropy-garden:v1.0.0 .

# Run standalone
docker run -p 3000:3000 entropy-garden:latest
```

### Development Image

```bash
# Build dev image
docker build -f Dockerfile.dev -t entropy-garden:dev .

# Run with volume mount
docker run -p 3000:3000 -v $(pwd):/app entropy-garden:dev
```

## 📊 Multi-Stage Build Explanation

The production `Dockerfile` uses multi-stage builds for optimization:

1. **base** - Base Node.js + pnpm setup
2. **deps** - Install dependencies only
3. **builder** - Build packages and app
4. **runner** - Minimal production image

Benefits:
- Small final image size (~150MB vs ~1GB)
- Faster builds with layer caching
- Secure (no build tools in production)

## 🔍 Troubleshooting

### Issue: Build fails with "out of memory"

```bash
# Increase Docker memory limit (Docker Desktop)
# Settings → Resources → Memory → Set to 4GB+

# Or build with reduced concurrency
docker-compose build --build-arg NODE_OPTIONS="--max-old-space-size=4096"
```

### Issue: Changes not reflecting in development

```bash
# Remove volumes and rebuild
docker-compose down -v
docker-compose up --build
```

### Issue: Port already in use

```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process or change port in docker-compose.yml
```

### Issue: Permission denied on Linux

```bash
# Fix node_modules permissions
sudo chown -R $USER:$USER node_modules

# Or run with current user
docker-compose run --user $(id -u):$(id -g) web pnpm install
```

## 🏗️ Advanced Usage

### Custom Network

```yaml
services:
  web:
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### Health Checks

Production compose includes health checks:

```yaml
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000', ...)"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### Resource Limits

```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

## 📦 Docker Hub Publishing

```bash
# Tag image
docker tag entropy-garden:latest kaaner/entropy-garden:latest
docker tag entropy-garden:latest kaaner/entropy-garden:v1.0.0

# Push to Docker Hub
docker push kaaner/entropy-garden:latest
docker push kaaner/entropy-garden:v1.0.0

# Pull from Docker Hub
docker pull kaaner/entropy-garden:latest
```

## 🔐 Security Best Practices

1. **Never commit `.env` file**
   ```bash
   # Already in .gitignore
   echo ".env" >> .gitignore
   ```

2. **Use secrets for production**
   ```bash
   # Docker Swarm secrets
   echo "supersecret" | docker secret create n8n_password -
   ```

3. **Run as non-root user**
   ```dockerfile
   # Already configured in Dockerfile
   USER nextjs
   ```

4. **Keep images updated**
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

## 📈 Monitoring

### View Resource Usage

```bash
# Real-time stats
docker stats

# Specific container
docker stats entropy-garden-web-1
```

### Check Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f web

# Last 100 lines
docker-compose logs --tail=100 web

# Since specific time
docker-compose logs --since 30m web
```

## 🧪 Testing in Docker

```bash
# Run tests in container
docker-compose run --rm web pnpm test

# Run lint
docker-compose run --rm web pnpm lint

# Run build
docker-compose run --rm web pnpm build
```

## 🌐 Production Deployment

### Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml entropy-garden

# List services
docker service ls

# Scale service
docker service scale entropy-garden_web=3
```

### Kubernetes

```bash
# Generate Kubernetes manifests
kompose convert -f docker-compose.prod.yml

# Apply to cluster
kubectl apply -f .
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [n8n Docker Documentation](https://docs.n8n.io/hosting/installation/docker/)

## 🆘 Support

For issues related to Docker setup:
- Check [Troubleshooting](#-troubleshooting) section
- Open an issue: [GitHub Issues](https://github.com/kaaner/entropy-garden/issues)
- Docker logs: `docker-compose logs -f`
