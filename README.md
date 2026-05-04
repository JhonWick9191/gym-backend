# Gym Management Backend System

A robust, simple, and clean backend system for managing gym students, fee subscriptions, and automated email notifications. Built with **Node.js, Express, and MongoDB (Mongoose)** using a strict **MVC architecture**.

## 📖 Project Overview
This system allows admins to:
- Manage students (users) and their monthly fee subscriptions.
- Automatically track expired memberships.
- Send automated and manual email notifications to students.
- Securely manage the system via Admin Authentication (JWT & Cookies).

---

## 🧠 Application Flow (For Frontend Developers)

1.  **Admin Setup**: Admin registers and logs in to the system.
2.  **Authentication**: A secure JWT token is stored in the browser's cookies after login. All management APIs are protected.
3.  **User Creation**: Admin adds a new student with a `monthlyFee`, `fromMonth`, and `toMonth`.
4.  **Automatic Fee Logic**: The system calculates the `totalFee` and sets the `isNotified` flag to `false`.
5.  **Expiry Tracking**: Every day at 7:15 PM, a background task (Cron Job) checks for users whose `toMonth` has passed today's date.
6.  **Notifications**: If a user is expired and hasn't been notified, the system sends an email and updates `isNotified` to `true`.
7.  **Renewal**: When a user pays again, the Admin updates their `toMonth`. This resets `isNotified` to `false`, allowing the cycle to repeat for the next expiry.

---

## 🔐 Admin APIs
Base URL: `/api/v1/admin`

### 1. Register Admin
- **URL**: `/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "Admin Name",
    "email": "admin@example.com",
    "password": "securepassword"
  }
  ```

### 2. Admin Login
- **URL**: `/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: Sets an `httpOnly` cookie named `token`.

---

## 👤 User (Student) APIs
Base URL: `/api/v1/users`
*(All routes below require Admin Login)*

### 1. Create New User
- **URL**: `/create-user`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "monthlyFee": 2000,
    "fromMonth": "2024-01-01",
    "toMonth": "2024-03-01"
  }
  ```

### 2. Get All Students
- **URL**: `/`
- **Method**: `GET`
- **Description**: Returns a list of all students in the database.

### 3. Edit Student Details
- **URL**: `/:id`
- **Method**: `PUT`
- **Body**: `{ "email": "new@example.com", "toMonth": "2024-05-01" }`
- **Description**: Updates student email and/or expiry date.

### 4. Delete Student
- **URL**: `/:id`
- **Method**: `DELETE`
- **Description**: Permanently removes a student from the system.

### 5. Get Expired Users
- **URL**: `/expired`
- **Method**: `GET`
- **Description**: Returns all users whose `toMonth` is before today.

### 6. Get Users Expiring This Month
- **URL**: `/expiring-this-month`
- **Method**: `GET`
- **Description**: Returns users whose membership expires within the current calendar month.

### 7. Update User Fee (Renewal)
- **URL**: `/update-fee/:id`
- **Method**: `PUT`
- **Body**:
  ```json
  { "newToMonth": "2024-06-01" }
  ```

### 5. Send Expired Emails (Manual Trigger)
- **URL**: `/notify-expired`
- **Method**: `POST`
- **Description**: Manually triggers the email notification for all expired users who haven't been notified yet.

### 6. Test Email Functionality
- **URL**: `/test-email`
- **Method**: `POST`
- **Body**: `{ "email": "test@example.com" }`

---

## 📧 Email Notification System

### 🕒 Automated Features (Cron Job)
The system includes a built-in **Cron Job** that runs automatically every day at **7:30 PM**.
- **Logic**: Automatically emails users where `toMonth < today` and `isNotified === false`.

### Manual Trigger
- Use the `/notify-expired` API to send emails on demand.

### Verification
- Use the `/test-email` API to ensure your SMTP settings are correct.

---

## 🛠 Setup & Installation

### 1. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the App
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## ⚖️ Features
- **MVC Architecture**: Clean separation of models, views (API), and controllers.
- **Security**: Password hashing and JWT-based cookie authentication.
- **Automation**: Daily background tasks for fee monitoring.
- **Validation**: Strict schema-level and controller-level data validation.
