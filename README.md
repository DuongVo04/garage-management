<div align="center">

# Garage Management

### Garage & Workshop Management Solution

[![Backend](https://img.shields.io/badge/Backend-ExpressJS-black.svg)](https://expressjs.com/)
[![Frontend](https://img.shields.io/badge/Frontend-Vite%20%2B%20React-646CFF.svg)](https://vitejs.dev/)
[![UI](https://img.shields.io/badge/UI-MUI-007FFF.svg)](https://mui.com/)
[![Database](https://img.shields.io/badge/Database-MySQL-4479A1.svg)](https://www.mysql.com/)
[![Language](https://img.shields.io/badge/Language-JavaScript-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Architecture](https://img.shields.io/badge/Architecture-REST%20API-blue.svg)](https://restfulapi.net/)


[Features](#-key-features) • [Tech Stack](#-technologies-used) • [Project Structure](#-project-structure) • [System Requirements](#-system-requirements) • [Installation](#-installation) • [Git Branch Naming Convention](#-git-branch-naming-convention)

Garage Management System is a full‑stack web application designed to help garages and auto workshops manage services, customers, vehicles, and operations efficiently. The system is containerized with Docker and can be deployed easily using Docker Compose.

---

</div>


## 🚀 Key Features

- **Customer Management**: Manage customer profiles and contact information
- **Vehicle Management**: Store and track customer vehicles and service history
- **Service & Repair Management**: Create, update, and manage repair/service orders
- **Inventory & Parts Management**: Track spare parts and stock levels
- **Employee Management**: Manage mechanics and staff roles
- **Invoice & Payment Management**: Generate invoices and manage payment status
- **Dashboard & Reports**: Overview of garage performance and statistics

---

## 🛠 Technologies Used

### Backend

- **Node.js** (Runtime)
- **ExpressJS** (RESTful API)
- **MySQL** (Relational Database)

### Frontend

- **ReactJS**
- **Vite** (Fast build tool)
- **MUI** (optional UI libraries)

### DevOps & Deployment

- **Docker**
- **Docker Compose**

---

## 📁 Project Structure

```
garage-management/
├── backend/                # ExpressJS backend
│   │── controllers/        # API controllers
│   │── middlewares/        # Intermediate function for request processing
│   │── routes/             # API routes
│   │── schemas/            # Database schemas
│   │── utils/              # Helper funtion
│   │── validators/         # Verify requested data
│   │── .env                # Backend environment variables
│   │── app.js              # Express app entry
│   ├── Dockerfile
│   └── package-lock.json
│   └── package.json
│
├── frontend/               # Vite + React frontend
|   ├── public/             # Static files served directly in the React source code.
│   ├── src/                # Source code
|   |   ├── assets/         # UI images, icons, fonts (bundled)
|   |   ├── components/     # Contains collections UI components
|   |   ├── context/        # Global state Management
|   |   ├── hooks/          # Common states
|   |   ├── layouts/        # Dynamic layouts
|   |   ├── pages/          # Web application pages
|   |   ├── routes/         # Application URL
|   |   ├── services/       # Data processing & API calls
|   |   ├── utils/          # Common utility functions
|   |   ├── App.css         
|   |   ├── App.jsx         # The root component
|   |   ├── index.css       # Global CSS
|   |   ├── main.jsx        # Entry point of react
│   │── .env                # Frontend environment variables
│   ├── Dockerfile
│   ├── index.html          # Root HTML of website
│   └── package-lock.json
│   └── package.json
│    
├── database/
│   └── init-schemas.sql            # MySQL init script (optional)
│
├── docker-compose.yml      # Docker Compose configuration
├── .env                    # Docker environment variables
└── README.md
```

---

## ⚙️ System Requirements

- **Docker** >= 24.x
- **Docker Compose** >= 2.x
- (Optional for development)
  - Node.js >= 18
  - MySQL >= 8.0

---

## 📦 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/DuongVo04/garage-management.git
cd garage-management
```

### 2️⃣ Create environment variables

Create a `.env` file in the root directory:

```env
# MySQL
MYSQL_ROOT_PASSWORD=<your-root-password>
MYSQL_DATABASE=garage-managerment-db
MYSQL_USER=garage-managerment-user
MYSQL_PASSWORD=<your-garage-password>
```

---

### 3️⃣ Run with Docker Compose

```bash
docker compose up
```

Services will be available at:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **MySQL**: localhost:3306

---

### 4️⃣ Stop the system

```bash
docker compose down
```

---
## 🌿 Git Branch Naming Convention

To ensure the source code is easy to manage and to facilitate efficient teamwork, the project uses the following branch naming convention.

### 1. Main branch types

- **main**  
  - Contains stable code for use in a production environment.
  - Merged from the `develop` branch only after thorough testing.

- **develop**  
  - Integrated branch incorporating completed functionalities
  - Serves as a testing environment before release

- **The other branches were named during the development process as follows:**

    | Prefix | Describe |
    |------|------|
    | `feature/` | Develop new features |
    | `bugfix/` | Fix bugs during development |
    | `hotfix/` | Fix urgent bugs in production |
    | `release/` | Prepare for release |
    | `refactor/` | Improve code structure (no functional changes) |
    | `test/` | Write or update tests |
    | `docs/` | Update documentation |
    | `chore/` | Chore work (config, dependency, build, Docker...) |

---

### 2. Example of naming a branch

```bash
feature/user-login
feature/booking-system
bugfix/login-token-error
hotfix/payment-crash
refactor/auth-service
docs/api-documentation
chore/update-docker-config
```
---

## 👨‍💻 Authors

- **DuongVo04**
- **ngDucTuan062004**
- **LongVu2004**
- **hotrong14**

---

## 📄 License

Copyright © 2026 Garage Management System. All rights reserved.

