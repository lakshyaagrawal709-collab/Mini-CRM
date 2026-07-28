# NexusCRM - Enterprise Client Lead Management System (Mini CRM)

> A modern, full-stack MERN (MongoDB, Express.js, React.js, Node.js) Lead Management System tailored for startups, digital agencies, and sales teams. Featuring JWT authentication, real-time analytics with Recharts, CSV import/export, dark mode, audit logging, and responsive glassmorphic UI.

---

## 🚀 Key Features

- **Authentication & Security**: JWT-authenticated REST APIs protected by custom middleware, password hashing with `bcryptjs`, and `express-validator` payload protection.
- **Interactive Analytics Dashboard**:
  - Live KPI cards (Total Leads, Converted Leads, Lost Leads, Conversion Rate, Est. Contract Revenue).
  - Monthly lead volume trends using **Recharts Bar Chart**.
  - Pipeline status distribution using **Recharts Donut/Pie Chart**.
  - Upcoming follow-up reminders widget and system audit log activity feed.
- **Lead Directory Management**:
  - Search by Lead Name, Email, or Company.
  - Multi-criteria filtering by Pipeline Status (`New`, `Contacted`, `Qualified`, `Proposal Sent`, `Converted`, `Lost`), Priority (`High`, `Medium`, `Low`), and Lead Source (`Website`, `Referral`, `LinkedIn`, etc.).
  - Flexible sorting (Newest, Oldest, Alphabetical, Highest Contract Value).
  - Server-side and Client-side Pagination.
  - Quick inline status switcher.
  - Add, Edit, and Delete leads with custom confirmation dialogs.
- **Detailed Lead Profile & Timeline**:
  - Comprehensive contact & deal summary.
  - Add interaction notes directly into lead history feed.
- **Data Import & Export**:
  - **CSV Export**: Instant download of filtered or full lead records.
  - **CSV Import**: Bulk upload spreadsheets with client-side PapaParse validation.
- **UI / UX Excellence**:
  - Built with Tailwind CSS v3 & Lucide Icons.
  - Dark Mode Toggle with `localStorage` persistence.
  - Responsive layout with collapsible mobile drawer navigation.
  - Skeleton loading shimmers & empty state placeholders.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v3, Vanilla CSS Glassmorphism
- **Routing**: React Router DOM v6
- **State & HTTP**: Axios, React Context API (`AuthContext`, `ThemeContext`)
- **Analytics & Data Visuals**: Recharts
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **CSV Parsing**: PapaParse

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose ORM
- **Authentication**: JSON Web Token (JWT) & bcryptjs
- **Validation**: express-validator
- **Environment**: dotenv & CORS

---

## 📂 Project Structure

```
mini-crm/
│
├── client/
│   ├── src/
│   │   ├── components/       # Reusable UI components (Sidebar, Navbar, StatCard, LeadTable, etc.)
│   │   ├── context/          # AuthContext & ThemeContext
│   │   ├── layouts/          # DashboardLayout & AuthLayout
│   │   ├── pages/            # Login, Dashboard, Lead Management, Lead Details, Settings
│   │   ├── services/         # Axios API service calls (authService, leadService, dashboardService)
│   │   ├── utils/            # Formatters (Date, Currency, Badges)
│   │   ├── App.jsx           # App Routes & Providers
│   │   ├── index.css         # Tailwind & Glassmorphism styles
│   │   └── main.jsx          # Vite React entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vercel.json           # Vercel deployment SPA rewrite rule
│
├── server/
│   ├── config/               # Database connection (db.js)
│   ├── controllers/          # Business logic (authController, leadController, dashboardController)
│   ├── middleware/           # authMiddleware, validateMiddleware, errorMiddleware
│   ├── models/               # Mongoose Schemas (Admin, Lead, ActivityLog)
│   ├── routes/               # API route definitions (authRoutes, leadRoutes, dashboardRoutes)
│   ├── utils/                # JWT generator & DB seeder (seed.js)
│   ├── .env.example
│   ├── package.json
│   └── server.js             # Express app entry point
│
└── README.md
```

---

## 🔧 Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mini_crm?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## ⚡ Quick Start Guide (Local Setup)

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance (`mongodb://127.0.0.1:27017/mini_crm`)

### 1. Setup Backend
```bash
cd server
npm install

# (Optional) Seed initial Admin & sample leads
npm run seed

# Start server in development mode
npm run dev
```
- Server will start at: `http://localhost:5000`

### 2. Setup Frontend
```bash
cd client
npm install

# Start Vite development server
npm run dev
```
- Application will start at: `http://localhost:5173`

### 🔑 Demo Login Credentials
- **Email**: `admin@minicrm.com`
- **Password**: `admin123`

---

## 🌐 API Endpoint Specifications

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/login` | Admin login & token generation | Public |
| GET | `/api/auth/me` | Fetch logged-in admin profile | Private (JWT) |
| PUT | `/api/auth/change-password` | Update admin password | Private (JWT) |

### Leads Directory (`/api/leads`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/leads` | Get paginated leads (search, filter, sort, export) | Private (JWT) |
| GET | `/api/leads/:id` | Get lead details by ID | Private (JWT) |
| POST | `/api/leads` | Create a new lead | Private (JWT) |
| PUT | `/api/leads/:id` | Update existing lead | Private (JWT) |
| DELETE | `/api/leads/:id` | Delete a lead | Private (JWT) |
| PATCH | `/api/leads/status/:id` | Quick update lead status | Private (JWT) |
| PATCH | `/api/leads/notes/:id` | Add note to lead timeline | Private (JWT) |
| POST | `/api/leads/import` | Bulk import leads array from CSV | Private (JWT) |

### Analytics & Dashboard (`/api/dashboard`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/dashboard` | Get KPI metrics, monthly counts, status pie chart, activities | Private (JWT) |

---

## ☁️ Deployment Instructions

### 1. Frontend Deployment (Vercel)
1. Push `mini-crm` code to your GitHub repository.
2. Log into [Vercel](https://vercel.com) and click **Add New Project**.
3. Select `client/` directory as the root folder.
4. Set Framework Preset to **Vite**.
5. Set Environment Variable: `VITE_API_URL=https://your-backend-render-url.onrender.com/api`
6. Click **Deploy**.

### 2. Backend Deployment (Render)
1. Log into [Render](https://render.com) and create a new **Web Service**.
2. Connect your GitHub repository and set the Root Directory to `server/`.
3. Set Build Command to `npm install` and Start Command to `node server.js`.
4. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas connection URI
   - `JWT_SECRET`: A strong secret key string
   - `NODE_ENV`: `production`
5. Deploy Web Service.

### 3. Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and whitelist IP address (`0.0.0.0/0` for cloud deployment).
3. Copy the Connection String into `MONGO_URI`.

---

## 📄 License
This project is licensed under the MIT License.
