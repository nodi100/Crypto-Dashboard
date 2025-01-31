Crypto Dashboard
A real-time cryptocurrency dashboard built with Next.js 13+ (App Router), TypeScript, Tailwind CSS, and Zustand. Monitor cryptocurrency prices, perform conversions, and visualize price trends with interactive charts.

Features:
Real-Time Price Monitoring
Currency Conversion
Price Visualization

Tech Stack:

Framework: Next.js 13+ (App Router)
Language: TypeScript
Styling: Tailwind CSS
State Management: Zustand
Charts: Recharts
API: CoinCap API
Real-time Updates: WebSocket

Getting Started
Prerequisites

Node.js 16.8 or later
pnpm or yarn

Installation

Clone the repository:

git clone https://github.com/yourusername/crypto-dashboard.git

cd crypto-dashboard

Install dependencies:
pnpm install

Create a .env.local file in the root directory:

Copy NEXT_PUBLIC_API_BASE=https://api.coincap.io/v2

Start the development server:
pnpm dev
Open http://localhost:3000 in your browser.

API Integration:
The project uses the CoinCap API for cryptocurrency data:
REST API for historical data and conversions
WebSocket for real-time price updates

Performance Optimizations:
WebSocket connection for real-time updates
API polling only on the homepage
React.memo for optimized re-renders
Proper cleanup of WebSocket and intervals
Lazy loading of components with Suspense

State Management
Zustand is used for state management with the following stores:
Cryptocurrency data
Price History
Loading and error states
