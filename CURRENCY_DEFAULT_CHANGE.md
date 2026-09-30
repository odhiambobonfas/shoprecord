# Currency Default Changed to KSH

## What Changed?

The default currency has been changed from **USD to KSH (Kenyan Shilling)**.

### Changes Made:

1. **Default Currency**: Now `KSH` instead of `USD`
2. **Currency Order**: KSH appears first in the currency selector dropdown
3. **User Model**: Default currency preference is now `KSH`
4. **All displays**: Will show in KSh by default for new users

### For Existing Users:

If you previously selected a currency (like EUR or USD), it's saved in your browser's localStorage. To switch to the new default:

**Option 1: Clear your selection**
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Find `preferred_currency` and delete it
4. Refresh the page - you'll see KSH as default

**Option 2: Just select KSH**
1. Click the currency selector in the navbar
2. Select "KSh KSH - Kenyan Shilling"
3. Done! Your preference is saved

### Examples:

All prices now display in Kenyan Shillings by default:

| Item | Old (USD) | New (KSH) |
|------|-----------|-----------|
| Product | $100.00 | KSh 12,950.00 |
| Total Value | $10,000.00 | KSh 1,295,000.00 |
| Average Price | $50.00 | KSh 6,475.00 |

### Conversion Rate:

- **1 USD = 129.50 KSH**
- All database values remain in USD
- Conversion happens automatically on the frontend

---

**Note**: This change only affects the default display currency. Users can still select any of the 12 supported currencies from the dropdown.
