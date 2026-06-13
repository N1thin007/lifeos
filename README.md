# LifeOS

A personal life-organizer web app: calorie tracking, workout logging, and a calendar planner with notes/tasks. Built with Next.js + Supabase, deploys free on Vercel.

## 1. Set up the database (Supabase)

1. Go to your Supabase project → **SQL Editor**.
2. Open `schema.sql` from this project, copy all of it, paste into the SQL Editor, and click **Run**.
3. This creates all tables (`foods`, `food_logs`, `workout_sessions`, `workout_exercises`, `tasks`) with Row Level Security enabled, so each user only sees their own data.

## 2. Configure environment variables

A `.env.local` file is already included with your Supabase URL and anon key. **Do not commit this file to a public GitHub repo** — it's already in `.gitignore`.

If you ever need to find these values again: Supabase Dashboard → Settings → API → Project URL and `anon` public key.

## 3. Run locally (optional, to test on your laptop)

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. Sign up with any email/password (email confirmation may be required depending on your Supabase auth settings — you can disable "Confirm email" under Authentication → Providers → Email for easier testing).

## 4. Deploy to Vercel (free, accessible from anywhere)

1. Push this project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/lifeos.git
   git push -u origin main
   ```
2. Go to vercel.com → **Add New Project** → import your GitHub repo.
3. In the **Environment Variables** section during setup, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = (your value from `.env.local`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your value from `.env.local`)
4. Click **Deploy**. After a couple minutes you'll get a URL like `https://lifeos-yourname.vercel.app`.

## 5. Use it on your phone

- Open the Vercel URL in your phone's browser.
- Tap the browser menu → "Add to Home Screen" (iOS Safari) or "Install app" (Android Chrome). This installs it as a PWA — it'll behave like a native app with its own icon.

## Features

- **Auth**: Email/password sign up & login, each user's data is private (Supabase Row Level Security).
- **Calories**: Search a global food database (Open Food Facts), manual entry, save custom recipes for reuse, daily macro totals with progress bars, organized by meal (breakfast/lunch/dinner/snack).
- **Workouts**: Log sessions with multiple exercises (sets, reps, weight), view history.
- **Planner**: Monthly calendar view, click any day to see/add tasks and notes, mark tasks complete.

## Customizing daily targets

Default calorie/macro targets (2200 kcal, 140g protein, 250g carbs, 70g fat) are set in `app/calories/page.tsx` in the `TARGETS` constant near the top of the file — edit those numbers to match your goals.
