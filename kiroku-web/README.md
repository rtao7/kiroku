# Kiroku Web Application

A Next.js web application for saving and managing links with cross-device synchronization. Integrates with the Kiroku Chrome extension.

## Features

- Google OAuth authentication
- MongoDB database for link storage
- RESTful API for Chrome extension integration
- Search and filter saved links
- Mark links as favorites
- Automatic metadata extraction (title, description from URLs)
- API key generation for extension sync
- Responsive UI with Tailwind CSS and Radix UI
- Dark mode support

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: MongoDB with Mongoose
- **UI**: Tailwind CSS, Radix UI components
- **Language**: TypeScript

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud, e.g., MongoDB Atlas)
- Google OAuth credentials (for authentication)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kiroku?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here-generate-with-openssl-rand-base64-32

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Application
NODE_ENV=development
```

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy the Client ID and Client Secret to your `.env.local`

### 4. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output to `NEXTAUTH_SECRET` in your `.env.local`

### 5. Set Up MongoDB

**Option A: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address
5. Get your connection string and add it to `.env.local`

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Use connection string: `mongodb://localhost:27017/kiroku`

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Authentication
- `GET /api/auth/signin` - Sign in page
- `GET /api/auth/signout` - Sign out

### Links
- `GET /api/links` - Get all links (authenticated)
- `POST /api/links` - Create a new link (authenticated)
- `PATCH /api/links/[id]` - Update a link (authenticated)
- `DELETE /api/links/[id]` - Delete a link (authenticated)

### Sync (for Chrome Extension)
- `GET /api/sync` - Get all links (requires API key)
- `POST /api/sync` - Sync links from extension (requires API key)

### User
- `GET /api/user/apikey` - Get user's API key (authenticated)
- `POST /api/user/apikey` - Generate new API key (authenticated)

## Using with Chrome Extension

1. Sign in to the web app
2. Go to Settings page
3. Generate an API key
4. Copy the API key
5. In the Chrome extension, click settings (⚙️)
6. Paste the API key and save
7. Click "Sync Now" to synchronize

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── settings/          # Settings page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Radix UI components
│   ├── LinksContainer.tsx
│   └── SettingsContainer.tsx
├── lib/                   # Utilities
│   ├── auth.ts           # NextAuth configuration
│   └── mongodb.ts        # MongoDB connection
└── models/               # Mongoose models
    ├── Link.ts
    └── User.ts
```

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Ensure you set all environment variables from `.env.example` in your hosting platform's configuration.

## License

MIT
