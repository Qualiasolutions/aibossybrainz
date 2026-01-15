# Rollback Procedures

## Vercel Deployment Rollback

### Via Dashboard (Recommended)
1. Go to https://vercel.com/qualiasolutionscy/aleccinew/deployments
2. Find the last known good deployment
3. Click "..." menu > "Promote to Production"
4. Confirm the rollback

### Via CLI
```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]

# Example
vercel rollback aleccinew-abc123.vercel.app
```

## Database Rollback

### Migration Rollback
If a migration causes issues:

1. **Assess impact** - Is data affected or just schema?
2. **For schema-only changes:**
   ```sql
   -- Example: Remove a column
   ALTER TABLE "TableName" DROP COLUMN "columnName";

   -- Example: Drop a table
   DROP TABLE IF EXISTS "TableName";
   ```
3. **For data migrations:**
   - Restore from PITR to before migration
   - Or run compensating queries

### Full Database Restore
1. Go to Supabase Dashboard > Settings > Backups
2. Select restore point (daily backups or PITR)
3. Confirm and wait for completion
4. Update environment if connection string changed

## Health Verification

After any rollback:
```bash
# Check deployment health
curl https://aleccinew.vercel.app/api/health

# Expected response
{
  "status": "healthy",
  "database": "connected",
  ...
}
```

## Quick Reference

| Issue | Action |
|-------|--------|
| Bad deployment | Vercel Dashboard > Promote previous |
| Database schema issue | Run reverse migration SQL |
| Data corruption | Supabase PITR restore |
| Environment issue | Check Vercel env vars |

## Emergency Contacts

- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/dashboard/support

## Recent Deployment History

Track deployments at: https://vercel.com/qualiasolutionscy/aleccinew/deployments

---

**Last Updated:** 2026-01-15
