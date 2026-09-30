# Quick Start: Testing Multi-Currency Feature

## 🚀 How to Test the Currency Feature

### Step 1: Start Your Application

```bash
# Terminal 1 - Start Backend
cd shoprecord-backend
npm install  # if not done
npm start

# Terminal 2 - Start Frontend  
cd shoprecord-frontend
npm install  # if not done
npm run dev
```

### Step 2: Open the Application

Navigate to: `http://localhost:3000`

### Step 3: Login/Register

Create an account or login with existing credentials.

### Step 4: Test Currency Switching

1. **Look at the navbar** - You'll see a currency dropdown selector
2. **Click the selector** - You'll see all 12 available currencies
3. **Select "KSH - Kenyan Shilling"** ✅
4. **Watch the magic** - All prices instantly convert to KSh!

### Step 5: Verify Functionality

Test these areas:

#### Dashboard
- Total Inventory Value should show in KSh
- Average Price should show in KSh  
- Recent Products should show prices in KSh

#### Products Page
- Product prices in table show in KSh
- Total value calculations in KSh
- Create/edit product forms still use numbers

#### Persistence
- Refresh the page
- Currency selection should remain as KSh
- All prices still in KSh

### 🧪 Testing Different Currencies

Try these currency switches:

```
USD ($) → Default, American format
EUR (€) → European format with comma decimal
KSH (KSh) → Kenyan Shillings
GBP (£) → British Pounds
JPY (¥) → Japanese Yen (no decimals!)
```

### ✅ What Should Work

- ✅ Currency selector appears in navbar
- ✅ Clicking selector shows all 12 currencies
- ✅ Selecting a currency updates all prices immediately
- ✅ Each currency shows correct symbol (€, $, KSh, etc.)
- ✅ Numbers formatted correctly for each locale
- ✅ Selection persists after page refresh
- ✅ Works on dashboard, products, and all pages

### ❌ Troubleshooting

**Currency selector not showing?**
- Check that you're logged in
- Verify CurrencyProvider is in layout.jsx
- Check browser console for errors

**Prices not updating?**
- Clear browser localStorage
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors

**Wrong formatting?**
- Some older browsers may not support all locales
- Fallback formatting will show: "KSh 12950.00"

### 🎯 Quick Visual Test

Create a product with price 100:

| Currency | Should Display |
|----------|---------------|
| USD | $100.00 |
| EUR | €92.00 |
| KSH | KSh 12,950.00 |
| GBP | £79.00 |
| JPY | ¥14,950 |

### 📱 Mobile Testing

The currency selector is responsive:
- On mobile, it appears in navbar
- Dropdown works with touch
- Selection persists on mobile too

### 🔧 Developer Tools Test

Open browser DevTools:

1. **Console**: Check for errors
2. **Application** → **Local Storage** → Look for `preferred_currency` key
3. **Network**: No extra API calls (conversion is frontend-only)

### 🎨 Visual Confirmation

When you switch to KSH, you should see:

```
Dashboard:
┌────────────────────────────┐
│ Total Inventory Value      │
│ KSh 1,295,000.00          │
└────────────────────────────┘

Product Table:
┌─────────────┬───────────────┐
│ Product     │ Price         │
├─────────────┼───────────────┤
│ Laptop      │ KSh 64,750.00 │
│ Mouse       │ KSh 1,295.00  │
└─────────────┴───────────────┘
```

### 💾 Data Storage

**Important**: 
- Currency preference stored in browser localStorage
- Product prices stored in USD in database
- Conversion happens live on frontend

### 🌐 Testing All Currencies

Quick test checklist:

- [ ] USD - Check $ symbol
- [ ] EUR - Check € symbol  
- [ ] KSH - Check KSh symbol ⭐
- [ ] GBP - Check £ symbol
- [ ] JPY - Check ¥ symbol (no decimals)
- [ ] INR - Check ₹ symbol
- [ ] NGN - Check ₦ symbol
- [ ] Others - Verify symbols and formatting

### 📊 Sample Test Data

Create these products to test conversion:

| Product | USD Price | KSH Price (129.5x) |
|---------|-----------|-------------------|
| Pen | $1.00 | KSh 129.50 |
| Book | $10.00 | KSh 1,295.00 |
| Laptop | $500.00 | KSh 64,750.00 |

### ✨ Expected User Experience

1. User logs in
2. Sees navbar with currency selector (defaults to USD)
3. Clicks selector, chooses KSH
4. **INSTANT**: All prices update to Kenyan Shillings
5. Navigates to different pages - all prices in KSh
6. Refreshes browser - still in KSh
7. Can switch to any other currency anytime

### 🎉 Success Criteria

Your multi-currency feature is working if:

✅ You can see and click the currency selector
✅ You can select KSH (or any other currency)
✅ All prices immediately update
✅ Formatting is correct for each currency
✅ Selection persists after refresh
✅ Works across all pages (dashboard, products, etc.)

---

## 🆘 Need Help?

If something doesn't work:

1. Check `CURRENCY_GUIDE.md` for detailed documentation
2. Check `IMPLEMENTATION_SUMMARY.md` for overview
3. Look at browser console for errors
4. Verify all files were created/modified correctly
5. Make sure both backend and frontend are running

## 📞 Quick Debug Commands

```bash
# Check if context file exists
ls shoprecord-frontend/src/context/CurrencyContext.context.jsx

# Check if selector component exists  
ls shoprecord-frontend/src/components/ui/CurrencySelector.ui.jsx

# Check constants
grep -n "CURRENCIES" shoprecord-frontend/src/utils/constants.utils.js

# Check User model
grep -n "preferredCurrency" shoprecord-backend/src/models/User.model.js
```

---

**Ready to test?** Start the app and select KSH from the navbar! 🚀🇰🇪
