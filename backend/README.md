# Backend API

Node.js + Express + TypeScript backend API for Survey and Workshop Planning Tool.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure environment variables:
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `JWT_EXPIRES_IN`: Token expiration (default: 7d)
- `PORT`: Server port (default: 3000)
- `CORS_ORIGIN`: Frontend URL for CORS

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create a database user:
   - Go to Database Access
   - Add New Database User
   - Choose Password authentication
   - Save the username and password
4. Configure Network Access:
   - Go to Network Access
   - Add IP Address
   - For Render deployment, you can add `0.0.0.0/0` to allow all IPs (or add Render's IP ranges)
5. Get connection string:
   - Go to Database → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., `survey-tool`)
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/survey-tool?retryWrites=true&w=majority`

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Production

```bash
npm start
```

## API Endpoints

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Get current user
- `GET /api/surveys` - List surveys
- `GET /api/surveys/:id` - Get survey
- `POST /api/surveys` - Create survey
- `PATCH /api/surveys/:id` - Update survey
- `DELETE /api/surveys/:id` - Delete survey
- `POST /api/surveys/:id/publish` - Publish survey
- `POST /api/surveys/:id/close` - Close survey
- `GET /api/workshops` - List workshops
- `GET /api/workshops/:id` - Get workshop
- `POST /api/workshops` - Create workshop
- `PATCH /api/workshops/:id` - Update workshop
- `DELETE /api/workshops/:id` - Delete workshop
- `POST /api/workshops/:id/schedule` - Schedule workshop
- `POST /api/workshops/:id/complete` - Complete workshop
- `GET /api/responses/survey/:surveyId` - Get responses for survey
- `GET /api/responses/:id` - Get response
- `POST /api/responses` - Submit response
- `DELETE /api/responses/:id` - Delete response
- `GET /api/templates` - List templates
- `POST /api/templates` - Create template
- `DELETE /api/templates/:id` - Delete template
- `POST /api/templates/:id/increment-usage` - Increment template usage
- `GET /api/audit-logs` - Get audit logs

## Render Deployment

1. Connect your GitHub repository to Render
2. Create a new Web Service:
   - Name: `survey-workshop-backend`
   - Environment: Node
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
3. Set environment variables in Render dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `CORS_ORIGIN`: Your frontend URL (e.g., `https://your-frontend.onrender.com`)
   - `NODE_ENV`: `production`
4. Deploy!

