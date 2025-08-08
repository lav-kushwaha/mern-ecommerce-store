# 🛍️ MERN Stack eCommerce Website

This is a **comprehensive full-stack eCommerce application** built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). The project features full user and admin functionalities, secure authentication, product management, PayPal integration, and a clean, responsive UI with modern UX best practices.

It supports a **role-based access system**, where:
- 🧑‍💼 **Admins** can manage products, view and update order statuses.
- 👤 **Users** can browse, search, filter, purchase products, and manage their profile, cart, and reviews.

---

## 🚀 Live Demo

🔗 [Live Website](https://mern-ecommerce-store-1-66zv.onrender.com)

---

## 🧰 Tech Stack

### 🖥️ Frontend
- **React.js**
- **Redux Toolkit** + `createAsyncThunk`
- **Tailwind CSS**
- **ShadCN UI**
- **React Router DOM**
- **Axios**
- **Lucide Icons**
- **React Loading Skeleton**

### 🌐 Backend
- **Node.js**
- **Express.js**
- **MongoDB** (via **Mongoose Atlas**)
- **Express Validator**
- **CORS Middleware**
- **Cookie Parser**
- **dotenv**

### 🔐 Authentication & Security
- **JWT (JSON Web Tokens)** + HTTP-only **cookies**
- **bcrypt.js** for password hashing
- **Role-based access control**

### 📷 File Uploads
- **Multer** for file handling
- **Cloudinary** for cloud image storage

### 💳 Payment Integration
- **PayPal REST SDK**

### ☁️ Deployment
- **Frontend & Backend**: Render
- **Database**: MongoDB Atlas

---

## ⚙️ Features & Functionality

### 👤 User Panel

- 🛒 Browse and search products
- 🔍 Filter by categories, brands or gender
- 🗂️ Sort by:
  - Newest
  - Top Rated
  - Price (Low → High / High → Low)
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
- ✍️ Write reviews **only if purchased**
- 🔁 Pagination:
  - Products: 10 per page
  - Reviews: 4 per page
 
---

### 🛠️ Admin Panel

- ➕ Add products with multiple images
- ✏️ Edit product details and inventory
- ❌ Delete products
- 📋 View all orders and order statuses
- 🔄 Update order delivery status
- 👥 Role-based dashboard access

---

## 🔐 Security Highlights

- JWT-based user authentication
- Role-based route protection (User/Admin)
- Password encryption via **bcrypt.js**
- Secure cookie handling with **cookie-parser**
- Input validation via **express-validator**
- CORS configured for safe frontend-backend interaction

---

## 📷 Image Handling

- Product images uploaded via **Multer**
- Stored and served through **Cloudinary**
- Supports up to 5 images per product

---

## 💳 Payment Flow

- Integrated with **PayPal**
- Automatic redirection upon payment success or failure
- Verified transactions before order confirmation
- Secure payment handling with real-time updates

---

## 🧑‍💻 UX & UI Highlights

- Built with **Tailwind CSS** and **ShadCN UI**
- Fully responsive design for all screen sizes
- **Offline detection** with visual feedback
- Loading skeletons using **React Skeleton**
- Clean and modern user interface with intuitive navigation

---

## 📌 Upcoming Enhancements

- [ ] Wishlist functionality
- [ ] Stripe integration option
- [ ] Sales analytics for Admin
- [ ] Email notifications on orders

---

## 👤 Author

**Lav Kushwaha**

- GitHub: [@lav-kushwaha](https://github.com/lav-kushwaha)
- Email: [lavkushwahaa@gmail.com](mailto:lavkushwahaa@gmail.com)

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
