# Property Portal Frontend

Next.js 15+ frontend for the Property Portal application.

## Features

- **Valuation Tool**: Form to submit property details and get price estimates
- **Market Dashboard**: Charts, filters, and data table showing market statistics
- **Responsive UI**: Built with Tailwind CSS
- **Client-side validation**: Form validation before submission
- **Loading/error states**: Proper handling of API call states

## Quick Start

```bash
npm install
npm run dev
```

The app will be available at http://localhost:3000

## Environment Variables

- `NEXT_PUBLIC_BACKEND_URL`: Backend API URL (default: `http://localhost:8100`)

## Docker

```bash
docker build -t property-portal-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_BACKEND_URL=http://backend:8100 property-portal-frontend
```

## Pages

- `/valuation` - Property valuation tool
- `/dashboard` - Market dashboard with charts and statistics
