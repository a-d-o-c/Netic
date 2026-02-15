# 🧲 NETIC - Production Deployment Guide

## What You're Deploying

A complete, production-ready Netic web application with:
- ✅ Beautiful Next.js frontend
- ✅ Supabase database (PostgreSQL)
- ✅ **REAL email notifications** (Resend)
- ✅ Auto-matching every hour (Vercel Cron)
- ✅ Trade Me search integration
- ✅ Public wants board
- ✅ Direct offer system

---

## Step 1: Set Up Supabase (5 minutes)

### Create Supabase Project

1. Go to: https://supabase.com
2. Click "Start your project"
3. Create account (free)
4. Click "New project"
   - Name: `netic`
   - Database Password: (generate strong password - save it!)
   - Region: Singapore (closest to NZ)
5. Wait 2 minutes for setup

### Create Database Tables

1. In Supabase dashboard, click "SQL Editor"
2. Click "New query"
3. Paste this SQL:

\`\`\`sql
-- Wants table
CREATE TABLE wants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  max_budget DECIMAL(10,2),
  location TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_name TEXT,
  is_free BOOLEAN DEFAULT false,
  auto_search BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches table
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  want_id UUID REFERENCES wants(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  title TEXT NOT NULL,
  price DECIMAL(10,2),
  url TEXT,
  location TEXT,
  image_url TEXT,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offers table
CREATE TABLE offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  want_id UUID REFERENCES wants(id) ON DELETE CASCADE,
  offerer_name TEXT NOT NULL,
  offerer_email TEXT NOT NULL,
  offerer_phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_wants_status ON wants(status);
CREATE INDEX idx_wants_email ON wants(contact_email);
CREATE INDEX idx_matches_want_id ON matches(want_id);
CREATE INDEX idx_offers_want_id ON offers(want_id);
\`\`\`

4. Click "Run"
5. Should see "Success. No rows returned"

### Get Supabase Keys

1. In Supabase dashboard, click "Settings" (gear icon)
2. Click "API"
3. Copy these values (you'll need them):
   - **Project URL** (looks like: `https://abc123.supabase.co`)
   - **anon public** key (long string)
   - **service_role** key (long string - keep secret!)

---

## Step 2: Set Up Resend (Email) (3 minutes)

### Create Resend Account

1. Go to: https://resend.com
2. Click "Start building"
3. Sign up (free - 3,000 emails/month)
4. Verify your email

### Get API Key

1. In Resend dashboard, click "API Keys"
2. Click "Create API Key"
   - Name: `Netic Production`
   - Permission: Full Access
3. **Copy the API key** (starts with `re_...`)
4. Save it somewhere safe - you only see it once!

### Add Sending Domain (Optional - for now skip)

For MVP, Resend will send from their domain. Later:
1. Click "Domains"
2. Add your domain (netic.co.nz)
3. Add DNS records they provide

---

## Step 3: Deploy to Vercel (10 minutes)

### Push Code to GitHub

1. Open VS Code
2. Open the `netic_production` folder
3. Open Terminal in VS Code
4. Run these commands:

\`\`\`bash
git init
git add .
git commit -m "Initial Netic deployment"
\`\`\`

5. Create new repo on GitHub:
   - Go to github.com
   - Click "+" → "New repository"
   - Name: `netic`
   - Public or Private (your choice)
   - **Don't** initialize with README
   - Click "Create repository"

6. Copy the commands shown and run them:

\`\`\`bash
git remote add origin https://github.com/YOUR_USERNAME/netic.git
git branch -M main
git push -u origin main
\`\`\`

### Deploy to Vercel

1. Go to: https://vercel.com
2. Click "Add New..." → "Project"
3. Click "Import" next to your `netic` repo
4. Configure:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: ./
   - Build Command: (leave default)
   - Output Directory: (leave default)

5. **Add Environment Variables** (click "Environment Variables"):

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
RESEND_API_KEY=your_resend_api_key_here
NEXT_PUBLIC_APP_URL=https://netic.vercel.app
CRON_SECRET=generate_random_string_here
\`\`\`

**Where to get these:**
- Supabase keys: From Step 1
- Resend API key: From Step 2
- CRON_SECRET: Generate random string (e.g., `openssl rand -base64 32` or just type random letters)

6. Click "Deploy"
7. Wait 2-3 minutes
8. Done! You'll get a URL like: `netic.vercel.app`

---

## Step 4: Test Everything (5 minutes)

### Test 1: Post a Want

1. Go to your Vercel URL: `https://netic.vercel.app`
2. Click "Post a Want"
3. Fill in:
   - Title: "Test golf club"
   - Budget: $100
   - Location: Orewa
   - Email: YOUR_EMAIL
