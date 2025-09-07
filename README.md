# Expense Tracker 2.0

A modern, responsive expense tracking application built with Next.js 14, TypeScript, and shadcn/ui components. Track your expenses, analyze spending patterns, and manage your finances efficiently.

## 🚀 Features

- **Modern UI/UX**: Built with shadcn/ui components and Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Authentication**: Secure login system with form validation
- **Expense Management**: Add, edit, and delete expenses with categories
- **Analytics Dashboard**: View spending summaries and category breakdowns
- **Data Persistence**: Local storage for data persistence
- **Form Validation**: React Hook Form with Zod validation
- **Animations**: Smooth animations with Framer Motion
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd expenser-tracker-2.0
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage

### Landing Page
- Visit the homepage to see the landing page with features and call-to-action
- Click "Login" or "Get Started" to access the application

### Authentication
- Use any valid email and password (minimum 6 characters)
- The app accepts any credentials for demo purposes
- After login, you'll be redirected to the dashboard

### Dashboard
- **Add Expenses**: Click "Add Expense" to create new expense entries
- **View Expenses**: See all your expenses in a sortable table
- **Edit/Delete**: Use the action buttons to modify or remove expenses
- **Analytics**: View spending summaries and category breakdowns
- **Logout**: Click the logout button to return to the landing page

### Expense Categories
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Travel
- Education
- Other

## 🎨 Components

### Landing Page Components
- **Navbar**: Responsive navigation with mobile menu
- **Hero Section**: Eye-catching call-to-action with animations
- **Features Section**: Highlighted app features with icons
- **Footer**: Links and company information

### Dashboard Components
- **Summary Cards**: Total expenses, monthly spending, transaction count
- **Expense Form**: Modal dialog for adding/editing expenses
- **Expense Table**: Sortable table with all expense data
- **Category Breakdown**: Visual spending analysis by category

### Authentication
- **Login Form**: Secure login with validation
- **Form Validation**: Real-time validation with error messages
- **Password Toggle**: Show/hide password functionality

## 🔧 Development

### Project Structure
```
src/
├── app/
│   ├── dashboard/          # Dashboard page
│   ├── login/              # Login page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── login-form.tsx      # Login form component
└── lib/
    └── utils.ts            # Utility functions
```

### Key Features Implementation

1. **Authentication Flow**:
   - Login form with validation
   - Local storage for session management
   - Protected routes with redirect logic

2. **Expense Management**:
   - CRUD operations for expenses
   - Category-based organization
   - Date-based filtering and sorting

3. **Data Persistence**:
   - Local storage for expense data
   - Session management
   - Data persistence across browser sessions

4. **Responsive Design**:
   - Mobile-first approach
   - Responsive grid layouts
   - Touch-friendly interactions

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide React](https://lucide.dev/) for the icon library

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.

---

**Happy Expense Tracking! 💰**