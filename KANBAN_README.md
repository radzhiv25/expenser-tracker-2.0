# Kanban Board Setup Guide for Expense Tracker

This comprehensive guide will walk you through setting up the Kanban board feature for your Expense Tracker application, including database configuration, authentication setup, and testing procedures.

## 🎯 Overview

The Kanban board feature transforms your expense management workflow into a visual, drag-and-drop experience. Expenses can be linked to Kanban cards, and their status automatically updates based on which column they're moved to, providing a seamless workflow management system.

## 🏗️ Architecture Overview

### Database Collections

The Kanban system uses four specialized Appwrite collections:

| Collection | Purpose | Key Attributes |
|------------|---------|----------------|
| **kanban_boards** | Board management | `name`, `userId` |
| **kanban_columns** | Column organization | `boardId`, `name`, `order`, `userId` |
| **kanban_cards** | Card storage | `boardId`, `columnId`, `title`, `description`, `labels`, `order`, `dueDate`, `expenseId`, `userId` |
| **expenses** | Enhanced expense data | `status`, `kanbanCardId` (new attributes) |

### Workflow Columns

The system creates four default workflow columns:

1. **📝 To Log** - New expenses requiring initial logging
2. **🔍 Verify** - Expenses pending verification and review
3. **✅ Paid** - Expenses that have been processed and paid
4. **💰 Reimburse** - Expenses eligible for reimbursement

### Status Synchronization

Expense status automatically updates when cards are moved between columns:

| Column | Status | Description |
|--------|--------|-------------|
| To Log | `logged` | Expense has been initially recorded |
| Verify | `pending` | Expense is under review |
| Paid | `cleared` | Expense has been processed |
| Reimburse | `reimbursable` | Expense is ready for reimbursement |

## 🚀 Step 1: Prerequisites

Before setting up the Kanban board feature, ensure you have:

- ✅ **Appwrite project** already configured (follow [APPWRITE_SETUP.md](./APPWRITE_SETUP.md))
- ✅ **Environment variables** set up in `.env.local`
- ✅ **Authentication** working in your application
- ✅ **Node.js and pnpm** installed on your system

## 🗄️ Step 2: Database Configuration

### 2.1: Run Database Seeding

Execute the automated seeding script to create all required collections and indexes:

```bash
pnpm seed:appwrite
```

**Expected Output:**
```
Starting Appwrite seeding...
✅ Created database main
✅ Created collection kanban_boards
✅ Added attribute name to kanban_boards
✅ Added attribute userId to kanban_boards
✅ Added index userId to kanban_boards
✅ Created collection kanban_columns
✅ Added attribute boardId to kanban_columns
✅ Added attribute name to kanban_columns
✅ Added attribute order to kanban_columns
✅ Added attribute userId to kanban_columns
✅ Added index boardId to kanban_columns
✅ Created collection kanban_cards
✅ Added attribute boardId to kanban_cards
✅ Added attribute columnId to kanban_cards
✅ Added attribute title to kanban_cards
✅ Added attribute description to kanban_cards
✅ Added attribute labels to kanban_cards
✅ Added attribute order to kanban_cards
✅ Added attribute dueDate to kanban_cards
✅ Added attribute expenseId to kanban_cards
✅ Added attribute userId to kanban_cards
✅ Added index boardId to kanban_cards
✅ Enhanced collection expenses
✅ Added attribute status to expenses
✅ Added attribute kanbanCardId to expenses
✅ Added index userId to expenses
🎉 Appwrite seeding completed successfully!
```

### 2.2: Verify Collections

1. **Open your Appwrite console**
2. **Navigate to** "Databases" → "main"
3. **Verify you see 4 collections:**
   - `kanban_boards` - Board management
   - `kanban_columns` - Column organization
   - `kanban_cards` - Card storage
   - `expenses` - Enhanced with Kanban integration

## 🔐 Step 3: Configure Permissions

### 3.1: Update Collection Permissions

For each collection, configure user-based permissions:

1. **Go to** "Databases" → "Collections" in your Appwrite console
2. **Click on each collection** one by one
3. **Navigate to** the "Settings" tab
4. **Update permissions** as follows:

| Collection | Read Access | Write Access | Delete Access |
|------------|-------------|--------------|---------------|
| `kanban_boards` | `users` | `users` | `users` |
| `kanban_columns` | `users` | `users` | `users` |
| `kanban_cards` | `users` | `users` | `users` |
| `expenses` | `users` | `users` | `users` |

### 3.2: Verify Security

1. **Test without authentication** - try accessing `/boards` without logging in
2. **Should redirect** to login page
3. **After login** - should access all Kanban features

## 🔧 Step 4: Environment Variables

### 4.1: Update `.env.local`

Ensure your `.env.local` file includes all required variables:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DB_ID=main

