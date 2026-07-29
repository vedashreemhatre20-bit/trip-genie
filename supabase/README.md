# Supabase Backend Setup

This folder contains the Supabase configuration, database migrations, and edge functions for TripAI.

## Setup Instructions

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link to your project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### 4. Run migrations

```bash
supabase db push
```

This will create:
- `profiles` table (extends auth.users with role management)
- `trips` table (stores user trip plans)
- `avatars` storage bucket
- Row Level Security (RLS) policies
- Auto-create profile trigger on user signup
- Auto-update `updated_at` timestamps

### 5. Deploy Edge Functions

```bash
supabase functions deploy admin-users
```

### 6. Set up environment variables

In your Vercel deployment, add:
- `VITE_SUPABASE_URL` — Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Your Supabase anon/public key

## Database Schema

### profiles
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | References auth.users(id) |
| full_name | TEXT | User's display name |
| avatar_url | TEXT | URL to avatar image |
| role | TEXT | 'user' or 'super_admin' |
| created_at | TIMESTAMPTZ | Auto-set on creation |
| updated_at | TIMESTAMPTZ | Auto-updated on changes |

### trips
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Auto-generated primary key |
| user_id | UUID | References auth.users(id) |
| destination | TEXT | Trip destination |
| days | INTEGER | Number of travel days |
| budget | NUMERIC | Trip budget |
| style | TEXT | Travel style |
| interests | TEXT[] | Array of interests |
| transport | TEXT | Transport preference |
| itinerary | JSONB | Generated itinerary data |
| created_at | TIMESTAMPTZ | Auto-set on creation |
| updated_at | TIMESTAMPTZ | Auto-updated on changes |

## Edge Functions

### admin-users
Admin-only function for user management.

**Endpoints:**
- `?action=list` — List all users with profiles
- `?action=stats` — Get user/trip statistics
- `?action=update-role` — Update user role (POST with `{userId, role}`)

## Making Yourself Super Admin

After signing up, run this SQL in Supabase SQL Editor:

```sql
UPDATE public.profiles 
SET role = 'super_admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
```

Or update user metadata in Authentication > Users > Your User > Edit metadata:
```json
{"role": "super_admin", "full_name": "Your Name"}
```