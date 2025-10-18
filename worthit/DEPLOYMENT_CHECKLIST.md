# Deployment Checklist for WorthIt

## Pre-Deployment Checklist

### Firebase Setup
- [ ] Firebase project created
- [ ] Google Authentication enabled
- [ ] Firestore Database created
- [ ] Firestore security rules updated
- [ ] Firebase configuration added to `src/firebase.js`
- [ ] Localhost added to authorized domains (for testing)

### Local Testing
- [ ] Run `npm install` successfully
- [ ] Run `npm start` and test locally
- [ ] Test Google Sign-In flow
- [ ] Test adding/editing/deleting items in all categories:
  - [ ] Loans (with interest rates)
  - [ ] Debts
  - [ ] Income/Savings
  - [ ] Other Liabilities
- [ ] Verify net worth calculation is correct
- [ ] Test earnings calculator with different time periods
- [ ] Test with both positive and negative net worth scenarios
- [ ] Check responsive design on mobile/tablet/desktop

### GitHub Repository Setup
- [ ] Code pushed to GitHub repository
- [ ] Repository is public (required for GitHub Pages free tier)
- [ ] Update `package.json` homepage field with your GitHub Pages URL:
  ```json
  "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
  ```

### Firebase Production Setup
- [ ] Add GitHub Pages domain to Firebase authorized domains:
  - Firebase Console > Authentication > Settings > Authorized domains
  - Add: `YOUR_USERNAME.github.io`
- [ ] Verify Firestore rules are set to production mode
- [ ] Check Firebase usage limits (should be fine for personal use)

## Deployment Steps

### 1. Build and Deploy
```bash
# Make sure you're in the worthit directory
cd worthit

# Deploy to GitHub Pages
npm run deploy
```

### 2. Enable GitHub Pages
1. Go to your GitHub repository
2. Click Settings > Pages
3. Ensure source is set to `gh-pages` branch
4. Wait 2-5 minutes for deployment

### 3. Verify Deployment
- [ ] Visit `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`
- [ ] Page loads without errors
- [ ] Google Sign-In works
- [ ] Can add/edit/delete items
- [ ] Data persists after refresh
- [ ] Net worth calculates correctly

## Post-Deployment

### Testing in Production
- [ ] Test from different devices
- [ ] Test from different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Verify data syncs across devices
- [ ] Check mobile responsiveness

### Optional Enhancements
- [ ] Set up custom domain (optional)
- [ ] Enable Firebase Analytics (optional)
- [ ] Set up backup strategy (export Firestore data)
- [ ] Add error tracking (e.g., Sentry)

## Troubleshooting

### Common Issues

**Issue: "Firebase: Error (auth/unauthorized-domain)"**
- Solution: Add your domain to Firebase authorized domains

**Issue: Blank page after deployment**
- Solution: Check browser console for errors
- Verify `homepage` in package.json is correct
- Ensure Firebase config is correct

**Issue: Sign-in popup blocked**
- Solution: Allow popups in browser settings

**Issue: Data not saving**
- Solution: Check Firestore rules
- Verify user is authenticated
- Check browser console for errors

**Issue: 404 on GitHub Pages**
- Solution: Wait 2-5 minutes after deployment
- Check GitHub Pages settings
- Verify `gh-pages` branch exists

## Maintenance

### Regular Tasks
- [ ] Monitor Firebase usage (Console > Usage and billing)
- [ ] Check for security alerts in Firebase Console
- [ ] Update dependencies periodically: `npm update`
- [ ] Backup Firestore data (Export from Console)

### Updates
To update the deployed version:
1. Make changes to code
2. Test locally with `npm start`
3. Commit and push to GitHub
4. Run `npm run deploy`

## Security Notes

- ✅ Never commit Firebase config to public repos with sensitive data
- ✅ Use environment variables for production secrets
- ✅ Firestore rules enforce user data isolation
- ✅ Regular security audits recommended

## Success Criteria

Your deployment is successful when:
- ✅ App loads on GitHub Pages URL
- ✅ Users can sign in with Google
- ✅ Financial data can be added/edited/deleted
- ✅ Net worth calculates accurately
- ✅ Data persists across sessions
- ✅ Works on mobile and desktop

---

## Need Help?

- Firebase Issues: [Firebase Support](https://firebase.google.com/support)
- GitHub Pages: [GitHub Pages Docs](https://docs.github.com/en/pages)
- React Issues: Check browser console for errors

**Congratulations on deploying WorthIt!** 🎉
