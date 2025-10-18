# Firestore Data Structure

This document describes the data structure used in the WorthIt application's Firestore database.

## Collections

The application uses five main collections to store user financial data and preferences:

### 1. `loans`

Stores loan information with interest rates and dates.

**Document Structure:**
```javascript
{
  name: string,           // Name of the loan (e.g., "Student Loan", "Car Loan")
  amount: number,         // Principal amount of the loan
  interestRate: number,   // Annual interest rate as a percentage (e.g., 5.5 for 5.5%)
  date: timestamp,        // Date the loan was taken or recorded
  userId: string,         // User ID from Firebase Authentication
  createdAt: timestamp,   // Document creation timestamp
  updatedAt: timestamp    // Last update timestamp (optional)
}
```

**Example:**
```javascript
{
  name: "Student Loan",
  amount: 25000,
  interestRate: 6.8,
  date: Timestamp(2024-01-15 00:00:00),
  userId: "abc123xyz",
  createdAt: Timestamp(2025-10-17 10:30:00)
}
```

### 2. `debts`

Stores general debt information without interest rates, with dates.

**Document Structure:**
```javascript
{
  name: string,           // Name of the debt (e.g., "Credit Card", "Personal Debt")
  amount: number,         // Amount owed
  date: timestamp,        // Date the debt was incurred or recorded
  userId: string,         // User ID from Firebase Authentication
  createdAt: timestamp,   // Document creation timestamp
  updatedAt: timestamp    // Last update timestamp (optional)
}
```

**Example:**
```javascript
{
  name: "Credit Card Balance",
  amount: 3500,
  date: Timestamp(2024-06-01 00:00:00),
  userId: "abc123xyz",
  createdAt: Timestamp(2025-10-17 10:35:00)
}
```

### 3. `payments`

Stores payments made towards loans or debts.

**Document Structure:**
```javascript
{
  targetType: string,     // Type of target: "loan" or "debt"
  targetId: string,       // ID of the loan or debt document being paid
  targetName: string,     // Name of the loan or debt (for display purposes)
  amount: number,         // Payment amount
  date: timestamp,        // Date the payment was made
  userId: string,         // User ID from Firebase Authentication
  createdAt: timestamp,   // Document creation timestamp
  updatedAt: timestamp    // Last update timestamp (optional)
}
```

**Example:**
```javascript
{
  targetType: "loan",
  targetId: "loanDoc123",
  targetName: "Student Loan",
  amount: 500,
  date: Timestamp(2025-10-01 00:00:00),
  userId: "abc123xyz",
  createdAt: Timestamp(2025-10-17 10:40:00)
}
```

### 4. `liabilities`

Stores other liabilities not categorized as loans or debts, with dates.

**Document Structure:**
```javascript
{
  name: string,           // Name of liability (e.g., "Unpaid Taxes", "Medical Bills")
  amount: number,         // Amount of liability
  date: timestamp,        // Date the liability was incurred or recorded
  userId: string,         // User ID from Firebase Authentication
  createdAt: timestamp,   // Document creation timestamp
  updatedAt: timestamp    // Last update timestamp (optional)
}
```

**Example:**
```javascript
{
  name: "Property Tax",
  amount: 2000,
  date: Timestamp(2025-09-15 00:00:00),
  userId: "abc123xyz",
  createdAt: Timestamp(2025-10-17 10:45:00)
}
```

### 5. `userSettings`

Stores user preferences and settings.

**Document ID:** User's Firebase Auth UID (one document per user)

**Document Structure:**
```javascript
{
  currency: string,       // Selected currency code (e.g., "USD", "EUR", "GBP")
  updatedAt: timestamp    // Last update timestamp
}
```

**Example:**
```javascript
{
  currency: "USD",
  updatedAt: Timestamp(2025-10-17 11:00:00)
}
```

**Supported Currencies:**
- USD, EUR, GBP, INR, JPY, CNY, AUD, CAD, CHF, SEK
- NZD, SGD, HKD, KRW, BRL, MXN, ZAR, AED, SAR

## Security Rules

