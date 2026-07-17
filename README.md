# courses-app-backend

This project was created for educational purposes and is used as a back-end for educational applications.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deploy to Render

This backend can be deployed to Render (Free Tier) using the following steps:

### Prerequisites
- A Render account (https://render.com)
- Your code pushed to a GitHub/GitLab repository

### Deployment Steps

1. **Push your code to GitHub/GitLab** (if not already done)

2. **Create a new Web Service on Render:**
   - Go to https://dashboard.render.com
   - Click "New" → "Web Service"
   - Connect your repository
   - Select the repository containing this backend

3. **Configure the service:**
   - **Name:** `courses-app-backend` (or your preferred name)
   - **Region:** Choose closest to your users
   - **Branch:** `main` (or your default branch)
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Plan:** Free

4. **Environment Variables (optional):**
   - `NODE_ENV`: `production`

5. **Click "Create Web Service"**

The `render.yaml` file in this repository will be automatically detected and used for configuration.

### After Deployment

Your API will be available at: `https://courses-app-backend.onrender.com`

Swagger documentation will be available at: `https://courses-app-backend.onrender.com/api`

### Database Configuration

The application is configured to use PostgreSQL. The `DATABASE_URL` environment variable is set in `render.yaml` to connect to your Render PostgreSQL database.

If you need to use a different database, update the `DATABASE_URL` in `render.yaml` or set it as an environment variable in the Render dashboard.
