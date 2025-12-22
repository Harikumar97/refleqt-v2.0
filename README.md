# Refleqt v2.0

**AI-Powered Business Intelligence for SaaS Founders**

> _"Stop Drowning in Data. Start Obsessing Smart."_

## 🚀 Overview

Refleqt is a safety-critical web application built with Next.js 14, TypeScript, and NASA's Power of Ten coding principles. This platform provides AI-powered business intelligence tools for SaaS founders and growth teams.

## ✨ Features

### Core Intelligence Tools

1. **📊 Intelligence Feed** - Real-time competitive intelligence monitoring
2. **🔬 Research Swarms** - AI-powered multi-agent research
3. **🎯 Strategy Cohorts** - Competitive analysis and insights
4. **🧠 Psychographics** - Customer psychology and funnel analysis
5. **🍺 The Brewery** - AI content generation engine
6. **✍️ Expert Writers** - Premium content with industry experts

## 🛡️ Safety-Critical Development

This project follows **NASA's Power of Ten Rules** for safety-critical code:

- ✅ No recursion - All algorithms are iterative
- ✅ Fixed loop bounds - All loops have explicit upper limits
- ✅ No dynamic memory allocation - Pre-allocated buffers
- ✅ Functions ≤ 60 lines - Enforced by ESLint
- ✅ Minimum 2 assertions per function - Runtime validation
- ✅ Smallest scope - Proper variable scoping
- ✅ Check all return values - SafeResult<T> pattern
- ✅ Limited metaprogramming - Simple, explicit types
- ✅ Limit indirection - Max depth 3, complexity 10
- ✅ Zero warnings - Strict TypeScript + ESLint

See [POWER_OF_TEN.md](./POWER_OF_TEN.md) for detailed implementation.

## 🏗️ Tech Stack

**100% Free & Open Source Tools**

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.x (Strict Mode)
- **Styling:** Tailwind CSS
- **Validation:** Zod
- **Charts:** Chart.js
- **Linting:** ESLint + Prettier
- **Git Hooks:** Husky + lint-staged
- **IDE:** Visual Studio Code

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm
- Visual Studio Code (recommended)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint (zero warnings required)
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript compiler checks
npm run safety-check # Run all safety checks
```

## 📁 Project Structure

```
src/
├── app/            # Next.js pages
├── components/     # React components
├── utils/          # Safety utilities (assert.ts, safety.ts)
├── types/          # TypeScript types
└── constants/      # Application constants
```

## 🎯 Safety Features

- **Assertion Utilities** (`src/utils/assert.ts`)
- **Safe Iteration** (`src/utils/safety.ts`)
- **Fixed Buffers** (`FixedBuffer<T>` class)
- **Type Safety** (Strict TypeScript)
- **Zero Warnings** (Pre-commit enforcement)

See [POWER_OF_TEN.md](./POWER_OF_TEN.md) for details.

## 📄 License

ISC