4. Click "Post Want"
5. Should redirect to "My Wants"

### Test 2: Manual Search

1. On "My Wants" page
2. Click "Search Now"
3. Wait 10 seconds
4. Should see "Found X new matches!"

### Test 3: Email Notification

1. Check your email
2. Should see email from Resend with matches
3. Beautiful HTML email with listings

### Test 4: Auto-Matching (Hourly)

Auto-matching runs every hour automatically via Vercel Cron.

To test manually:
1. Go to: `https://netic.vercel.app/api/cron/auto-match`
2. Add header: `Authorization: Bearer YOUR_CRON_SECRET`
3. Or wait 1 hour and check email

---

## Step 5: Custom Domain (Optional)

### Buy Domain

1. Buy `netic.co.nz` from any registrar
2. In Vercel project settings:
   - Click "Domains"
   - Add "netic.co.nz"
   - Follow DNS instructions
3. Update NEXT_PUBLIC_APP_URL to `https://netic.co.nz`

---

## What Happens Now?

### Automatic Features

✅ **Hourly Auto-Matching**
- Vercel Cron runs every hour
- Searches Trade Me for all active wants
- Sends email notifications for new matches

✅ **Email Notifications**
- New matches → instant email
- Direct offers → instant email
- Beautiful HTML templates

✅ **Database**
- All data stored in Supabase
- Real-time updates
- Automatic backups

### Usage Limits (Free Tiers)

**Vercel:**
- 100GB bandwidth/month
- 100 hours serverless compute/month
- More than enough for MVP

**Supabase:**
- 500MB database
- 50,000 monthly active users
- 2GB file storage

**Resend:**
- 3,000 emails/month
- 100 emails/day

---

## Monitoring & Maintenance

### Check Cron Jobs

1. Vercel dashboard → Your project
2. Click "Cron Jobs"
3. See execution history

### Check Database

1. Supabase dashboard
2. Click "Table Editor"
3. See all wants/matches/offers

### Check Emails

1. Resend dashboard
2. Click "Logs"
3. See all sent emails

---

## Troubleshooting

### "Unauthorized" error on cron
- Check CRON_SECRET matches in Vercel env vars

### No emails sending
- Check RESEND_API_KEY is correct
- Check email logs in Resend dashboard
- Free tier: max 100 emails/day

### Trade Me search not working
- Trade Me API is public (no key needed)
- If rate limited, wait 1 hour

### Database connection failed
- Check Supabase keys are correct
- Check database is running (Supabase dashboard)

---

## Next Steps

### Week 1: Test & Iterate
- Post real wants
- Invite 5 friends to test
- Fix any bugs

### Week 2: Local Promotion
- Share with Orewa community Facebook groups
- Approach 2-3 charity shops
- Get feedback

### Month 1: Grow
- Add more features (SMS, better matching)
- Improve email templates
- Scale based on usage

---

## You're Live! 🚀

Your Netic app is now:
- ✅ Live on the internet
- ✅ Searching Trade Me hourly
- ✅ Sending real email notifications
- ✅ Ready for users to test
- ✅ Professional and scalable

**Share your link:** `https://netic.vercel.app`

🧲 **Netic - What you want, finds you.**
