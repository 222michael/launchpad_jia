# Jia Web Application

Jia is a web application built with Next.js that appears to provide interview assistance, opportunity management, and communication tools. This README provides comprehensive information about the project, how to set it up, run it, and deploy it.

## Tech Stack

- **Frontend**:

  - Next.js 15.x (with App Router)
  - React 19.x
  - SASS for styling
  - TypeScript

- **Backend**:

  - Next.js API Routes (serverless functions)
  - MongoDB for database
  - Firebase for authentication and storage

- **APIs & Services**:

  - OpenAI API integration
  - Socket.io for real-time communication

- **DevOps**:
  - Vercel for deployment
  - Git for version control

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB account (for database connection)
- Firebase account (for authentication)
- OpenAI API key

## Getting Started

### Quick Setup (Sprint Round)

**For the Sprint Round, use the provided Core API:**

1. Create `.env.local` file:

```bash
cp .env.example .env.local
```

2. Add the following configuration:

```env
# Core API (Provided for Sprint Round)
NEXT_PUBLIC_CORE_API_URL=https://jia-jvx-1a0eba0de6dd.herokuapp.com

# Required for build (placeholder values)
MONGODB_URI=mongodb://localhost:27017/jia-placeholder
OPENAI_API_KEY=sk-placeholder-key-using-core-api
```

**📖 For detailed setup instructions, see [SETUP.md](./SETUP.md)**

### Full Setup (Optional)

If you want to use your own services:

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Firebase
FIREBASE_SERVICE_ACCOUNT=your_firebase_service_account_json
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# App Configuration
NEXT_PUBLIC_CORE_API_URL=your_backend_api_url
```

### Installing Dependencies

Using npm:

```bash
npm install
```

Using yarn:

```bash
yarn install
```

### Running Locally

Development mode with hot reloading (using Turbopack):

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
# or
yarn build
```

### Starting Production Server

```bash
npm run start
# or
yarn start
```

### Additional Scripts

Clean project (removes node_modules, .next, bun.lock, next-env.d.ts):

```bash
npm run clean
# or
yarn clean
```

## Project Structure

```
jia-web-app/
├── .env                 # Environment variables
├── .env.example         # Example environment configuration
├── .gitignore           # Git ignore file
├── next-env.d.ts        # TypeScript declarations for Next.js
├── package.json         # Project dependencies and scripts
├── public/              # Static assets
├── src/                 # Source code
│   ├── app/             # Next.js App Router structure
│   │   ├── api/         # API routes
│   │   ├── dashboard/   # Dashboard page
│   │   ├── interview/   # Interview related pages
│   │   ├── login/       # Authentication pages
│   │   ├── my-interviews/ # User interviews management
│   │   ├── applicant/ # Applicant tracking
│   │   ├── talk/        # Communication features
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Home page
│   ├── contexts/        # React contexts
│   └── lib/             # Shared libraries and utilities
│       ├── components/  # Reusable UI components
│       ├── context/     # Context providers
│       ├── firebase/    # Firebase configuration
│       ├── mongoDB/     # MongoDB utilities
│       ├── styles/      # Global styles
│       ├── Modal/       # Modal components
│       ├── Loader/      # Loading UI components
│       ├── PageComponent/ # Page-specific components
│       └── VoiceAssistant/ # Voice interaction features
└── tsconfig.json        # TypeScript configuration
```

## Key Features

- App Router-based routing system
- Authentication with Firebase
- Data storage with MongoDB
- Real-time communication with Socket.io
- AI-powered features using OpenAI

## Deployment with Vercel

### Preparing for Deployment

1. Make sure your project is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

2. Ensure all environment variables are properly set in your local `.env` file.

### Deploying to Vercel

1. Create an account on [Vercel](https://vercel.com) if you don't have one.

2. From the Vercel dashboard, click "New Project".

3. Import your Git repository.

4. Configure project:

   - Set the framework preset to "Next.js"
   - Configure the environment variables (copy from your `.env` file)
   - Add any additional build settings if needed

5. Click "Deploy".

### Updating Environment Variables on Vercel

1. Go to your project on Vercel dashboard.
2. Navigate to "Settings" > "Environment Variables".
3. Add or update your environment variables as needed.
4. Redeploy your application for the changes to take effect.

### Setting up a Custom Domain

1. In your Vercel project, go to "Settings" > "Domains".
2. Add your custom domain and follow the verification steps.

## Contributing

Please follow the existing code style and organization when contributing to the project. Make use of TypeScript for type safety.

## Troubleshooting

- If you encounter issues with the MongoDB connection, verify your connection string and network access settings.
- For Firebase authentication problems, check your Firebase service account credentials.
- For development issues, try running `npm run clean` followed by `npm install` and `npm run dev`.
