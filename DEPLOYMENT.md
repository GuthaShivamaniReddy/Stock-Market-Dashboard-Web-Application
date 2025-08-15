# 🚀 Deployment Guide

This guide will help you deploy the Stock Market Dashboard to various cloud platforms.

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- Git
- A cloud platform account (Render, Railway, Vercel, etc.)

## 🌐 Deployment Options

### Option 1: Render (Recommended)

Render is a modern cloud platform that offers free hosting for both backend and frontend.

#### Backend Deployment on Render

1. **Create a Render Account**

   - Go to [render.com](https://render.com)
   - Sign up for a free account

2. **Deploy Backend**

   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: `stock-dashboard-backend`
     - **Root Directory**: `backend`
     - **Runtime**: `Python 3`
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Set environment variables:
     - `DATABASE_URL`: `sqlite:///./stock_data.db`
   - Click "Create Web Service"

3. **Get Backend URL**
   - Note the URL provided by Render (e.g., `https://your-app.onrender.com`)

#### Frontend Deployment on Render

1. **Deploy Frontend**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: `stock-dashboard-frontend`
     - **Root Directory**: `frontend`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `build`
   - Set environment variables:
     - `REACT_APP_API_URL`: `https://your-backend-url.onrender.com`
   - Click "Create Static Site"

### Option 2: Railway

Railway is another excellent platform for full-stack applications.

1. **Deploy Backend**

   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the `backend` directory
   - Railway will automatically detect Python and install dependencies
   - Set environment variables as needed

2. **Deploy Frontend**
   - Create a new service for the frontend
   - Select the `frontend` directory
   - Set build command: `npm install && npm run build`
   - Set the API URL environment variable

### Option 3: Vercel (Frontend Only)

Vercel is excellent for React applications.

1. **Deploy Frontend**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Create React App
     - **Root Directory**: `frontend`
   - Set environment variables:
     - `REACT_APP_API_URL`: Your backend URL
   - Deploy

### Option 4: Heroku

Heroku supports both Python and Node.js applications.

#### Backend on Heroku

1. **Create Heroku App**

   ```bash
   heroku create your-stock-dashboard-backend
   ```

2. **Deploy Backend**

   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend deployment"
   heroku git:remote -a your-stock-dashboard-backend
   git push heroku main
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set DATABASE_URL=sqlite:///./stock_data.db
   ```

#### Frontend on Heroku

1. **Create Frontend App**

   ```bash
   heroku create your-stock-dashboard-frontend
   ```

2. **Add Buildpack**

   ```bash
   heroku buildpacks:set mars/create-react-app
   ```

3. **Deploy Frontend**
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial frontend deployment"
   heroku git:remote -a your-stock-dashboard-frontend
   git push heroku main
   ```

## 🔧 Environment Variables

### Backend Environment Variables

```bash
DATABASE_URL=sqlite:///./stock_data.db
CORS_ORIGINS=http://localhost:3000,https://your-frontend-domain.com
```

### Frontend Environment Variables

```bash
REACT_APP_API_URL=https://your-backend-domain.com
```

## 📊 Database Setup

The application uses SQLite by default, which is perfect for small to medium applications. For production:

### PostgreSQL (Recommended for Production)

1. **Install PostgreSQL dependencies**

   ```bash
   pip install psycopg2-binary
   ```

2. **Update requirements.txt**

   ```
   psycopg2-binary==2.9.7
   ```

3. **Set DATABASE_URL**
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   ```

### MongoDB Alternative

1. **Install MongoDB dependencies**

   ```bash
   pip install motor
   ```

2. **Update the database configuration in `backend/app/database.py`**

## 🔒 Security Considerations

1. **CORS Configuration**

   - Update CORS origins in `backend/app/main.py`
   - Only allow your frontend domain

2. **Rate Limiting**

   - Consider adding rate limiting for API endpoints
   - Use libraries like `slowapi` for FastAPI

3. **API Keys**
   - Store sensitive data in environment variables
   - Never commit API keys to version control

## 📈 Monitoring and Logging

1. **Add Logging**

   ```python
   import logging
   logging.basicConfig(level=logging.INFO)
   ```

2. **Health Checks**

   - The API includes a health check endpoint: `/api/health`
   - Use this for monitoring services

3. **Error Tracking**
   - Consider integrating Sentry for error tracking
   - Monitor application performance

## 🚀 Performance Optimization

1. **Caching**

   - Implement Redis caching for frequently accessed data
   - Cache stock data for 1-5 minutes

2. **CDN**

   - Use a CDN for static assets
   - Consider Cloudflare for global distribution

3. **Database Optimization**
   - Add indexes for frequently queried fields
   - Implement connection pooling

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v1.0.0
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📱 Mobile Optimization

The application is already responsive, but consider:

1. **Progressive Web App (PWA)**

   - Add service workers
   - Implement offline functionality
   - Add app manifest

2. **Touch Optimization**
   - Ensure buttons are large enough for touch
   - Add touch gestures for charts

## 🎯 Next Steps

1. **Domain Setup**

   - Purchase a custom domain
   - Configure DNS settings
   - Set up SSL certificates

2. **Analytics**

   - Add Google Analytics
   - Implement user tracking
   - Monitor performance metrics

3. **Backup Strategy**
   - Set up automated database backups
   - Implement disaster recovery plan

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**

   - Check CORS configuration in backend
   - Ensure frontend URL is in allowed origins

2. **API Timeouts**

   - Increase timeout settings
   - Implement retry logic

3. **Database Connection Issues**
   - Check database URL format
   - Verify database credentials

### Support

- Check the application logs
- Review the API documentation at `/docs`
- Test endpoints using the interactive docs

## 📞 Support

For deployment issues:

1. Check the platform's documentation
2. Review application logs
3. Test locally first
4. Use the health check endpoint

Happy deploying! 🚀
