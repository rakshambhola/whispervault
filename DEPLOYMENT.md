# AnonyChat - Deployment Guide

## Deploy to Vercel

### Prerequisites
1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A PostgreSQL database (recommended: [Neon](https://neon.tech) or [Supabase](https://supabase.com))
3. A Redis instance (recommended: [Upstash Redis](https://upstash.com))

### Step 1: Set up Database

#### Option A: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string (it will look like: `postgresql://user:password@host/database`)

#### Option B: Supabase
1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to Settings → Database
3. Copy the connection string under "Connection string" → "URI"

### Step 2: Set up Redis

1. Go to [upstash.com](https://upstash.com) and create a free account
2. Create a new Redis database
3. Copy the connection string (UPSTASH_REDIS_REST_URL)

### Step 3: Deploy to Vercel

#### Method 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts and add your environment variables when asked:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `REDIS_URL`: Your Redis connection string

#### Method 2: Using Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure your project:
   - **Framework Preset**: Next.js
   - **Build Command**: `prisma generate && next build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   - Click "Environment Variables"
   - Add the following:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `REDIS_URL`: Your Redis connection string

5. Click "Deploy"

### Step 4: Run Database Migrations

After deployment, you need to run Prisma migrations:

1. In your Vercel project dashboard, go to Settings → Environment Variables
2. Make sure `DATABASE_URL` is set
3. Run migrations using Vercel CLI:
```bash
vercel env pull .env.production
npx prisma migrate deploy
```

Or use the Vercel dashboard to run a deployment command.

### Important Notes

- **Socket.IO**: Vercel's serverless functions have limitations with WebSocket connections. For production, consider:
  - Using Vercel's Edge Functions
  - Deploying Socket.IO server separately (Railway, Render, or Heroku)
  - Using a managed WebSocket service

- **Database**: Make sure your database allows connections from Vercel's IP addresses

- **Redis**: Upstash Redis works perfectly with Vercel's serverless architecture

### Troubleshooting

1. **Build fails**: Check that all environment variables are set correctly
2. **Database connection issues**: Verify your DATABASE_URL is correct and accessible
3. **Socket.IO not working**: Consider deploying the Socket.IO server separately

## Local Development

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up your `.env` file with:
```
DATABASE_URL="your-database-url"
REDIS_URL="your-redis-url"
```

4. Run Prisma migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

## Tech Stack

- **Framework**: Next.js 16
- **Database**: PostgreSQL with Prisma
- **Real-time**: Socket.IO
- **Caching**: Redis
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Deployment**: Vercel

---

Made with ❤️ by [Vivek](https://github.com/vivekisadev)
