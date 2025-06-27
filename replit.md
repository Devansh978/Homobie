# Homobie - Fintech Platform

## Overview
A secure, scalable, and user-friendly fintech platform where customers can apply for home loans and access other financial services. The platform includes features such as loan applications, SIP investments, consultation services, and AI-powered customer support with a PostgreSQL database backend.

## Architecture
- **Frontend**: React with TypeScript, Vite, TailwindCSS, shadcn/ui components
- **Backend**: Node.js with Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local strategy and session management
- **Payment Gateway**: Razorpay integration for secure payments
- **Deployment**: Replit environment with workflow-based deployment

## Key Features
- Role-based access control (user, admin, super-admin)
- Loan application system with EMI calculators
- SIP investment planning with return calculations
- Financial consultation booking with payment integration
- Comprehensive audit logging for security and compliance
- Payment processing for loan fees, SIP investments, and consultations
- Admin dashboard for managing users and applications

## Recent Changes
- **January 2025**: Implemented complete Razorpay payment gateway integration
  - Added payment endpoints for loan processing fees, SIP investments, and consultations
  - Created payment verification webhook with signature validation
  - Integrated PaymentGateway component in consultation booking flow
  - Fixed database connection reliability with retry mechanisms
  - Updated consultation page with payment flow (₹999 consultation fee)
  - Added demo mode fallback for when Razorpay credentials are not configured
  - Improved error handling and user-facing error messages for payment failures
- **January 2025**: Enhanced UI/UX with modern design system
  - Upgraded Mission, Vision, Why Choose Homobie, Who We Serve, and Our Promise sections
  - Added framer-motion animations with scroll-triggered effects
  - Implemented glassmorphism design elements with backdrop-blur effects
  - Created gradient backgrounds with floating animated elements
  - Added interactive hover effects and scale transformations
  - Enhanced typography with gradient text effects and professional styling
  - Improved mobile responsiveness and accessibility

## User Preferences
- Company branding: "Homobie" (rebranded from FinSecure)
- Super admin email: devanshchourey@gmail.com
- Business hours: Mon-Sat 10AM-6PM, Sun closed
- Contact: Phone 7415814408, 8889444930, Email support@homobie.com
- Address: MF 12 Block A, Mansarovar Complex Shivaji Nagar, Bhopal MP 462016

## Project Status
- ✅ Authentication system with role-based access
- ✅ Database schema with audit logging
- ✅ Loan application system
- ✅ SIP investment features
- ✅ Consultation booking with payments
- ✅ Admin dashboards
- ✅ Payment gateway integration (Razorpay)
- 🔄 Testing and optimization ongoing

## Technical Notes
- Using PostgreSQL with Neon backend
- Session management with connect-pg-simple
- Form validation with zod and react-hook-form
- Query management with TanStack Query
- Payment security with HMAC signature verification
- Responsive design with mobile-first approach