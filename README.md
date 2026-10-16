# 🛒 Smart Procurement & Vendor Management System

> A full-stack web application designed to streamline and centralize a company’s entire purchasing process—from employee requisition requests and vendor management to purchase orders and multi-role approvals.

---

## 🏗️ System Architecture

The application is built on a modern decoupled architecture, separating the React frontend from a robust Spring Boot backend REST API.

```text
React (port 5173)  ──JWT──►  Spring Boot REST API (port 8083)  ──JPA/Hibernate──►  MySQL
 (Pages, charts, forms)     (Security, business logic, reports)                  (procurement_db)

Layer	Technology	Responsibility
Frontend	React 18, Vite, React Router, Recharts	Login interface, role-based menu, interactive dashboards, tables, and forms
Backend	Spring Boot, Spring Security (JWT), Spring Data JPA	REST APIs, role-based access checks, and business rules
Database	MySQL 8	Storage for users, roles, vendors, requisitions, POs, approvals, and audit logs
Reporting	JasperReports	Vendor data export as professional PDF or Excel reports
API Docs	Swagger	Interactive endpoint testing available at /swagger-ui.html
   
⚙️ Core Workflow
Plaintext
1. EMPLOYEE raises Requisition ──► Approval Created (PENDING)
                                        │
2. MANAGER/ADMIN creates PO  ──► Approval Created (PENDING)
                                        │
3. MANAGER/ADMIN Review        ──► Approves or Rejects (with a reason)
                                        │
4. Status Update             ──► Requisition/PO status updates to APPROVED / REJECTED
🧩 Key Modules
🔐 Authentication: Secure login utilizing JWT (JSON Web Tokens) valid for 1 hour, with passwords securely hashed via BCrypt.

📊 Dashboard: Dynamic overview cards and charts tracking vendors, requisitions, purchase orders, and pending approvals.

🏢 Vendor Management: Comprehensive supplier directory featuring status tracking and instant PDF/Excel report generation.

📝 Requisitions: Purchase requests supporting multiple line items, quantities, and pricing structures.

📦 Purchase Orders: Official orders linked to active vendors with complete item breakdowns and totals.

✅ Approval Center: Centralized interface to approve or reject items with comments, tracking decision makers and timestamps.

🔍 Audit Logging: Full tracking mechanism for requisition creation and update activities.

👥 Role-Wise Working Scope
Feature	👑 Admin	🧑‍💼 Procurement Manager	👤 Employee
Log in & view dashboard	✅	✅	✅ (Limited view)
View vendors	✅	✅	❌
Add vendor	✅	✅	❌
Delete vendor	✅	❌	❌
Download vendor PDF/Excel report	✅	✅	❌
Create requisition	✅	✅	✅
View requisitions	All	All	Only their own
Create purchase order	✅	✅	❌
View purchase orders	✅	✅	❌
Approve or reject requests	✅	✅	❌
   
👑 Admin Role (admin / admin123)
Full System Control: Possesses all manager privileges and acts as the sole role authorized to delete vendors.

Dashboard View: Access to all four summary cards and both system charts.

🧑‍💼 Procurement Manager Role (manager / manager123)
Day-to-Day Operations: Manages vendor directories, downloads reports, and oversees employee requisitions.

Purchasing & Approvals: Creates purchase orders against active vendors and handles the Approval Center workflow (with mandatory rejection reasons).

👤 Employee Role (employee / employee123)
Request Submitter: Focused entirely on creating purchase requisitions and monitoring individual request statuses (Pending, Approved, Rejected).

Restricted Access: Dashboard is tailored to display only relevant Requisitions data, backed by strict frontend route-guards and backend 403 API protections.

🛡️ Security & Access Enforcement
Access control is double-enforced to ensure high security integrity:

Frontend Layer: Sidebar links, UI components, and routes are dynamically filtered based on the active user role.

Backend Layer: Spring Security and @PreAuthorize annotations explicitly validate roles on every incoming API request.
