# 🛍️ MERN Stack eCommerce Website

This is a **comprehensive full-stack eCommerce application** built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). The project features full user and admin functionalities, secure authentication, product management, PayPal integration, and a clean, responsive UI with modern UX best practices.

It supports a **role-based access system**, where:
- 🧑‍💼 **Admins** can manage products, view and update order statuses.
- 👤 **Users** can browse, search, filter, purchase products, and manage their profile, cart, and reviews.

---

## 🚀 Live Demo

- Live Project Link : (https://mern-ecommerce-store-1-66zv.onrender.com)

---

## 🔧 Technologies Used

### 🖥️ Frontend:
- **React.js**
- **Tailwind CSS**
- **ShadCN UI**
- **React Router DOM**
- **Redux Toolkit** with `createAsyncThunk`
- **Lucide Icons**
- **Axios**
- **React Loading Skeleton**

### 🌐 Backend:
- **Node.js**
- **Express.js**
- **MongoDB** (via **Mongoose Atlas**)
- **Express Validator**
- **CORS Middleware**
- **Cookie Parser**
- **dotenv**

### 🔐 Authentication & Security:
- **JWT (JSON Web Tokens)**
- **Cookies**
- **bcrypt.js** (for password hashing)

### 📷 Image Upload:
- **Multer**
- **Cloudinary**

### 💳 Payment Gateway:
- **PayPal**

### 🌍 Deployment:
- **Frontend**: Render
- **Backend**: Render
- **Database**: MongoDB Atlas

---

## 📦 Features

### 👤 User Panel

- 🛒 Browse and search products
- 🔍 Filter by categories, brands
- 🗂️ Sort by:
  - Newest
  - Top Rated
  - Price: Low → High and High → Low
  - Title: A–Z / Z–A
- 📱 View detailed product pages (with up to 5 images)
- ❤️ Recommended products by category
- 🛍️ Add multiple items to cart
- 📦 See stock status and discounts
- 🧾 Checkout flow:
  - Add up to 3 addresses
  - Select address for delivery
  - Secure payment via PayPal
- ✅ Post-payment order confirmation
- 👀 View order history and track status
- ✍️ Leave reviews **only if purchased**
- 🔁 Pagination:
  - Products: 10 per page
  - Reviews: 4 per page

---

### 🛠️ Admin Panel

- ➕ Add products
- ✏️ Edit products
- ❌ Delete products
- 📊 View all orders
- 🔄 Update order status
- 👥 Role-based access (Admin & User)

---

## 🔐 Authentication & Security

- JWT-based user authentication
- Role-based access control (User/Admin)
- Password hashing with bcrypt
- Secure cookie handling with cookie-parser
- CORS enabled

---

## 💳 Payment Integration

- Integrated **PayPal** gateway
- Automatic redirection on success/failure
- Secure transaction flow
- Order confirmation and payment validation

---

## 🖼️ Image Handling

- Upload product images via **Multer**
- Store and serve images via **Cloudinary**
- Support for up to 5 images per product

---

## 🧪 Project Highlights

- Responsive design using Tailwind CSS & ShadCN UI
- Real-time online/offline detection
- Optimized user experience with loading skeletons
- Secure API access with proper validation & headers
- Organized codebase with modular structure

---

## 🌐 Deployment

- **Frontend** and **Backend** deployed on **Render**
- **Database** hosted on **MongoDB Atlas**

---

## Author
Name: Lav Kushwaha
GitHub: @lav-kushwaha
Email: lavkushwahaa@gmail.com

