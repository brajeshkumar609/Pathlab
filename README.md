# Pathlab - Multi-Tenant Pathology Laboratory Management System

A production-ready, enterprise-grade SaaS platform for managing pathology laboratories with multi-tenant architecture, comprehensive patient management, test catalog management, report generation, and billing.

## 🎯 Project Status: Phase 1 - Project Initialization ✓

### Vision
Build a complete, scalable pathology lab management system that handles:
- Multi-tenant organization isolation
- Patient registration and management
- Dynamic test catalog with 100+ tests
- Smart report entry with auto-flagging
- PDF report generation (A4 optimized)
- Billing and invoicing
- Inventory management
- Audit trails for compliance
- Role-based access control (RBAC)

---

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS, Framer Motion, Lucide React
- **Backend/BaaS:** Firebase (Authentication, Firestore, Storage)
- **Form & Validation:** React Hook Form, Zod
- **State Management:** Zustand
- **Analytics & Reporting:** Chart.js, @react-pdf/renderer
- **Deployment:** Vercel (Free tier)

### Folder Structure
```
pathlab/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable React components
│   ├── features/            # Feature-specific logic (Auth, Patients, Tests, etc.)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   ├── store/               # Zustand state management
│   ├── config/              # Configuration files (Firebase, etc.)
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── public/                  # Static assets
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind CSS config
├── next.config.js           # Next.js config
├── .eslintrc.json           # ESLint config
├── .prettierrc.json         # Prettier config
└── .env.example             # Environment variables template
```

### Database Schema (Firestore Collections)

All collections include: `organizationId`, `createdAt`, `updatedAt`, `createdBy`

- **organizations** - Lab organizations
- **users** - Users with role-based access
- **patients** - Patient records with demographics
- **tests** - Master test catalog
- **reports** - Test results and reports
- **invoices** - Billing and payment tracking
- **inventory** - Lab reagents and stock
- **settings** - Organization-specific settings
- **auditLogs** - Compliance audit trails

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Firebase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/brajeshkumar609/Pathlab.git
   cd Pathlab
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Copy `.env.example` to `.env.local`
   - Visit [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Get your web app credentials
   - Fill in the `.env.local` file with your Firebase credentials

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Commands

```bash
# Development
npm run dev              # Start development server

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code with Prettier
npm run type-check       # Run TypeScript type checking
```

---

## 📋 Development Phases

### ✅ Phase 1: Project Initialization & Architecture
- Initialize Next.js with TypeScript
- Configure Tailwind CSS, ESLint, Prettier
- Setup folder structure
- Initialize Firebase configuration
- Define global types and interfaces

### ⏳ Phase 2: Authentication & RBAC
- Firebase Authentication setup
- Login/Signup screens
- Protected routes middleware
- Role-based access control
- User session management

### ⏳ Phase 3: Multi-Tenant Database Setup
- Firestore schema design
- Multi-tenant data isolation
- Security rules implementation
- Context providers for organization management

### ⏳ Phase 4: Dashboard & Navigation
- Main layout and sidebar
- Navigation menu
- Analytics dashboard
- Daily statistics and charts
- Theme toggle (Dark/Light mode)

### ⏳ Phase 5: Test Master & Inventory
- CRUD operations for tests
- Test catalog with 100+ standard tests
- Inventory management interface
- Demo data generation

### ⏳ Phase 6: Patient Registration & Invoicing
- Patient registration forms
- Barcode generation
- Billing module
- Payment tracking

### ⏳ Phase 7: Smart Report Entry
- Dynamic form rendering
- Auto-calculation formulas
- Critical value highlighting
- Interpretation templates

### ⏳ Phase 8: PDF Report Engine
- A4 optimized PDF generation
- Professional report layout
- Digital signature support
- Print optimization

### ⏳ Phase 9: Search & Audit Trails
- Global search functionality
- Compliance audit log UI
- Activity tracking

### ⏳ Phase 10: Polish & Documentation
- Framer Motion animations
- TypeScript strict mode compliance
- Comprehensive documentation
- Deployment guides

---

## 🔐 Security & Compliance

- **RBAC**: Five user roles (Super Admin, Lab Admin, Doctor, Pathologist, Receptionist, Lab Technician)
- **Multi-Tenancy**: Strict data isolation by `organizationId`
- **Audit Trails**: Complete action logging for compliance
- **Encryption**: Sensitive data encrypted in transit and at rest
- **Firebase Security**: Row-level security rules enforced
- **HIPAA Ready**: Architecture supports healthcare compliance requirements

---

## 📦 Deployment

### Vercel (Free Tier)
```bash
# Push to main branch to trigger auto-deployment
git push origin main
```

### Environment Variables
Set these in Vercel dashboard or `.env.local` for local development:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

---

## 🛣️ Roadmap

### Q1 2026
- ✅ Phase 1-4: Core architecture and authentication
- ⏳ Phase 5-6: Test and patient management

### Q2 2026
- ⏳ Phase 7-8: Report generation and PDF engine
- ⏳ Phase 9: Advanced search and audit logs

### Q3 2026
- ⏳ Phase 10: Polish and production readiness
- SMS/WhatsApp notifications
- Advanced analytics and reporting

### Future Enhancements
- Mobile app (React Native)
- AWS/GCP migration support
- Advanced inventory analytics
- Integration with popular LIMS systems
- Machine learning for data analysis
- Telemedicine consultation module

---

## 📄 License

This project is proprietary and confidential.

---

## 👥 Team

**Brajesh Kumar** - Founder & Principal Software Architect

---

## 📞 Support

For issues, feature requests, or questions:
- Email: support@pathlab.io
- Issues: [GitHub Issues](https://github.com/brajeshkumar609/Pathlab/issues)

---

## 🎓 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

---

**Last Updated:** Phase 1 - 2026-07-03
**Next Phase:** Phase 2 - Authentication & RBAC
