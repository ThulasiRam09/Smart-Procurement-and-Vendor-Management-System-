<div align="center">

# 📦 Smart Procurement & Vendor Management System

### *From purchase request to approval — one platform, fully tracked.*

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-JWT-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-Build-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-API_Docs-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

[✨ Features](#-features) •
[🏗️ Architecture](#️-architecture) •
[🛠️ Tech Stack](#️-tech-stack) •
[🚀 Getting Started](#-getting-started) •
[👥 Roles](#-roles--permissions) •
[🔌 API](#-api-reference) •
[📁 Structure](#-project-structure)

</div>

---

## 📖 About the Project

**Smart Procurement & Vendor Management System** is a full-stack web application that runs a company's purchasing process in one place.

> 🧑‍💻 An **employee** raises a request → 🧑‍💼 a **manager** orders from a vendor → ✅ an **approval decision** is recorded → 📊 everything is tracked.

It replaces paper and Excel-based purchasing with a **secure, role-based, trackable workflow**, with a modern **React** interface on top of a **Spring Boot** REST API.

---

## ✨ Features

| | Feature | Description |
|:-:|---|---|
| 🏢 | **Vendor Management** | Maintain supplier records with contact details, address and status (`ACTIVE`, `INACTIVE`, `PENDING_APPROVAL`) |
| 📄 | **Requisitions** | Raise purchase requests with multiple items, quantities and unit prices |
| 🛒 | **Purchase Orders** | Create orders against vendors with line items and an automatic total |
| ✅ | **Approval Center** | Approve or reject requests with comments, recording who decided and when |
| 📊 | **Live Dashboard** | Real-time counts plus status charts for requisitions and purchase orders |
| 📑 | **Reports** | Download vendor reports as **PDF** or **Excel** (JasperReports) |
| 🔐 | **Secure Login** | JWT authentication with BCrypt-hashed passwords |
| 👥 | **Role-Based Access** | Separate permissions for Admin, Procurement Manager and Employee |
| 🧾 | **Audit Logging** | Key actions are logged for traceability |
| 📚 | **Swagger UI** | Interactive API documentation and testing |

---

## 🔄 Workflow

```mermaid
flowchart LR
    A([👤 Employee]) -->|creates| B[📄 Requisition]
    B -->|auto-creates| C{{🕒 Approval<br/>PENDING}}
    D([🧑‍💼 Manager / Admin]) -->|creates| E[🛒 Purchase Order]
    E -->|auto-creates| C
    C -->|decision| F{Approve or Reject?}
    F -->|✅| G[APPROVED]
    F -->|❌ + reason| H[REJECTED]

    style A fill:#e0e7ff,stroke:#4f46e5,color:#1e1b4b
    style D fill:#ede9fe,stroke:#7c3aed,color:#2e1065
    style B fill:#e0f2fe,stroke:#0284c7,color:#082f49
    style E fill:#e0f2fe,stroke:#0284c7,color:#082f49
    style C fill:#fef3c7,stroke:#d97706,color:#451a03
    style G fill:#d1fae5,stroke:#059669,color:#022c22
    style H fill:#fee2e2,stroke:#dc2626,color:#450a0a
```

---

## 🏗️ Architecture

```mermaid
flowchart LR
    U([🌐 Browser]) --> R
    subgraph FE [🎨 Frontend · port 5173]
        R[React 18 + Vite<br/>Router · Recharts]
    end
    subgraph BE [⚙️ Backend · port 8083]
        S[Spring Security<br/>JWT Filter] --> C[REST Controllers]
        C --> SV[Services]
        SV --> RP[JPA Repositories]
        SV --> J[JasperReports<br/>PDF / Excel]
    end
    R -- "HTTP + Bearer Token" --> S
    RP --> D[(🗄️ MySQL<br/>procurement_db)]

    style FE fill:#eef2ff,stroke:#4f46e5
    style BE fill:#ecfdf5,stroke:#059669
    style D fill:#dbeafe,stroke:#2563eb
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| 🎨 **Frontend** | ![React](https://img.shields.io/badge/-React_18-61DAFB?logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white) ![Router](https://img.shields.io/badge/-React_Router-CA4245?logo=reactrouter&logoColor=white) ![Recharts](https://img.shields.io/badge/-Recharts-22b5bf) ![CSS](https://img.shields.io/badge/-Responsive_CSS-1572B6?logo=css3&logoColor=white) |
| ⚙️ **Backend** | ![Java](https://img.shields.io/badge/-Java_17-ED8B00?logo=openjdk&logoColor=white) ![Spring Boot](https://img.shields.io/badge/-Spring_Boot-6DB33F?logo=springboot&logoColor=white) ![JPA](https://img.shields.io/badge/-Spring_Data_JPA-6DB33F) ![Security](https://img.shields.io/badge/-Spring_Security-6DB33F?logo=springsecurity&logoColor=white) ![JWT](https://img.shields.io/badge/-JWT-000000?logo=jsonwebtokens&logoColor=white) |
| 🗄️ **Database** | ![MySQL](https://img.shields.io/badge/-MySQL_8-4479A1?logo=mysql&logoColor=white) ![Hibernate](https://img.shields.io/badge/-Hibernate-59666C?logo=hibernate&logoColor=white) |
| 📑 **Reporting** | ![Jasper](https://img.shields.io/badge/-JasperReports-B71C1C) ![POI](https://img.shields.io/badge/-Apache_POI-D22128?logo=apache&logoColor=white) ![OpenPDF](https://img.shields.io/badge/-OpenPDF-FF0000) |
| 🧰 **Tools** | ![Maven](https://img.shields.io/badge/-Maven-C71A36?logo=apachemaven&logoColor=white) ![Swagger](https://img.shields.io/badge/-Swagger-85EA2D?logo=swagger&logoColor=black) ![npm](https://img.shields.io/badge/-npm-CB3837?logo=npm&logoColor=white) |

---

## 👥 Roles & Permissions

| Feature | 👑 Admin | 🧑‍💼 Procurement Manager | 👤 Employee |
|---|:---:|:---:|:---:|
| View dashboard | ✅ Full | ✅ Full | 🟡 Limited |
| View / add vendors | ✅ | ✅ | ❌ |
| **Delete vendors** | ✅ | ❌ | ❌ |
| Download vendor reports | ✅ | ✅ | ❌ |
| Create requisitions | ✅ | ✅ | ✅ |
| View requisitions | ✅ All | ✅ All | 🟡 Own only |
| Create purchase orders | ✅ | ✅ | ❌ |
| Approve / reject | ✅ | ✅ | ❌ |

> 🔒 Access is enforced in **two places**: the React menu/routes **and** the Spring Security rules on every API call.

---

## 🚀 Getting Started

### 📋 Prerequisites

![JDK](https://img.shields.io/badge/JDK-17+-ED8B00?logo=openjdk&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-3.8+-C71A36?logo=apachemaven&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/ThulasiRam09/Smart-Procurement-and-Vendor-Management-System-.git
cd Smart-Procurement-and-Vendor-Management-System-
```

### 2️⃣ Create the database

```sql
CREATE DATABASE procurement_db;
```

Open `src/main/resources/application.properties` and set your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/procurement_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

> ✅ Tables are created automatically on first run (`ddl-auto=update`), and the three demo users are seeded automatically.

### 3️⃣ Start the backend 🟢 *(port 8083)*

```bash
mvn clean spring-boot:run
```

### 4️⃣ Start the frontend 🔵 *(port 5173)*

Open a **second terminal**:

```bash
cd frontend
npm install
npm run dev
```

### 5️⃣ Open the app 🎉

| What | URL |
|---|---|
| 🖥️ **Web App** | http://localhost:5173 |
| 📚 **Swagger API Docs** | http://localhost:8083/swagger-ui.html |

> 💡 In development, Vite forwards every `/api/*` request to `localhost:8083` (see `frontend/vite.config.js`), so there are no CORS problems.

---

## 🔑 Demo Credentials

| Role | Username | Password |
|---|---|---|
| 👑 **Admin** | `admin` | `admin123` |
| 🧑‍💼 **Manager** | `manager` | `manager123` |
| 👤 **Employee** | `employee` | `employee123` |

> ⚠️ **Demo accounts only.** Change these passwords before any real deployment.

---

## 🔌 API Reference

> Full interactive docs: **Swagger UI** → `/swagger-ui.html`

| Method | Endpoint | Description | Roles |
|:-:|---|---|---|
| ![POST](https://img.shields.io/badge/POST-49cc90) | `/api/auth/login` | Login, returns JWT + role | 🌍 Public |
| ![GET](https://img.shields.io/badge/GET-61affe) | `/api/v1/dashboard` | Dashboard counts and chart data | All |
| ![GET](https://img.shields.io/badge/GET-61affe) | `/api/v1/requisitions` | List requisitions | All |
| ![POST](https://img.shields.io/badge/POST-49cc90) | `/api/v1/requisitions` | Create requisition | All |
| ![GET](https://img.shields.io/badge/GET-61affe) | `/api/v1/purchase-orders` | List purchase orders | Admin, Manager |
| ![POST](https://img.shields.io/badge/POST-49cc90) | `/api/v1/purchase-orders` | Create purchase order | Admin, Manager |
| ![GET](https://img.shields.io/badge/GET-61affe) | `/api/v1/approvals` | List approvals | Admin, Manager |
| ![POST](https://img.shields.io/badge/POST-49cc90) | `/api/v1/approvals/{id}/decision` | Approve or reject | Admin, Manager |
| ![GET](https://img.shields.io/badge/GET-61affe) | `/api/vendor` | List vendors | Admin, Manager |
| ![POST](https://img.shields.io/badge/POST-49cc90) | `/api/vendor` | Add vendor | Admin, Manager |
| ![DELETE](https://img.shields.io/badge/DELETE-f93e3e) | `/api/vendor/{id}` | Delete vendor | 👑 Admin |
| ![GET](https://img.shields.io/badge/GET-61affe) | `/api/reports/vendor/{id}?format=pdf\|excel` | Download vendor report | Admin, Manager |

Send the token with every protected request:

```http
Authorization: Bearer <your-jwt-token>
```

---

## 🗄️ Database Design

```mermaid
erDiagram
    USERS }o--o{ ROLES : has
    USERS ||--o{ REQUISITIONS : raises
    REQUISITIONS ||--|{ REQUISITION_ITEMS : contains
    VENDORS ||--o{ PURCHASE_ORDERS : receives
    PURCHASE_ORDERS ||--|{ PURCHASE_ORDER_ITEMS : contains
    REQUISITIONS ||--o{ APPROVALS : "needs"
    PURCHASE_ORDERS ||--o{ APPROVALS : "needs"
    USERS ||--o{ APPROVALS : decides
    VENDORS ||--o{ VENDOR_RATINGS : has
    VENDORS ||--o{ VENDOR_DOCUMENTS : has
```

---

## 📁 Project Structure

```text
📦 Smart-Procurement-and-Vendor-Management-System
├── 🎨 frontend/                     React application
│   ├── src/
│   │   ├── pages/                   Login, Dashboard, Vendors, Requisitions, PurchaseOrders, Approvals
│   │   ├── components/              Layout (sidebar) and shared UI (modals, badges, forms)
│   │   ├── api.js                   Fetch helper with JWT header
│   │   ├── auth.jsx                 Login state and role handling
│   │   └── styles.css               Theme
│   ├── vite.config.js               Dev server + /api proxy
│   └── package.json
├── ⚙️ src/main/java/com/procurement/procurement/
│   ├── config/                      Security, CORS, Swagger, JPA
│   ├── security/                    JWT utility and filter
│   ├── controller/                  REST controllers (auth, vendor, procurement, report, api)
│   ├── service/                     Business logic
│   ├── repository/                  Spring Data JPA repositories
│   ├── entity/                      Database models
│   ├── dto/ · mapper/               Data transfer objects
│   └── exception/                   Global error handling
├── 📑 src/main/resources/
│   ├── application.properties       Server and database settings
│   └── jasper/vendor_report.jrxml   Report template
├── 📄 pom.xml                       Maven dependencies
└── 📜 README.md
```

---

## 🔮 Future Enhancements

- [ ] 🔄 Convert an approved requisition into a purchase order automatically
- [ ] 📧 Email / in-app notifications for approvals
- [ ] ⭐ Vendor ratings and document upload screens
- [ ] ✏️ Edit vendors and requisitions from the UI
- [ ] 📈 Procurement summary and spending reports
- [ ] 🌙 Dark mode
- [ ] 🐳 Docker setup for one-command deployment

---

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create a branch: `git checkout -b feature/your-feature`
3. 💾 Commit your changes: `git commit -m "Add your feature"`
4. 📤 Push the branch: `git push origin feature/your-feature`
5. 🔁 Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`MIT_License`](MIT_License) for details.

---

<div align="center">

### 👨‍💻 Author

**ThulasiRam09** · Infosys Internship Project

[![GitHub](https://img.shields.io/badge/GitHub-ThulasiRam09-181717?style=for-the-badge&logo=github)](https://github.com/ThulasiRam09)

⭐ **If you found this project useful, give it a star!** ⭐

</div>
