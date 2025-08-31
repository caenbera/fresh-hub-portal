# **App Name**: Fresh Hub Portal

## Core Features:

- Landing Page: Display an attractive landing page with i18n support (English/Spanish).
- Authentication Flow: Implement registration and login pages using Firebase Authentication. New users get the 'client' role by default.
- Admin Dashboard: Provide a secure, role-based admin dashboard (accessible to 'admin' and 'superadmin' roles) for managing inventory, customers, and orders.
- Client Portal: Implement a client portal (accessible to 'client' role) for placing new orders and viewing order history.
- Setup Super Admin: Set up Firebase Cloud Function to assign superadmin role. Also implement a temporary route to become a superadmin. The tool should avoid unintended elevation, especially in production.
- Dynamic Route Handling: Configure React Router for different user roles (client, admin, superadmin) to handle routes and permissions effectively.

## Style Guidelines:

- Primary color: Saturated lime green (#90EE90) to represent freshness and natural produce, symbolizing 'The Fresh Hub'.
- Background color: Light, desaturated lime green (#F0FFF0) to create a clean and natural feel.
- Accent color: Yellow-green (#A2CD5A), a brighter and more saturated color, that helps highlight important CTAs.
- Font pairing: 'Poppins' (sans-serif) for headings and 'PT Sans' (sans-serif) for body text. 'Poppins' will give a precise and contemporary style, whereas 'PT Sans' offers better readability in longer format.
- Use simple, outline-style icons related to food, business, and management to maintain a clean, modern look.
- Design a grid-based layout with clear sections and whitespace to enhance readability and overall user experience.