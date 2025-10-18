# WorthIt - Net Worth Tracker

A comprehensive React web application to track your net worth, manage loans, debts, income, and calculate how much you need to earn to reach your financial goals.

## Features

- 🔐 **Google Sign-In Authentication** - Secure login with Firebase Authentication
- 💰 **Net Worth Calculation** - Real-time calculation of your total net worth
- � **Multi-Currency Support** - Choose from 19+ currencies (USD, EUR, GBP, INR, JPY, and more)
- �📊 **Financial Management** - Track:
  - Loans (with interest rates)
  - Debts
  - Income/Savings
  - Other Liabilities
- 📈 **Earnings Calculator** - Calculate how much you need to earn per day/week/month/year to:
  - Break even (reach $0 net worth)
  - Reach a custom target amount
- 🎨 **Beautiful UI** - Built with Material-UI (MUI) for a modern, responsive design
- ☁️ **Cloud Database** - All data stored securely in Firebase Firestore
- 🚀 **No Router** - Single-page app optimized for GitHub Pages deployment

## Setup Instructions

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Authentication** with Google Sign-In:
   - Go to Authentication > Sign-in method
   - Enable Google provider
4. Create a **Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode (or test mode for development)
5. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps"
   - If no app exists, click "Add app" and choose Web
   - Copy the Firebase configuration object

### 2. Update Firebase Configuration

Open `src/firebase.js` and replace the placeholder values with your Firebase configuration:

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

### 3. Firestore Security Rules

In Firebase Console, go to Firestore Database > Rules and set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write only their own data
    match /{collection}/{document} {
      allow read, write: if request.auth != null && 
                          request.resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
    }
  }
}
```

### 4. Install Dependencies

```bash
cd worthit
npm install
```

### 5. Run Locally

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Deployment to GitHub Pages

### 1. Update Homepage URL

In `package.json`, update the homepage URL to match your GitHub username and repository:

```json
"homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
```

### 2. Add Authorized Domain in Firebase

1. Go to Firebase Console > Authentication > Settings > Authorized domains
2. Add your GitHub Pages domain: `YOUR_USERNAME.github.io`

### 3. Deploy

```bash
npm run deploy
```

This will build your app and deploy it to GitHub Pages.

### 4. Enable GitHub Pages

1. Go to your GitHub repository
2. Navigate to Settings > Pages
3. Ensure the source is set to `gh-pages` branch

Your app will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

## Usage

### Sign In
- Click "Sign in with Google" on the login page
- Authorize the app to access your Google account

### Select Currency
- Use the currency dropdown in the top navigation bar
- Choose from 19+ supported currencies
- Your preference is automatically saved

### Track Your Finances

1. **Add Loans**: Click "Add" in the Loans section
   - Enter loan name, amount, and interest rate
   - Interest is calculated and added to the total liability

2. **Add Debts**: Track debts without interest rates

3. **Add Income/Savings**: Track your assets and income sources

4. **Add Other Liabilities**: Any other financial obligations

### View Net Worth
- Your net worth is automatically calculated as: **Assets - Liabilities**
- Green display = Positive net worth 🎉
- Red display = Negative net worth ⚠️

### Calculate Earnings Needed (When Negative)
- Choose a target amount (or leave empty to break even)
- Select a time period (day/week/month/year)
- See how much you need to earn per day/week/month/year

## Technologies Used

- **React** - Frontend framework
- **Material-UI (MUI)** - UI components and styling
- **Firebase Authentication** - Google Sign-In
- **Cloud Firestore** - Real-time database
- **GitHub Pages** - Hosting

## Project Structure

```
worthit/
├── src/
│   ├── components/
│   │   ├── Dashboard.js          # Main dashboard with all financial data
│   │   ├── Login.js              # Login page with Google Sign-In
│   │   ├── NetWorthCalculator.js # Net worth display and earnings calculator
│   │   └── ItemList.js           # Reusable component for managing financial items
│   ├── App.js                    # Main app component with routing logic
│   ├── AuthContext.js            # Authentication context provider
│   ├── firebase.js               # Firebase configuration
│   ├── index.js                  # App entry point
│   └── index.css                 # Global styles
├── public/
│   └── index.html                # HTML template
└── package.json                  # Dependencies and scripts
```

## Features Explained

### Loans with Interest
- Automatically calculates interest on top of principal
- Shows total amount owed including interest
- Configurable interest rate per loan

### Earnings Calculator
- Dynamically calculates daily/weekly/monthly/yearly earnings needed
- Adjustable target amount
- Helps plan financial recovery

### Real-time Updates
- All changes sync immediately to Firestore
- Data persists across devices
- Real-time calculation updates

## Security

- User authentication required
- Data isolated per user (userId based queries)
- Firestore security rules enforce data access control
- All data stored securely in Firebase

## Contributing

Feel free to fork this project and submit pull requests for any improvements!

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using React and Firebase
