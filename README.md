# 🏦 Nexus Banking App

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A modern banking application built with Next.js, featuring authentication, money transfers, and transaction tracking.

✨ **Features**

- 🔐 **Secure Authentication** with NextAuth.js
- 💸 **Money Transfer** functionality
- 📊 **Transaction History** tracking
- 💳 **Account Balance** management
- 🎨 **Beautiful UI** with Tailwind CSS
- 🚀 **Blazing Fast** performance
- 🔒 **End-to-End Encryption**
- 📱 **Mobile-Friendly** design

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL database

### ⚙️ Installation

1. Clone the repository
```bash
git clone https://github.com/your-repo/nexus-banking.git
cd nexus-banking
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp example.env .env
# Edit .env with your actual values
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
```

### 🔑 Environment Variables

See `example.env` for required environment variables.

### ▶️ Running the Project

- Development: `npm run dev`
- Production build: `npm run build`
- Start production server: `npm run start`

## 🛠️ Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma ORM
- NextAuth.js
- React Hook Form
- Zod validation

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)
