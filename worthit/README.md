# WorthIt - Net Worth Tracker

A comprehensive React web application to track your net worth, manage loans, debts, income, and calculate how much you need to earn to reach your financial goals.

## ✨ Features

- 🔐 **Google Sign-In Authentication** - Secure login with Firebase
- 💰 **Net Worth Calculation** - Real-time calculation of your total net worth
- 📊 **Financial Management** - Track loans (with interest), debts, income, and liabilities
- 📈 **Earnings Calculator** - See how much to earn per day/week/month/year to reach goals
- 🎨 **Beautiful UI** - Built with Material-UI for a modern, responsive design
- ☁️ **Cloud Database** - All data stored securely in Firebase Firestore
- 🚀 **GitHub Pages Ready** - Optimized for easy deployment

## 🚀 Quick Start (5 minutes)

### 1. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project
2. Enable **Google Authentication** (Authentication > Sign-in method)
3. Create a **Firestore Database** (production mode)
4. Update Firestore Rules:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{collection}/{document} {
         allow read, write: if request.auth != null && 
                             request.resource.data.userId == request.auth.uid;
         allow create: if request.auth != null && 
                          request.resource.data.userId == request.auth.uid;
       }
     }
   }
   ```
5. Get your Firebase config (Project Settings > Your apps > Web app)

### 2. Configure App

Open `src/firebase.js` and replace with your Firebase config:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Run Locally

```bash
npm install
npm start
```

Visit http://localhost:3000

## 📦 Deploy to GitHub Pages

1. Update `package.json` homepage:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/worthit"
   ```

2. Add domain to Firebase (Authentication > Settings > Authorized domains):
   - Add: `YOUR_USERNAME.github.io`

3. Deploy:
   ```bash
   npm run deploy
   ```

4. Enable GitHub Pages in repo Settings > Pages (source: gh-pages branch)

## 📖 How to Use

1. **Sign In** with Google
2. **Add Financial Data:**
   - Loans (with interest rates)
   - Debts
   - Income/Savings
   - Other Liabilities
3. **View Net Worth** - Automatically calculated
4. **Calculate Earnings** - If negative, see how much to earn per period

## 🛠️ Technologies

- React
- Material-UI (MUI)
- Firebase Authentication & Firestore
- GitHub Pages

## 📚 Documentation

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed documentation.

## 📄 License

MIT License

---

Built with ❤️ using React and Firebase


### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
