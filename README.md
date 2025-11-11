# Firebase CRUD Task App

## Description
A protected CRUD app with Firebase Auth & Firestore. This is a Task Management App where users can register, log in, and manage their tasks with full Create, Read, Update, and Delete functionality.

## Technologies Used
- Next.js
- TypeScript
- Firebase Authentication
- Firebase Firestore
- Tailwind CSS

## Features
- Firebase Authentication (Email/Password)
- Protected Routes (Only logged-in users can access)
- CRUD Operations (Create, Read, Update, Delete tasks)
- Personalized Dashboard Greeting (Shows user email)
- Real-time Task Updates (Using Firestore onSnapshot)
- Task Priority System (Low, Medium, High)
- Task Completion Status (Checkbox toggle)
- User-specific Task Filtering (Users can only see their own tasks)

## Setup Instructions

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd crud-to-do-appp
   ```

2. Install dependencies
   ```bash
   npm install
   ```


     ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment Link


## Screenshots

## Testing Credentials
For evaluation purposes, you can use the following demo account:

- **Email:** testuser@gmail.com
- **Password:** test1234

**Note:** Ensure this account exists in Firebase Authentication with at least one or two tasks in Firestore for demonstration.

## Project Structure
```
crud-to-do-appp/
├── src/
│   ├── app/
│   │   ├── (authentication)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── components/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── lib/
│   │   │   └── firebase.ts
│   │   ├── types/
│   │   │   └── task.ts
│   │   └── page.tsx
│   └── ...
└── package.json
```



## CRUD Operations
- **Create:** Add new tasks with title, description, and priority
- **Read:** View all tasks in real-time (filtered by user email)
- **Update:** Edit task details or toggle completion status
- **Delete:** Remove tasks from Firestore

