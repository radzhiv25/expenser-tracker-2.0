# Appwrite Setup Guide for Expense Tracker

This guide will walk you through setting up Appwrite for your Expense Tracker application.

## 🚀 Step 1: Create Appwrite Account and Project

1. **Sign up for Appwrite Cloud**
   - Go to [https://cloud.appwrite.io](https://cloud.appwrite.io)
   - Click "Sign Up" and create your account
   - Verify your email address

2. **Create a New Project**
   - Once logged in, click "Create Project"
   - Enter project name: `expense-tracker-2.0`
   - Choose your preferred region
   - Click "Create"

3. **Get Your Project ID**
   - In your project dashboard, go to "Settings" → "General"
   - Copy your "Project ID" (you'll need this for the environment variables)

## 🗄️ Step 2: Set Up Database

1. **Create Database**
   - Go to "Databases" in your project dashboard
   - Click "Create Database"
   - Name: `expense_tracker_db`
   - Click "Create Database"
   - Copy the Database ID

2. **Create Collection for Expenses**
   - Click on your database
   - Click "Create Collection"
   - Collection ID: `expenses`
   - Name: `Expenses`
   - Click "Create Collection"

3. **Add Attributes to Collection**
   - Click on the "expenses" collection
   - Go to "Attributes" tab
   - Add the following attributes:

   | Attribute ID | Type | Size | Required | Default | Array |
   |--------------|------|------|----------|---------|-------|
   | title | String | 255 | Yes | - | No |
   | amount | Double | - | Yes | - | No |
   | currency | String | 10 | Yes | USD | No |
   | category | String | 100 | Yes | - | No |
   | description | String | 1000 | No | - | No |
   | date | String | 50 | Yes | - | No |
   | userId | String | 255 | Yes | - | No |

4. **Set Up Collection Permissions**
   - Go to "Settings" tab in the collection
   - Under "Read Access", add: `users`
   - Under "Create Access", add: `users`
   - Under "Update Access", add: `users`
   - Under "Delete Access", add: `users`

## 🔐 Step 3: Configure Authentication

1. **Enable Email/Password Authentication**
   - Go to "Auth" in your project dashboard
   - Click "Settings"
   - Enable "Email/Password" authentication
   - Click "Update"

2. **Configure Google OAuth**
   - Go to "Auth" → "Providers"
   - Click on "Google" provider
   - Enable the provider
   - You'll need to create a Google OAuth app:
     - Go to [Google Cloud Console](https://console.cloud.google.com/)
     - Create a new project or select existing one
     - Enable Google+ API
     - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
     - Set application type to "Web application"
     - Add authorized redirect URIs:
       - `https://sfo.cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/68b9bee9001f5ef30aab`
       - For development: `http://localhost:3000` (optional)
     - Copy the Client ID and Client Secret
   - Paste the Client ID and Client Secret in Appwrite
   - Click "Update"

3. **Configure GitHub OAuth**
   - Go to "Auth" → "Providers"
   - Click on "GitHub" provider
   - Enable the provider
   - You'll need to create a GitHub OAuth app:
     - Go to [GitHub Developer Settings](https://github.com/settings/developers)
     - Click "New OAuth App"
     - Set Application name: "Expense Tracker"
     - Set Homepage URL: `http://localhost:3000` (or your domain)
     - Set Authorization callback URL: `https://sfo.cloud.appwrite.io/v1/account/sessions/oauth2/callback/github/68b9bee9001f5ef30aab`
     - Click "Register application"
     - Copy the Client ID and generate a Client Secret
   - Paste the Client ID and Client Secret in Appwrite
   - Click "Update"

4. **Configure Auth Settings**
   - Go to "Auth" → "Settings"
   - Set "Session Length" to 30 days (or your preference)
   - Enable "Email Verification" if desired
   - Save settings

## 🔧 Step 4: Update Environment Variables

1. **Update `.env.local` file**
   ```bash
   # Appwrite Configuration
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-actual-project-id
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-actual-database-id
   NEXT_PUBLIC_APPWRITE_COLLECTION_ID=expenses
   ```

2. **Replace the placeholder values:**
   - `your-actual-project-id`: Your project ID from Step 1
   - `your-actual-database-id`: Your database ID from Step 2
   - The collection ID should be `expenses` as we created it

## 🚀 Step 5: Test the Application

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Test Authentication**
   - Go to [http://localhost:3000](http://localhost:3000)
   - Click "Login" or "Get Started"
   - Try creating a new account
   - Try logging in with existing credentials

3. **Test Expense Management**
   - After logging in, try adding expenses
   - Edit and delete expenses
   - Check if data persists after page refresh

## 🔍 Step 6: Verify Data in Appwrite

1. **Check Database**
   - Go to your Appwrite project dashboard
   - Navigate to "Databases" → "expense_tracker_db" → "expenses"
   - You should see your expense records

2. **Check Users**
   - Go to "Auth" → "Users"
   - You should see registered users

## 🛠️ Troubleshooting

### Common Issues:

1. **"Project not found" error**
   - Verify your `NEXT_PUBLIC_APPWRITE_PROJECT_ID` is correct
   - Make sure the project is active in Appwrite console

2. **"Database not found" error**
   - Verify your `NEXT_PUBLIC_APPWRITE_DATABASE_ID` is correct
   - Check if the database exists in your project

3. **"Collection not found" error**
   - Verify your `NEXT_PUBLIC_APPWRITE_COLLECTION_ID` is set to `expenses`
   - Check if the collection exists in your database

4. **Authentication errors**
   - Make sure email/password authentication is enabled
   - Check if the user account exists in Appwrite

5. **Permission denied errors**
   - Verify collection permissions are set correctly
   - Make sure users have read/write access

6. **OAuth errors**
   - Verify redirect URIs are correctly configured in Google/GitHub
   - Check that Client ID and Client Secret are correct
   - Ensure the OAuth provider is enabled in Appwrite
   - Make sure the redirect URI includes your actual project ID

### Debug Steps:

1. **Check browser console** for error messages
2. **Verify environment variables** are loaded correctly
3. **Check Appwrite console** for any error logs
4. **Test with a simple API call** to verify connection

## 📚 Additional Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite JavaScript SDK](https://appwrite.io/docs/getting-started-for-web)
- [Appwrite Authentication](https://appwrite.io/docs/client/account)
- [Appwrite Databases](https://appwrite.io/docs/client/databases)

## 🎉 You're All Set!

Once you've completed these steps, your Expense Tracker application will be fully integrated with Appwrite, providing:

- ✅ **Multiple Authentication Methods**
  - Email/Password registration and login
  - Google OAuth integration
  - GitHub OAuth integration
- ✅ **Secure Data Storage** with Appwrite database
- ✅ **Real-time Data Synchronization** across sessions
- ✅ **User-specific Data Isolation** (each user sees only their expenses)
- ✅ **Scalable Backend Infrastructure** with Appwrite cloud
- ✅ **Form Validation** with React Hook Form + Zod
- ✅ **Modern UI/UX** with shadcn/ui components

Your application is now ready for production deployment!

