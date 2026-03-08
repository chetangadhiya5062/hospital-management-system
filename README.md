🏥 Health Management System (HMS)

A Full-Stack Role-Based Health Management System built with React, Node.js, Express, and MongoDB.

The system enables Patients, Doctors, and Admins to interact through a secure platform for managing appointments, profiles, and healthcare operations.

This project demonstrates clean architecture, role-based authentication, modular backend design, and modern frontend development practices.

🚀 Features
🔐 Authentication & Security

JWT Authentication

Role-based access control

Password hashing with bcrypt

Protected routes (frontend & backend)

Middleware-based security

👥 Role-Based System
🧑 Patient

Register and Login

View available doctors

Book appointments

Cancel appointments

View appointment status

Upload medical reports

Dark/Light mode UI

👨‍⚕ Doctor

Secure login

Doctor dashboard

View only their assigned appointments

Approve appointments

Reject appointments

Manage doctor profile

Bio

Specialization

Profile image

🛡 Admin

Admin dashboard

Create doctor accounts

Manage system-level operations

🎨 UI Features

Modern responsive interface

Dark / Light theme toggle

Toast notifications

Clean dashboard design

Role-aware navigation

Mobile-friendly layout

🏗 System Architecture
High-Level Architecture
Client (React + Tailwind)
        │
        │ HTTP Requests (Axios)
        ▼
Express Server (Node.js)
        │
        ├── Authentication Middleware (JWT)
        ├── Role Middleware
        ├── Controllers (Business Logic)
        │
        ▼
Mongoose ORM
        │
        ▼
MongoDB Database
Layered Architecture
Presentation Layer
    React Frontend

Application Layer
    Express Controllers

Security Layer
    JWT Authentication + Role Middleware

Data Access Layer
    Mongoose Models

Database Layer
    MongoDB

This layered approach ensures:

Clean separation of concerns

Maintainable codebase

Scalable architecture

Secure role isolation

📂 Project Structure
HMS
│
├── hms-backend
│   ├── controllers
│   │   ├── authController.js
│   │   ├── appointmentController.js
│   │   ├── doctorController.js
│   │   └── adminController.js
│   │
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Appointment.js
│   │   ├── Payment.js
│   │   └── Upload.js
│   │
│   ├── routes
│   │   ├── auth.js
│   │   ├── doctor.js
│   │   ├── appointment.js
│   │   ├── admin.js
│   │   ├── upload.js
│   │   └── payment.js
│   │
│   ├── utils
│   │   └── AppError.js
│   │
│   ├── uploads
│   │
│   ├── server.js
│   └── package.json
│
│
├── hms-frontend
│   ├── src
│   │   ├── pages
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Appointment.jsx
│   │   │   ├── Doctor.jsx
│   │   │   ├── DoctorProfile.jsx
│   │   │   ├── Admin.jsx
│   │   │   ├── Upload.jsx
│   │   │   └── Payment.jsx
│   │   │
│   │   ├── routes
│   │   │   ├── AppRoutes.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   └── DoctorRoute.jsx
│   │   │
│   │   ├── context
│   │   │   ├── AppContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── components
│   │   │   ├── layout
│   │   │   └── ThemeToggle.jsx
│   │   │
│   │   ├── services
│   │   │   └── api.js
│   │   │
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
🧠 Database Schema
User
name
email
password (hashed)
role (admin | doctor | patient)
Doctor
user (reference to User)
specialization
bio
photo
Appointment
patient (reference to User)
doctor (reference to Doctor)
date
timeSlot
status (pending | approved | rejected | cancelled)
Payment
user
appointment
amount
status
Upload
user
filename
originalname
path
size
🔄 Appointment Workflow

1️⃣ Patient books appointment
2️⃣ Appointment status → Pending

3️⃣ Doctor reviews appointment

4️⃣ Doctor action:

Approve → status Approved

Reject → status Rejected

5️⃣ Patient sees updated status in dashboard

⚙️ Installation Guide
1️⃣ Clone Repository
git clone https://github.com/yourusername/hms-project.git
cd hms-project
Backend Setup
cd hms-backend
npm install

Create .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Start backend server:

npm run dev

Backend runs at:

http://localhost:5000
Frontend Setup
cd hms-frontend
npm install
npm run dev

Frontend runs at:

http://localhost:5173
🌐 Application Flow
Landing Page

Public homepage with project overview and login access.

Login

User selects role:

Admin

Doctor

Patient

After login:

Admin → /admin
Doctor → /doctor
Patient → /appointment
Registration

New users register and then login.

🧪 Testing

Testing performed using:

Browser UI testing

Postman API testing

Role switching validation

JWT authentication validation

🚧 Future Enhancements

Possible improvements:

Real payment gateway integration (Stripe/Razorpay)

Cloud file storage (AWS S3 / Cloudinary)

Email notifications

Appointment reminders

Analytics dashboard

Docker containerization

CI/CD pipelines

Swagger API documentation

📈 Learning Outcomes

This project demonstrates:

Full-stack application development

Secure authentication systems

Role-based access control

RESTful API architecture

Context API state management

Scalable backend structure

👨‍💻 Author

Chetan Gadhiya

Computer Engineering Student
Full Stack Developer

⭐ Support

If you find this project helpful, please consider giving it a ⭐ on GitHub.
