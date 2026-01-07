# Supabase Migrations

This directory contains SQL migrations for the Alecci Media AI database.

## Quick Start

**Run these in order in [Supabase SQL Editor](https://supabase.com/dashboard/project/esymbjpzjjkffpfqukxw/sql):**

1. **`01_create_tables.sql`** - Creates all database tables (RUN THIS FIRST!)
2. **`02_enable_rls.sql`** - Enables RLS and creates all security policies

That's it! The tables include soft delete columns already.

## Migrations

### 20260108_rls_policies_fixed.sql (RECOMMENDED)
Enables Row Level Security (RLS) on all tables with comprehensive policies.

| Table | Policies |
|-------|----------|
| User | Users can only view/update their own profile |
| Chat | Users can CRUD own chats, view public chats |
| Message_v2 | Users can access messages in their accessible chats |
| Vote_v2 | Users can vote on messages in accessible chats |
| Document | Users can only access their own documents |
| Suggestion | Users can only access their own suggestions |
| Stream | Users can only access streams for their own chats |
| ExecutiveMemory | Users can only access their own memory |
| MessageReaction | Users can manage their own reactions |
| UserAnalytics | Users can only access their own analytics |

### 20260108_add_soft_delete_columns.sql
Adds `deletedAt` column to support soft delete:
- Chat, Message_v2, Vote_v2, Stream, Document, Suggestion
- Includes indexes for efficient querying
- Updates RLS policies to exclude soft-deleted records

## How to Apply

### Option 1: Supabase Dashboard (Recommended)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `esymbjpzjjkffpfqukxw`
3. Navigate to **SQL Editor**
4. Run migrations in order:
   - First: `20260108_add_soft_delete_columns.sql`
   - Then: `20260108_add_rls_policies.sql`

### Option 2: Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to project
supabase link --project-ref esymbjpzjjkffpfqukxw

# Run migrations
supabase db push
```

### Option 3: Direct SQL (psql)
```bash
# Connect to database
psql "postgresql://postgres:[PASSWORD]@db.esymbjpzjjkffpfqukxw.supabase.co:5432/postgres"

# Run migrations
\i supabase/migrations/20260108_add_soft_delete_columns.sql
\i supabase/migrations/20260108_add_rls_policies.sql
```

## Verification

After applying migrations, verify RLS is enabled:

```sql
-- Check RLS status
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Check policies
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

## Important Notes

1. **Service Role Bypass**: The service role key automatically bypasses RLS. This is used for server-side operations.

2. **Anon Key Restrictions**: The anon key is subject to all RLS policies. This protects client-side access.

3. **Performance**: Indexes are included for efficient policy evaluation.

4. **Soft Delete**: All SELECT policies filter out `deletedAt IS NOT NULL` records.

## Security Checklist

- [x] RLS enabled on all user data tables
- [x] Users can only access their own data
- [x] Public chats are readable by all authenticated users
- [x] Soft delete support with proper filtering
- [x] Indexes for RLS performance
- [ ] Regular audit of RLS policies