All collections follow the same security pattern:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apply to financial data collections (loans, debts, incomes, liabilities)
    match /{collection}/{document} {
      // Users can only read their own documents
      allow read: if request.auth != null && 
                    resource.data.userId == request.auth.uid;
      
      // Users can only create documents with their own userId
      allow create: if request.auth != null && 
                      request.resource.data.userId == request.auth.uid;
      
      // Users can only update/delete their own documents
      allow update, delete: if request.auth != null && 
                              resource.data.userId == request.auth.uid;
    }
    
    // User settings - document ID matches user ID
    match /userSettings/{userId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == userId;
    }
  }
}
```

## Queries

### Read Operations

All queries filter by the current user's ID:

```javascript
const q = query(
  collection(db, 'loans'), 
  where('userId', '==', currentUser.uid)
);
```

### Create Operations

All documents include the userId field:

```javascript
await addDoc(collection(db, 'loans'), {
  name: 'Student Loan',
  amount: 25000,
  interestRate: 6.8,
  userId: currentUser.uid,
  createdAt: new Date()
});
```

### Update Operations

Updates preserve the userId field:

```javascript
await updateDoc(doc(db, 'loans', documentId), {
  name: 'Updated Loan Name',
  amount: 26000,
  updatedAt: new Date()
});
```

### Delete Operations

```javascript
await deleteDoc(doc(db, 'loans', documentId));
```

## Indexes

Firestore automatically creates indexes for single-field queries. For this application, the following indexes are automatically created and sufficient:

- `loans` - userId (ascending)
- `debts` - userId (ascending)
- `payments` - userId (ascending)
- `liabilities` - userId (ascending)

No composite indexes are required for the current query patterns.

## Calculations

### Net Worth Calculation

The net worth is calculated client-side using this formula:

```javascript
// Calculate total loans with interest (before payments)
totalLoansWithInterest = loans.reduce((sum, loan) => {
  const principal = loan.amount;
  const interest = loan.interestRate ? (principal * loan.interestRate) / 100 : 0;
  return sum + principal + interest;
}, 0);

// Calculate total debts (before payments)
totalDebts = debts.reduce((sum, debt) => sum + debt.amount, 0);

// Calculate total other liabilities
totalOtherLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0);

// Calculate total payments made
totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);

// Net Worth Formula:
// Net Worth = -(Loans with Interest) + Payments Made - Debts - Other Liabilities
netWorth = -totalLoansWithInterest + totalPayments - totalDebts - totalOtherLiabilities
```

**Simplified:**
```
Net Worth = Payments - (Loans + Debts + Liabilities)
```

**Example:**
- Loans with Interest: $53,400
- Debts: $5,000
- Other Liabilities: $2,000
- Payments Made: $10,000

Net Worth = -$53,400 + $10,000 - $5,000 - $2,000 = **-$50,400**

### Loan Interest Calculation

Interest is calculated as a simple annual percentage of the principal:

```javascript
interest = principal * (interestRate / 100)
totalOwed = principal + interest
// Payments are then deducted from this total
```

## Data Limits

### Firestore Free Tier Limits (as of 2025)
- **Stored Data:** 1 GiB
- **Document Reads:** 50,000/day
- **Document Writes:** 20,000/day
- **Document Deletes:** 20,000/day

### Per Document
- **Max Size:** 1 MiB (more than sufficient for financial entries)
- **Max Field Value Length:** 1 MiB

### Best Practices

1. **Keep documents small** - Current structure is optimal
2. **Denormalize data** - Each document is self-contained
3. **Index efficiently** - Only userId needs indexing
4. **Paginate reads** - Not needed for personal finance (low document count)
5. **Batch operations** - Not needed for single-user operations

## Real-time Updates

The application uses real-time listeners on all collections:

```javascript
onSnapshot(query, (snapshot) => {
  const items = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  setItems(items);
});
```

This ensures:
- ✅ Instant updates across all devices
- ✅ Automatic synchronization
- ✅ No manual refresh needed
- ✅ Real-time collaboration (if sharing access)

## Data Export

To export data from Firebase Console:
1. Go to Firestore Database
2. Click on a collection
3. Export > Export collection
4. Choose format (JSON recommended)

## Data Backup Strategy

**Recommended:**
- Manual export weekly/monthly from Firebase Console
- Store exports in secure location (Google Drive, encrypted backup)
- Test restore process periodically

**Automated Options:**
- Use Firebase scheduled backups (requires Blaze plan)
- Export via Cloud Functions (requires Blaze plan)

## Privacy & Data Retention

- User data is isolated by userId
- No data sharing between users
- Users can delete individual items
- Account deletion should remove all user data (implement if needed)

---

## Future Enhancements

Potential schema additions:
- `transactions` collection for tracking income/expense history
- `goals` collection for financial targets
- `categories` for better organization
- `recurring_items` for automatic monthly entries
- `budgets` for spending limits

These would maintain the same userId-based isolation pattern.
