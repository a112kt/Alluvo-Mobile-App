# Alluvo — Mobile Application 📱

> An interactive reels-based e-commerce mobile application that connects users with local brands through engaging short-form content, personalized shopping experiences, AI-powered assistance, and seamless ordering.

---

## 📱 About Alluvo

**Alluvo** is a mobile e-commerce platform designed to create a more interactive and engaging shopping experience for users and local brands.

Instead of relying only on traditional product listings, Alluvo introduces a **Reels-based shopping experience**, allowing users to discover products through short videos, interact with brands, save products, communicate with sellers, and complete purchases directly from the application.

The application also integrates **AI-powered assistance** to help users navigate the platform and communicate with brands more easily.

---

## 🎥 Project Demo

### Mobile Application Demo

[▶️ Watch Alluvo Mobile Demo](https://drive.google.com/file/d/1Fie0rRZhMOC_TovSYEiFiK9NiK8wi4gH/view?usp=sharing)

---

## ✨ Main Features

### 🔐 Authentication

* User registration
* Login
* Forgot password
* OTP verification
* Social / external login
* User interests selection
* Persistent authentication

### 🏠 Home

* Personalized home experience
* Product discovery
* Search
* Notifications
* AI-powered chat assistant
* Brand conversations
* Recommended content

### 🛍️ Shop

* Browse products
* Product details
* Product variants
* Categories
* Search
* Sorting
* Filtering
* Wishlist
* Shopping cart
* Cash on Delivery
* Online payment

### 🎬 Reels

* Short-form product videos
* For You feed
* Following feed
* Like reels
* Comment on reels
* Discover products directly through reels
* Interactive shopping experience

### 🏪 Brand Pages

* Brand information
* Follow brands
* Message brands
* Browse brand products
* View offers
* Read reviews
* About section

### 💬 Chat

* AI-powered assistant
* Brand-to-user conversations
* Chat rooms
* Real-time messaging
* Product-related conversations

### ❤️ Wishlist

* Add products to wishlist
* Remove products from wishlist
* View saved products

### 🔔 Notifications

* Real-time notifications
* Mark notification as read
* Delete notification
* Clear notifications

### 🛒 Orders

* Create orders
* View order history
* Track order status
* View order summary
* Shipping information
* Payment status

### 👤 Profile

* View and edit profile
* Update profile image
* Change password
* Manage shipping addresses
* View orders
* Manage account settings
* Delete account

---

## 🏷️ Brand Mode

Alluvo also supports a dedicated **Brand Mode** within the same mobile application.

Users with brand accounts can switch between the regular user experience and the brand experience.

### Brand Features

* Brand dashboard
* View statistics
* Manage reels
* Upload reels
* Manage brand profile
* Switch between User Mode and Brand Mode

Regular users who do not have a brand account do not have access to Brand Mode.

---

## 🤖 AI Integration

Alluvo integrates AI-powered functionality to improve the user experience.

The AI assistant helps users interact with the platform and provides an intelligent communication layer within the application.

The AI functionality is designed to make product discovery and customer support more interactive and accessible.

---

## 🏗️ Technology Stack

### Mobile Application

* **React Native**
* **Expo**
* **TypeScript**
* **React Navigation**
* **Redux Toolkit**
* **React Query**
* **Axios**
* **Formik**
* **Yup**
* **AsyncStorage**
* **React Native Paper**
* **Expo Linear Gradient**
* **React Native Reanimated**
* **FlashList**
* **Lottie**
* **React Native SVG**

### Backend

* **.NET Web API**
* RESTful APIs
* SignalR for real-time communication

### Database & Services

* Backend API
* Authentication services
* Payment services
* Real-time communication
* Cloud-based infrastructure

---

## 🔌 API

The mobile application communicates with the backend through REST APIs.

### Development API

```text
https://dev.api.alluvo.life
```

The application uses **Axios** as the main HTTP client for communicating with the backend.

---

## 🧩 Application Architecture

The application follows a feature-based architecture to keep the codebase scalable and maintainable.

```text
src/
│
├── features/
│   ├── auth/
│   ├── home/
│   ├── shop/
│   ├── reels/
│   ├── wishlist/
│   ├── profile/
│   ├── orders/
│   ├── chat/
│   ├── notifications/
│   └── brand/
│
├── components/
├── navigation/
├── services/
├── store/
├── hooks/
├── utils/
├── constants/
└── assets/
```

---

## 🔄 Main User Flow

```text
Register / Login
       │
       ▼
   Interests
       │
       ▼
      Home
       │
 ┌─────┼─────┬─────────┐
 ▼     ▼     ▼         ▼
Shop  Reels Wishlist  Profile
 │      │
 ▼      ▼
Product  Product
Details  Discovery
 │
 ▼
Cart
 │
 ▼
Checkout
 │
 ▼
Order
```

---

## 🛒 Shopping Flow

```text
Discover Product
       │
       ▼
Product Details
       │
       ▼
Select Variant
       │
       ▼
Add to Cart
       │
       ▼
Shipping Address
       │
       ▼
Payment Method
       │
       ▼
Create Order
       │
       ▼
Order Tracking
```

---

## 🎬 Reels Shopping Experience

One of the main concepts behind Alluvo is combining **short-form video content with e-commerce**.

Users can:

1. Watch product reels
2. Like and comment
3. Discover new brands
4. Open products directly from reels
5. Follow brands
6. Add products to their wishlist
7. Purchase products

This creates a more engaging shopping experience compared with traditional e-commerce platforms.

---

## 🔔 Real-Time Features

Alluvo uses real-time communication technologies to improve interaction between users and brands.

Real-time functionality includes:

* Notifications
* Chat communication
* Message updates
* User interactions
* Brand communication

**SignalR** was explored for real-time communication between the mobile application and backend.

---

## 🔒 Security & Validation

The application includes:

* Authentication
* OTP verification
* Protected API requests
* Form validation
* Secure password handling
* Authenticated user sessions
* Protected user actions
* Account management

Client-side validation is implemented using:

```text
Formik + Yup
```

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Navigate to the project

```bash
cd Alluvo-Mobile-App
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the Expo development server

```bash
npx expo start
```

You can then run the application using:

* Android Emulator
* iOS Simulator
* Expo Go
* Development build

---

## ⚙️ Environment Configuration

Create your environment configuration according to the project setup.

Example:

```env
API_URL=https://dev.api.alluvo.life
```

> Do not commit sensitive credentials, API keys, tokens, or secrets to the repository.

---

## 🎨 UI & UX

The application focuses on creating a modern and engaging shopping experience.

### Design Principles

* Modern mobile-first UI
* Smooth navigation
* Interactive animations
* Clear product presentation
* Consistent design system
* Responsive layouts
* User-friendly forms
* Interactive reels experience

---

## 👥 Project Team

Alluvo was developed as a graduation project by a multidisciplinary team covering:

* Mobile Development
* Frontend Development
* Backend Development
* Artificial Intelligence
* UI/UX
* Business & Branding

### Mobile Application

**Ashrakat Raafat Elabd**

Responsible for the development of the **Alluvo Mobile Application using React Native and Expo**, including application screens, navigation, state management, API integration, authentication, shopping flows, reels, chat, notifications, orders, profile management, and Brand Mode.

---

## 🎓 Graduation Project

**Project:** Alluvo
**Type:** Graduation Project
**Platform:** Mobile Application
**Technology:** React Native + Expo + TypeScript

### Project Goal

To create a modern social-commerce platform that combines:

**Short-form video content + E-commerce + Local Brands + AI + Customer Interaction**

into one mobile experience.

---

## 📌 Future Improvements

Potential future improvements include:

* Advanced AI recommendations
* Personalized product recommendations
* Improved real-time chat
* Advanced analytics
* More payment methods
* Enhanced brand analytics
* Push notification optimization
* Improved recommendation algorithms

---

## 📄 License

This project was developed as an academic graduation project.

---

## ⭐ Acknowledgment

Special thanks to everyone who contributed to the development, testing, design, backend services, AI components, and overall concept of **Alluvo**.

---

**Built with ❤️ using React Native & Expo**
