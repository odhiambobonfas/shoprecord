## ShopRecord Frontend

A simple inventory management system for shopkeepers to track their shop items.

## Features

- User authentication (Login/Register)
- Dashboard with inventory statistics
- Product CRUD operations (Create, Read, Update, Delete)
- Search and filter products
- **Multi-Currency Support** 💱
  - **Default Currency: KSH (Kenyan Shilling)** 🇰🇪
  - Support for 12+ major currencies (KSH, USD, EUR, GBP, JPY, CNY, INR, AUD, CAD, CHF, ZAR, NGN)
  - Real-time currency conversion
  - Persistent currency preference
  - Locale-specific formatting
- Responsive design

## Tech Stack

- Next.js 14
- React 18
- Context API for state management
- Multi-currency support with Intl API

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file with:
```
API_URL=http://localhost:8000/api
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/src/app` - Next.js app router pages
- `/src/components` - Reusable React components
- `/src/services` - API service layers
- `/src/context` - React context providers
- `/src/hooks` - Custom React hooks
- `/src/utils` - Utility functions and constants
