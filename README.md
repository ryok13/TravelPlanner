### 📌 Travel Planner – Node.js + Express + MongoDB

COMP2068 JavaScript Frameworks – Assignment 02

---

### 🇺🇸 Overview (English)

This project is a Travel Planner Web Application that allows users to create, manage, and view their trips.
It includes full user authentication, CRUD operations for trips, protected routes, and a fully integrated front-end template.

---

### 🇯🇵 概要（日本語）

本プロジェクトは、**旅行プランを作成・管理・閲覧できる Web アプリケーション**です。  
ユーザー認証機能、旅行データの CRUD 操作、認証済みユーザーのみがアクセス可能な保護ルート、  
および Handlebars を用いたフロントエンドテンプレートを実装しています。

---

### 🚀 Features / 機能一覧

### 🔐 User Authentication（ユーザー認証) 
**(Passport.js + passport-local-mongoose)**

- User registration
- Login / Logout
- Automatic password hashing
- Session-based authentication
- Flash error messages
- Access restrictions: only logged–in users can view or manage trips

**日本語説明：**  
- ユーザー登録機能  
- ログイン / ログアウト  
- パスワードの自動ハッシュ化  
- セッションベースの認証  
- エラーメッセージ表示  
- ログインユーザーのみが機能を利用可能  

---

### 🧳 Trip Management (旅行管理機能)

Authenticated users can:

- View their own trips
- Create a new trip
- Edit existing trips
- Delete trips
- View trip details pages

**日本語説明：**  
認証済みユーザーは以下の操作が可能です：

- 自分の旅行プラン一覧を表示  
- 新しい旅行プランを作成  
- 既存プランの編集  
- プランの削除  
- 詳細ページの閲覧  

---

### 🎨 UI / Templates (UI・画面構成)

- Built with Handlebars (hbs)
- Fully integrated Colorlib “Trips” template
- Navbar changes automatically based on login state
- Responsive design using Bootstrap
- Shared layout for header/footer/navigation

**日本語説明：**  
- Handlebars（hbs）によるサーバーサイドレンダリング  
- Colorlib の「Trips」テンプレートを統合  
- ログイン状態に応じたナビゲーション切り替え  
- Bootstrap を用いたレスポンシブデザイン  
- 共通レイアウト（ヘッダー・フッター・ナビゲーション） 

---

### 🛡️ Authentication Flow (認証フロー)

- Registration
- User.register() hashes the password and saves the user
- User is automatically logged in
- Redirects to /trips
- Login
- passport.authenticate('local') verifies username + password
- Success → redirect to /trips
- Failure → redirect to /login with an error message
- Protected Routes

Middleware prevents unauthorized access:

    if (req.isAuthenticated()) next();
    else res.redirect("/login");

---

### ✨ Additional Notes

- Each trip is associated with the logged-in user
- Users cannot modify or delete others’ trips
- Handlebars helper eq is used to highlight active navbar items
- method-override enables PUT and DELETE requests

--- 

### 📚 What I Learned

- This assignment helped reinforce:
- Express routing patterns
- Designing Mongoose models
- Implementing authentication using Passport.js
- Managing sessions and flash messages
- Building server-rendered UI using Handlebars
- Structuring a full-stack MVC-style Node.js application

---

### 💡 Possible Future Enhancements

- Photo upload for trips
- Sorting / filtering by date or budget
- Public API version (REST endpoints)
- Map integration using Google Maps API

---

### 🔗 Live Demo  
The application is deployed on Render and can be accessed here:  
👉 **https://travelplanners.onrender.com**
