# 🛒 Smart Procurement & Vendor Management System

> A full-stack web application designed to streamline and centralize a company’s entire purchasing process—from employee requisition requests and vendor management to purchase orders and multi-role approvals.

---

## 🏗️ System Architecture

The application is built on a modern decoupled architecture, separating the React frontend from a robust Spring Boot backend REST API.

```text
React (port 5173)  ──JWT──►  Spring Boot REST API (port 8083)  ──JPA/Hibernate──►  MySQL
 (Pages, charts, forms)     (Security, business logic, reports)                  (procurement_db)