# Appwrite API Key (for server-side operations)
APPWRITE_API_KEY=your-api-key
```

### 4.2: Create API Key (if not exists)

1. **Go to** "Settings" → "API Keys" in your Appwrite console
2. **Click** "Create API Key"
3. **Name**: `Expense Tracker Kanban API Key`
4. **Select scopes:**
   - ✅ Collections
   - ✅ Databases
   - ✅ Documents
   - ✅ Users
5. **Copy the API key** immediately (you won't see it again!)
6. **Add to** your `.env.local` file

## 🚀 Step 5: Test the Kanban System

### 5.1: Start Development Server

```bash
pnpm dev
```

### 5.2: Test Core Kanban Features

1. **Navigate to** [http://localhost:3000](http://localhost:3000)
2. **Sign up/Login** with your credentials
3. **Access Dashboard** - verify main dashboard loads
4. **Navigate to Boards** - click "Boards" in the sidebar
5. **Create a board** - test board creation functionality
6. **Add cards** - test card creation and drag & drop
7. **Move cards** - test drag & drop between columns
8. **Link expenses** - test expense-to-card linking

### 5.3: Test Expense Integration

1. **Go to Expenses** - click "Expenses" in the sidebar
2. **Create an expense** - add a new expense
3. **Create Kanban card** - link expense to a card
4. **Move card** - test status synchronization
5. **Verify status** - check expense status updates

## 🛠️ Step 6: Troubleshooting

### Common Issues and Solutions

| Issue | Solution | Verification |
|-------|----------|--------------|
| **"Project not found"** | Verify `NEXT_PUBLIC_APPWRITE_PROJECT_ID` in `.env.local` | Check project exists in Appwrite console |
| **"API key invalid"** | Verify `APPWRITE_API_KEY` has correct scopes | Regenerate API key with all required scopes |
| **"Collection not found"** | Run `pnpm seed:appwrite` again | Check collections exist in database |
| **"Permission denied"** | Update collection permissions to `users` | Verify permissions in collection settings |
| **"Authentication failed"** | Check auth settings in Appwrite console | Ensure email/password auth is enabled |
| **"Drag & drop not working"** | Check browser console for errors | Verify @dnd-kit dependencies are installed |
| **"Real-time updates not working"** | Check Appwrite connection | Verify subscription is active |

### Debug Steps

1. **Check browser console** for error messages
2. **Verify environment variables** are loaded correctly
3. **Test API connection** with simple Appwrite calls
4. **Check network tab** for failed requests
5. **Verify user authentication** status

## 📚 Additional Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Real-time](https://appwrite.io/docs/realtime)
- [@dnd-kit Documentation](https://dndkit.com/)
- [ShadCN UI Components](https://ui.shadcn.com/)

## 🎉 You're All Set!

Once you've completed these steps, your Kanban board system will be fully functional with:

- ✅ **Visual Workflow Management** with drag & drop
- ✅ **Real-time Updates** across all connected clients
- ✅ **Expense Integration** with automatic status synchronization
- ✅ **Responsive Design** for desktop and mobile
- ✅ **Secure Data Storage** with user-based permissions
- ✅ **Modern UI/UX** with ShadCN components

Your Expense Tracker now has a powerful Kanban board system ready for production use!

## 🎯 Key Features

### Visual Workflow Management
- **Drag & Drop Interface** - Move cards between columns seamlessly
- **Real-time Updates** - Changes sync across all connected clients
- **Responsive Design** - Works perfectly on desktop and mobile
- **Intuitive UI** - Clean, modern interface with ShadCN components

### Expense Integration
- **Automatic Status Sync** - Expense status updates when cards move
- **Card Linking** - Connect expenses to Kanban cards
- **Workflow Tracking** - Visual progress through expense processing
- **Bulk Operations** - Create multiple cards from expense lists

### Advanced Functionality
- **User-based Security** - Each user sees only their own data
- **Optimistic Updates** - Instant UI feedback with background sync
- **Error Handling** - Graceful error recovery and user notifications
- **Mobile Support** - Touch-friendly drag & drop on mobile devices

## 📁 File Structure

```
src/
├── app/(dashboard)/
│   ├── layout.tsx              # Sidebar layout with breadcrumbs
│   ├── boards/page.tsx         # Kanban boards page
│   └── expenses/page.tsx       # Expenses with Kanban integration
├── components/
│   ├── kanban-board.tsx        # Main Kanban board component
│   ├── ui/breadcrumb.tsx       # Breadcrumb navigation
│   └── ui/sidebar.tsx          # ShadCN sidebar components
├── lib/
│   ├── kanban-types.ts         # TypeScript type definitions
│   ├── kanban-service.ts       # Kanban CRUD operations
│   └── appwrite.ts             # Appwrite configuration
└── hooks/
    ├── use-breadcrumbs.ts      # Breadcrumb generation
    └── use-mobile.ts           # Mobile detection
```

## 🔮 Future Enhancements

- **Real-time Collaboration** - Multiple users on the same board
- **Card Templates** - Predefined templates for common expenses
- **Advanced Filtering** - Filter by labels, dates, and assignees
- **Board Sharing** - Share boards with team members
- **Export/Import** - Export boards to CSV or JSON
- **Mobile App** - Native mobile application with offline support
