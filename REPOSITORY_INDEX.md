# MemberPort Repository Index

## Overview
MemberPort is a comprehensive pension fund management system built with React, TypeScript, and Vite. It provides member self-service portal functionality and administrative tools for managing pension scheme operations.

## Project Structure

### Root Files
- **package.json** - Project dependencies and scripts (React 18.3.1, TypeScript, Vite, Tailwind CSS)
- **README.md** - Basic project documentation
- **index.html** - Main HTML entry point
- **vite.config.ts** - Vite build configuration
- **tsconfig.json** - TypeScript configuration
- **tailwind.config.js** - Tailwind CSS configuration
- **postcss.config.js** - PostCSS configuration
- **eslint.config.js** - ESLint configuration
- **.gitignore** - Git ignore rules

### Source Directory Structure (`src/`)

#### Main Application Files
- **main.tsx** - Application entry point with React root rendering
- **App.tsx** - Main application component with routing and authentication
- **index.css** - Global CSS styles
- **vite-env.d.ts** - Vite environment type definitions

#### Components (`src/components/`)

##### Common Components (`src/components/Common/`)
- **Button.tsx** - Reusable button component
- **Card.tsx** - Card container component
- **StatusBadge.tsx** - Status indicator component
- **Table.tsx** - Data table component

##### Layout Components (`src/components/Layout/`)
- **Layout.tsx** - Main application layout wrapper
- **Header.tsx** - Application header component
- **Sidebar.tsx** - Navigation sidebar for regular users

##### Admin Components (`src/components/Admin/`)
- **AdminLayout.tsx** - Admin section layout wrapper
- **AdminHeader.tsx** - Admin header component
- **AdminSidebar.tsx** - Admin navigation sidebar

#### Contexts (`src/contexts/`)
- **AuthContext.tsx** - Authentication state management
- **AdminContext.tsx** - Admin-specific state management

#### Pages (`src/pages/`)

##### User Pages
- **Login.tsx** - User authentication page
- **Dashboard.tsx** - Member dashboard
- **Profile.tsx** - Member profile management
- **Contributions.tsx** - Contribution history and management
- **Claims.tsx** - Claims submission and tracking
- **Beneficiaries.tsx** - Beneficiary management
- **Medical.tsx** - Medical claims and coverage
- **Voting.tsx** - Voting and elections interface

##### Admin Pages (`src/pages/Admin/`)
- **AdminDashboard.tsx** - Administrative dashboard
- **MemberManagement.tsx** - Member record management
- **ApprovalsManagement.tsx** - Approval workflow management
- **BulkOperations.tsx** - Bulk data operations
- **ClaimsManagement.tsx** - Claims administration
- **ContributionManagement.tsx** - Contribution processing

#### Type Definitions (`src/types/`)
- **index.ts** - Core type definitions
- **admin.ts** - Admin-specific type definitions

## Key Features and Functionality

### Authentication & Authorization
- Role-based access control (Member, Admin, Pension Officer, etc.)
- Protected routes with authentication guards
- Admin-specific route protection

### Member Features
- Personal dashboard with account summary
- Profile management and updates
- Contribution history and payments
- Claims submission and tracking
- Beneficiary management
- Medical claims and coverage tracking
- Voting participation in scheme elections

### Administrative Features
- Comprehensive member management
- Contribution processing and reconciliation
- Claims review and approval workflow
- Bulk operations for data management
- System integrations management
- Audit logging and compliance tracking

## Data Models

### Core Member Data
- **Member**: Complete member profile with personal, financial, and family information
- **Contribution**: Monthly contribution records with employer/employee splits
- **Claim**: Retirement and other claim submissions
- **Beneficiary**: Designated beneficiaries with allocation percentages
- **FamilyMember**: Family members eligible for medical coverage

### Administrative Data
- **AdminUser**: Administrative user profiles with role-based permissions
- **PendingApproval**: Workflow items requiring approval
- **BulkOperation**: Batch processing operations
- **AuditLog**: System activity tracking
- **SystemAlert**: Automated alerts and notifications

### Financial Data
- **ContributionPayment**: Payment processing records
- **ContributionSchedule**: Sponsor contribution schedules
- **HospitalAccount**: Medical provider account management
- **WithdrawalRecord**: Member withdrawal history

## Technology Stack

### Frontend
- **React 18.3.1** - UI framework
- **TypeScript** - Type safety
- **React Router DOM 7.6.3** - Client-side routing
- **Tailwind CSS 3.4.1** - Styling framework
- **Lucide React** - Icon library
- **Recharts 3.1.0** - Data visualization
- **date-fns 4.1.0** - Date manipulation

### Development Tools
- **Vite 5.4.2** - Build tool and dev server
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## File Organization Principles

### Component Architecture
- Atomic design principles with reusable components
- Separate admin and user interface components
- Consistent naming conventions

### State Management
- Context API for global state (Auth, Admin)
- Component-level state for local UI state
- Type-safe state management with TypeScript

### Routing Structure
- Protected routes for authenticated users
- Admin-specific route guards
- Clean URL structure with nested routes

### Type Safety
- Comprehensive TypeScript interfaces
- Separate type definitions for different domains
- Strict type checking configuration

## Development Workflow

### Getting Started
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`
4. Preview production build: `npm run preview`
5. Run linting: `npm run lint`

### Code Quality
- ESLint configuration for consistent code style
- TypeScript strict mode for type safety
- Tailwind CSS for consistent styling
- Component-based architecture for maintainability

## Future Enhancements
Based on placeholder components, planned features include:
- Advanced reporting module
- Push notifications system
- Enhanced settings management
- Additional integration capabilities
- Mobile responsive optimizations

---

*This index was generated on 2025-07-13 and reflects the current state of the repository structure.*
