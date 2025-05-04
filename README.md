# GramSeva Portal 🌐  
**Village & Gram Panchayat Connect Platform**  

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT) 
[![React](https://img.shields.io/badge/React-18.2-blue)](https://react.dev/) 
[![Node.js](https://img.shields.io/badge/Node.js-20+-brightgreen)](https://nodejs.org/) 
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-success)](https://www.mongodb.com/)  

A digital bridge between villagers and local governance,Peoples, enabling transparent communication, efficient complaint resolution, and streamlined information dissemination.

---


## ✨ Key Features  

### **For Villagers**  
✅ Real-time access to Panchayat notices and schemes  
✅ Transparent view of government job opportunities  
✅ Digital complaint submission with status tracking  
✅ Historical records of Gram Panchayat work  

### **For Sarpanch**  
📊 Interactive dashboard with village analytics  
📢 Publish notices and schemes with one click  
🔍 Manage villager profiles and complaints  
📈 Document developmental work with multimedia  

---

## 🖼️ Visual Walkthrough  

| Role | Screenshot |  
|------|-----------|  
| **Sarpanch Dashboard** | ![image](https://github.com/user-attachments/assets/d78efab1-7cb9-482f-8cb1-56135d26c4fe)|  
| **Villager Portal** | ![image](https://github.com/user-attachments/assets/6fb5b87f-b8cc-41d9-8eeb-d0a9fa926d72)|  


---

## 🛠️ Technology Stack  

### **Frontend**  
- React 18 + Vite (Ultra-fast build)  
- Tailwind CSS (Modern UI components)  
- React Router (Seamless navigation)  

### **Backend**  
- Node.js + Express (REST API)  
- JWT Authentication (Secure access)  
- Multer (File uploads)  

### **Database**  
- MongoDB Atlas (Cloud NoSQL)  
- Mongoose ODM (Schema modeling)  

### **Dev Tools**  
- Postman (API testing)  
- Git (Version control)  

---

## 🚀 Quick Setup  

### **Prerequisites**  
- Node.js ≥ v16  
- MongoDB connection string  
- Git CLI  

### **Installation**  
```bash
# Clone repository
git clone https://github.com/your-repo/gramseva-portal.git
cd gramseva-portal

# Backend setup
cd server && npm install
cp .env.example .env  # Configure your variables
npm start

# Frontend setup (in new terminal)
cd ../client && npm install
cp .env.example .env
npm run dev

# server/.env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string

# client/.env
VITE_API_BASE_URL=http://localhost:5001/api

