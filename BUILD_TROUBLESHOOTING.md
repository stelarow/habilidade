# Build Troubleshooting Guide

## 🔧 Recent Issues Fixed

### TypeScript Error - Error Message Access
**Issue**: Direct access to `error.message` on unknown types causes TypeScript build failures.
**Solution**: Use type guard `error instanceof Error ? error.message : 'fallback'`

### ESLint Missing Dependencies
**Issue**: useEffect dependency arrays missing `supabase` client reference.
**Solution**: Add `supabase` to dependency arrays in useEffect hooks.

## 🔧 Environment Configuration

### Sentry Configuration (Optional)
If you want to upload source maps to Sentry for better error tracking:

1. **Get Sentry Auth Token**:
   - Go to https://sentry.io/settings/account/api/auth-tokens/
   - Create a new token with `project:releases` and `org:read` scopes

2. **Configure Netlify Environment Variables**:
   ```
   SENTRY_AUTH_TOKEN=your_token_here
   ```

3. **Alternative**: Disable Sentry source maps in production:
   ```javascript
   // In next.config.js
   const nextConfig = {
     // ... other config
     experimental: {
       instrumentationHook: process.env.NODE_ENV === 'development'
     }
   }
   ```

## 🚀 Build Status

- ✅ **TypeScript Errors**: Fixed
- ✅ **ESLint Warnings**: Fixed  
- ⚠️ **Sentry Source Maps**: Optional (requires token)
- ✅ **Deployment**: Ready to deploy

## 📋 Monitoring

Monitor the following after deployment:
- API routes functionality (`/api/admin/enrollments`, `/api/admin/progress`)
- Admin enrollment management interface
- Database operations (create/update/delete enrollments)
- Error tracking and logging

## 🔍 Common Issues

### Build Fails with TypeScript Errors
- Check for direct `error.message` access
- Use type guards: `error instanceof Error ? error.message : 'fallback'`

### ESLint Warnings
- Add all dependencies to useEffect arrays
- Include Supabase client in dependencies

### Runtime Errors
- Check database schema matches API expectations
- Verify environment variables are set
- Check authentication middleware is working

## 📞 Support

If issues persist:
1. Check the build logs for specific error messages
2. Verify all environment variables are configured
3. Test API endpoints individually
4. Check database connectivity and permissions