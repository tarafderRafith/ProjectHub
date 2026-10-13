# ProjectHub 

### A Marketplace for University Student Projects

**ProjectHub** is a full-stack web application designed to connect university students who want to buy, sell, and explore academic projects. It provides a centralized marketplace where students can discover projects, publish their own work, communicate with sellers after purchase, and manage transactions through an order-based workflow.

The platform aims to make academic project collaboration more organized, transparent, and accessible.

---

## ✨ Features

### 🛍️ Project Marketplace

* Browse and explore available academic projects.
* Search and discover projects across different categories.
* View project descriptions, technologies, pricing, and deliverables.
* Preview project images and details before purchasing.
* Create and manage project listings as a seller.

### 👥 User Accounts

* User registration and authentication.
* Buyer and seller roles.
* Personalized user profiles.
* Role-based access to platform features.
* Dashboard access for managing marketplace activities.

### 📦 Order Management

* Create purchase orders for listed projects.
* Track order status and expected delivery dates.
* Manage seller work and delivery submissions.
* Support revision requests and buyer confirmation.
* Maintain order information for both buyers and sellers.

### 💬 Order-Based Messaging

* Private conversations between buyers and sellers.
* Discuss requirements, progress, delivery, and revisions.
* View conversations associated with eligible orders.
* Track unread messages.

### 💳 Payment Workflow

* Submit payment transaction details for verification.
* Admin verification before an order moves to the payment-held stage.
* Track payment and order status.
* Calculate platform commission and seller earnings.
* Manage seller payouts through an administrative workflow.

> **Note:** Payment verification and payout functionality may depend on the current implementation and configuration. Verify payment manually and use a suitable payment provider before accepting real transactions.

### 🛡️ Administration

* Review and approve project listings.
* Manage users and marketplace activity.
* Verify or reject submitted payment information.
* Monitor financial summaries and seller payouts.
* Release eligible seller payouts through the administrative workflow.

---

## 🧰 Tech Stack

### Frontend

* **React** — component-based user interface
* **TypeScript** — type-safe application development
* **Vite** — development server and build tooling
* **React Router** — client-side navigation
* **CSS** — responsive styling and interface design

### Backend

* **ASP.NET Core Web API (.NET 9)**
* **C#** — backend application logic
* **Entity Framework Core** — database access and ORM
* **JWT Authentication** — token-based authentication

### Database & Development Tools

* **Microsoft SQL Server**
* **Docker Desktop** — local SQL Server environment
* **Swagger / OpenAPI** — API exploration and testing
* **Git & GitHub** — version control and source management
* **Visual Studio Code** — development environment

---

## 🏗️ Project Architecture

ProjectHub is organized into separate frontend and backend applications.

```text
ProjectHub/
├── projecthub-web/             # React + TypeScript frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Application pages
│   │   ├── services/           # API communication
│   │   ├── types/              # TypeScript types
│   │   ├── hooks/              # Custom React hooks
│   │   ├── context/            # Shared application state
│   │   ├── utils/              # Helper functions
│   │   ├── App.tsx              # Application routes
│   │   └── index.css            # Global styles
│   └── package.json
│
└── ProjectHub.Api/              # ASP.NET Core Web API
    ├── Controllers/             # API endpoints
    ├── Models/                  # Entity models
    ├── Data/                    # Database context
    ├── Migrations/              # EF Core migrations
    ├── wwwroot/                 # Static files and uploads
    ├── Program.cs               # Application configuration
    └── appsettings.json         # Application settings
```

*The tree represents the intended organization; individual files and folders may vary as development continues.*

---

## 🚀 Getting Started

Follow these steps to run ProjectHub locally.

### Prerequisites

Install the following tools:

* [Node.js](https://nodejs.org/)
* [npm](https://docs.npmjs.com/)
* [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* [Git](https://git-scm.com/)
* [Visual Studio Code](https://code.visualstudio.com/)

You will also need a SQL Server database. Docker is one option for running SQL Server locally.

### 1. Clone the repository

```bash
git clone https://github.com/tarafderRafith/ProjectHub.git
cd ProjectHub
```

If your repository has a different name or folder structure, adjust the command accordingly.

### 2. Set up the frontend

Open a terminal and navigate to the frontend directory:

```bash
cd projecthub-web
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal. It is commonly `http://localhost:5173`, but Vite may select another available port.

### 3. Set up the backend

Open a second terminal and navigate to the API project:

```bash
cd ProjectHub.Api
dotnet restore
dotnet build
```

Configure your database connection string and JWT settings using local development configuration or environment variables. Do not commit passwords, JWT secrets, or other credentials to GitHub.

Apply the existing Entity Framework Core migrations:

```bash
dotnet ef database update
```

If the EF Core command is unavailable, install the EF Core command-line tool:

```bash
dotnet tool install --global dotnet-ef
```

If it is already installed, update it if necessary:

```bash
dotnet tool update --global dotnet-ef
```

Start the backend:

```bash
dotnet run
```

Use the API URL displayed in the terminal. The frontend's API base URL must match the backend URL configured for your local environment.

### 4. Explore the API

When Swagger is enabled in the development environment, open the Swagger URL configured by the backend to inspect and test available API endpoints.

---

## 🔄 Marketplace Workflow

The intended purchase and delivery workflow is:

1. A seller creates a project listing.
2. An administrator reviews and approves the listing.
3. A buyer explores the marketplace and selects a project.
4. The buyer creates an order and submits payment information.
5. An administrator verifies the payment.
6. The order moves to the payment-held stage, enabling eligible order-based communication.
7. The seller works on the order and submits the deliverables.
8. The buyer reviews the submission and may request a revision or confirm completion.
9. The platform calculates its commission and manages the seller payout.
10. The order and transaction records are updated.

Actual behavior depends on the implemented endpoints, configured payment process, and current order status.

---

## 🔐 Security Considerations

* Keep secrets and production credentials out of source control.
* Configure CORS for trusted frontend origins only.
* Validate user input on both the frontend and backend.
* Enforce authorization on protected API endpoints.
* Restrict administrative operations to authorized administrators.
* Protect private seller payout details and payment records.
* Use HTTPS and a secure production configuration when deploying.
* Never treat a client-side payment confirmation as proof that a payment was received.

**Important:** The current local-development configuration is not automatically production-ready. Real payments, payout handling, dispute resolution, and sensitive account information require appropriate security and operational controls.

---

## 🛣️ Roadmap

Potential future improvements include:

* [ ] Production payment gateway integration
* [ ] Automated payment verification where supported by the provider
* [ ] Real-time messaging and notifications
* [ ] Improved order tracking and delivery management
* [ ] Buyer and seller reviews and ratings
* [ ] Advanced project search, filters, and sorting
* [ ] Automated email notifications
* [ ] Production deployment and monitoring
* [ ] Expanded automated testing and security checks

---

## 🎯 Project Goal

ProjectHub aims to provide university students with a structured marketplace for discovering, sharing, and purchasing academic project resources while supporting clearer communication, organized delivery, and transparent transaction workflows.

The platform is intended to support learning and project collaboration. Users should follow their institution's academic integrity rules and applicable intellectual property requirements.

---

## 👨‍💻 Author

**Tarafder Md. Rafith**

* GitHub: [@tarafderRafith](https://github.com/tarafderRafith)

---

## 📄 License

No license has been specified yet. If you intend to make ProjectHub open source, add a `LICENSE` file and update this section to reflect the license you choose.

---

<p align="center">
  Built with React, TypeScript, ASP.NET Core, and SQL Server.
</p>
