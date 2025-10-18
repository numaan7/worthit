# 🔒 Security Notice

## ⚠️ Firebase Credentials Removed

The Firebase credentials have been removed from this repository for security reasons.

## 🔧 How to Configure Firebase

### Step 1: Get Your Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select or create your project
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Copy your Firebase configuration

### Step 2: Add Credentials to Your Local Project

**Option A: Direct Configuration (Simpler)**
1. Open `/src/firebase.js`
2. Replace the placeholder values with your actual Firebase credentials:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  measurementId: "G-ABCDEFGHIJ"
};
```

**Option B: Environment Variables (More Secure)**
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Edit `.env.local` and add your Firebase credentials
3. Update `/src/firebase.js` to use environment variables:
```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};
```

### Step 3: Enable Firebase Services
1. **Authentication**: 
   - Go to Firebase Console > Authentication
   - Click "Get Started"
   - Enable "Google" sign-in method
   - Add your domain to authorized domains

2. **Firestore Database**:
   - Go to Firebase Console > Firestore Database
   - Click "Create database"
   - Start in production mode
   - Choose your region

3. **Security Rules** (Important!):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{collection}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
       match /userSettings/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

### Step 4: Deploy
Once configured, you can deploy:
```bash
npm run deploy
```

## 🔐 Security Best Practices

### ✅ DO:
- Use `.env.local` for sensitive data (it's in .gitignore)
- Keep your Firebase API keys secure
- Enable Firebase security rules
- Add only authorized domains to Firebase
- Regularly review Firebase usage
- Use environment-specific configs

### ❌ DON'T:
- Commit credentials to GitHub
- Share your `.env.local` file
- Disable Firebase security rules
- Use production credentials in development
- Expose credentials in client-side code
- Push `.env` files to repository

## 📋 Checklist

Before deploying, ensure:
- [ ] Firebase credentials are configured
- [ ] `.env.local` is in .gitignore
- [ ] Firebase Authentication is enabled
- [ ] Firestore database is created
- [ ] Security rules are set
- [ ] Authorized domains are added
- [ ] App builds without errors
- [ ] Authentication works
- [ ] Data operations work

## 🆘 Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
- Check that your API key is correct
- Verify the API key is enabled in Google Cloud Console

### "Missing or insufficient permissions"
- Check Firestore security rules
- Ensure user is authenticated
- Verify userId matches in security rules

### "Firebase: Firebase App named '[DEFAULT]' already exists"
- Only initialize Firebase once
- Check for duplicate initialization

## 📚 Resources

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Environment Variables in React](https://create-react-app.dev/docs/adding-custom-environment-variables/)

## ⚠️ Important Notes

1. **API Keys in Public Repos**: While Firebase API keys are designed to be public (they're in your client-side code), you should still:
   - Use Firebase security rules to protect data
   - Restrict API keys to your domain
   - Monitor usage in Firebase Console

2. **Never Commit**:
   - `.env.local`
   - `.env.development.local`
   - `.env.production.local`
   - Any file with real credentials

3. **For Contributors**: Ask the repository owner for Firebase credentials or create your own Firebase project for testing.

---

**Need Help?** Check the SETUP_GUIDE.md for detailed setup instructions.
