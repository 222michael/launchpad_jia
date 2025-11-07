# 🚀 JIA Application - Development Environment Setup Guide

**Sprint Round - Ticket #1 Documentation**  
**Last Updated:** November 7, 2025  
**Status:** ✅ Complete and Verified

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Environment Configuration](#environment-configuration)
4. [Build Verification](#build-verification)
5. [Troubleshooting](#troubleshooting)
6. [Architecture Overview](#architecture-overview)
7. [Next Steps](#next-steps)

---

## ✅ Prerequisites

Before setting up the development environment, ensure you have:

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v10.0.0 or higher
- **Git**: Latest version
- **Code Editor**: VS Code recommended
- **Operating System**: Windows, macOS, or Linux

### Check Your Versions

```bash
node --version  # Should be v18+
npm --version   # Should be v10+
git --version   # Any recent version
```

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/whitecloakph/launchpad-jia.git
cd launchpad-jia
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

**Note:** The `--legacy-peer-deps` flag is required due to React 19 compatibility with some dependencies.

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
cp .env.example .env.local
```

Add the following configuration:

```env
# Core API Configuration (Required)
NEXT_PUBLIC_CORE_API_URL=https://jia-jvx-1a0eba0de6dd.herokuapp.com

# MongoDB (Required for build)
MONGODB_URI=mongodb://localhost:27017/jia-placeholder

# OpenAI (Required for build)
OPENAI_API_KEY=sk-placeholder-key-using-core-api
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at:
- **Local:** http://localhost:3000
- **Network:** http://[your-ip]:3000

### 5. Verify Build

```bash
npm run build
```

✅ **Expected Output:** Build completes successfully with no errors

---

## 🔧 Environment Configuration

### Core API URL

The **Core API** is a shared backend server that handles:
- ✅ MongoDB database operations
- ✅ Firebase authentication
- ✅ OpenAI AI features
- ✅ All API endpoints

**Why use the Core API?**
- No need to set up your own MongoDB cluster
- No need to configure Firebase project
- No need to pay for OpenAI API
- Focus on building features, not infrastructure

### Environment Variables Explained

| Variable | Purpose | Required | Notes |
|----------|---------|----------|-------|
| `NEXT_PUBLIC_CORE_API_URL` | Backend API server | ✅ Yes | Provided by Sprint Round |
| `MONGODB_URI` | Database connection | ✅ Yes (build only) | Placeholder value works |
| `OPENAI_API_KEY` | AI features | ✅ Yes (build only) | Placeholder value works |
| `NEXT_PUBLIC_FIREBASE_*` | Authentication | ❌ No | Handled by Core API |

### Optional: Full Local Setup

If you want to run with your own services (not required for Sprint Round):

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com
   - Create new project
   - Enable Authentication (Google/Microsoft)
   - Get config credentials

2. **Create MongoDB Cluster**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string

3. **Create OpenAI Account**
   - Go to https://platform.openai.com
   - Create API key
   - Add payment method

Then update `.env.local` with your credentials.

---

## ✅ Build Verification

### Development Build

```bash
npm run dev
```

**Expected Output:**
```
▲ Next.js 15.3.2
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000
- Environments: .env.local

✓ Starting...
✓ Ready in 8.4s
```

### Production Build

```bash
npm run build
```

**Expected Output:**
```
▲ Next.js 15.3.2
- Environments: .env.local

Creating an optimized production build ...
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (143/143)
✓ Finalizing page optimization

Build completed successfully!
```

### Start Production Server

```bash
npm run start
```

---

## 🔍 Troubleshooting

### Issue: Dependency Installation Fails

**Error:**
```
npm error ERESOLVE unable to resolve dependency tree
```

**Solution:**
```bash
npm install --legacy-peer-deps
```

---

### Issue: Build Fails with "Cannot find module"

**Error:**
```
Error: Cannot find module './8548.js'
```

**Solution:**
```bash
# Clean the build cache
rm -rf .next
npm run build
```

---

### Issue: "MONGODB_URI environment variable is missing"

**Error:**
```
Error: Please define the MONGODB_URI environment variable
```

**Solution:**
Add to `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/jia-placeholder
```

---

### Issue: "OPENAI_API_KEY environment variable is missing"

**Error:**
```
Error: The OPENAI_API_KEY environment variable is missing
```

**Solution:**
Add to `.env.local`:
```env
OPENAI_API_KEY=sk-placeholder-key-using-core-api
```

---

### Issue: Port 3000 Already in Use

**Error:**
```
Error: Port 3000 is already in use
```

**Solution:**
```bash
# Option 1: Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Option 2: Use a different port
PORT=3001 npm run dev
```

---

### Issue: Environment Variables Not Loading

**Symptoms:**
- Changes to `.env.local` not reflected
- API calls failing

**Solution:**
```bash
# Restart the development server
# Press Ctrl+C to stop
npm run dev
```

**Note:** Next.js only loads environment variables on server start.

---

## 🏗️ Architecture Overview

### Project Structure

```
launchpad-jia/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   ├── recruiter-dashboard/# Recruiter portal
│   │   ├── applicant/          # Applicant portal
│   │   ├── interview/          # Interview pages
│   │   └── ...
│   └── lib/                    # Shared libraries
│       ├── components/         # Reusable components
│       ├── firebase/           # Firebase config
│       ├── mongoDB/            # Database utilities
│       └── ...
├── public/                     # Static assets
├── .env.local                  # Environment variables (create this)
├── .env.example                # Environment template
├── package.json                # Dependencies
└── README.md                   # Project documentation
```

### Technology Stack

- **Frontend:** Next.js 15.3.2, React 19.1.0
- **Styling:** SASS modules
- **Authentication:** Firebase Auth
- **Database:** MongoDB
- **AI:** OpenAI GPT
- **Real-time:** Socket.io
- **Deployment:** Vercel (recommended)

### API Architecture

```
Frontend (Next.js)
    ↓
Core API (https://jia-jvx-1a0eba0de6dd.herokuapp.com)
    ↓
├── MongoDB (Database)
├── Firebase (Authentication)
└── OpenAI (AI Features)
```

---

## 🎯 Next Steps

Now that your development environment is set up, you can proceed with:

### ✅ Ticket #1: Complete
- [x] Repository forked
- [x] Dependencies installed
- [x] Environment configured
- [x] Build verified
- [x] Documentation created

### 🚀 Ready for Development

**Ticket #2:** Enhance Add Career Flow (Segmented Form)
- Update career form to multi-step format
- Implement progress saving
- Match Figma designs

**Ticket #3:** Secure Add Career Endpoint (XSS Protection)
- Add input validation
- Sanitize user inputs
- Prevent XSS attacks

**Ticket #4:** Add Pre-screening Questions
- Create question management UI
- Implement applicant question flow
- Store answers in database

---

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com)

### Sprint Round Resources
- **Repository:** https://github.com/whitecloakph/launchpad-jia
- **Core API:** https://jia-jvx-1a0eba0de6dd.herokuapp.com
- **Support Email:** launchpad@whitecloak.com

---

## ✨ Tips for Success

1. **Commit Often:** Make incremental commits with clear messages
2. **Test Thoroughly:** Test all features before submitting
3. **Match Designs:** Follow Figma designs pixel-perfect
4. **Document Changes:** Update README with new features
5. **Ask Questions:** Reach out if you need clarification

---

**Good luck with your Sprint Round! 🚀**

---

*Last updated: November 7, 2025*  
*Sprint Round - White Cloak Launchpad Program*
