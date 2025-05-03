# <div align="center">🎁 GIFT TRACKER</div>

<div align="center">

  <h2 align="center">A modern fullstack solution for tracking gifts, events & reminders</h2>

[![Stars](https://img.shields.io/github/stars/Jeanfr1/marie-mobile-canvas?style=for-the-badge&logo=github&color=f97316&logoColor=ffffff&labelColor=171717)](https://github.com/Jeanfr1/marie-mobile-canvas/stargazers)
[![Forks](https://img.shields.io/github/forks/Jeanfr1/marie-mobile-canvas?style=for-the-badge&logo=github&color=a855f7&logoColor=ffffff&labelColor=171717)](https://github.com/Jeanfr1/marie-mobile-canvas/network/members)
[![AWS](https://img.shields.io/badge/AWS-Powered-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=FF9900&labelColor=202124)](#tech-arsenal)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=61DAFB&labelColor=202124)](#tech-arsenal)

</div>

## 🌟 Overview

<table>
<tr>
<td>

**Gift Tracker** is a modern fullstack application built for managing gifts, events, and reminders with a beautiful, responsive interface. The system leverages AWS cloud infrastructure for scalability, security, and reliability.

### Key Features

- ✅ **Gift & Contact Management**
- ✅ **Event Scheduling & Reminders**
- ✅ **Real-time Notifications**
- ✅ **Secure Image Storage**
- ✅ **User Authentication**
- ✅ **Mobile-Responsive Design**

</td>
<td width="50%" align="center">

<h1>📱</h1>
<h3>Modern UI</h3>
<p>Responsive design for all devices</p>

</td>
</tr>
</table>

## 🚀 Live Demo

<div align="center">

[![Netlify Status](https://img.shields.io/badge/netlify-ready%20to%20deploy-00C7B7?style=for-the-badge&logo=netlify&logoColor=00C7B7&labelColor=202124)](https://app.netlify.com/start)

**Backend API:** [https://buaes967sk.execute-api.us-east-1.amazonaws.com/prod](https://buaes967sk.execute-api.us-east-1.amazonaws.com/prod)

</div>

## ⚡ Tech Arsenal

<div align="center">

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![DynamoDB](https://img.shields.io/badge/Amazon%20DynamoDB-4053D6?style=for-the-badge&logo=Amazon%20DynamoDB&logoColor=white)
![Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?style=for-the-badge&logo=aws-lambda&logoColor=white)
![API Gateway](https://img.shields.io/badge/API_Gateway-8F43EF?style=for-the-badge&logo=amazon-api-gateway&logoColor=white)
![S3](https://img.shields.io/badge/S3-569A31?style=for-the-badge&logo=amazon-s3&logoColor=white)
![Cognito](https://img.shields.io/badge/Cognito-BF0816?style=for-the-badge&logo=amazon-cognito&logoColor=white)

</div>

## 🔥 Feature Showcase

<table>
<tr>
  <td width="50%" align="center">
    <h1 style="font-size: 4rem;">🎁</h1>
    <h3 style="color: #4DA7DB;">Gift Management</h3>
    <p>Track gifts given and received with detailed information</p>
  </td>
  <td width="50%" align="center">
    <h1 style="font-size: 4rem;">📅</h1>
    <h3 style="color: #A855F7;">Event Scheduling</h3>
    <p>Plan events and set reminders with automated notifications</p>
  </td>
</tr>
<tr>
  <td width="50%" align="center">
    <h1 style="font-size: 4rem;">🖼️</h1>
    <h3 style="color: #34D399;">Image Management</h3>
    <p>Secure image storage with S3 pre-signed URLs</p>
  </td>
  <td width="50%" align="center">
    <h1 style="font-size: 4rem;">🔒</h1>
    <h3 style="color: #F97316;">Secure Authentication</h3>
    <p>Robust user authentication via AWS Cognito</p>
  </td>
</tr>
</table>

## 📊 Architecture Overview

<div align="center">
  <pre>
  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
  │             │     │             │     │             │
  │  React UI   │────▶│ API Gateway │────▶│   Lambda    │
  │             │     │             │     │             │
  └─────────────┘     └─────────────┘     └──────┬──────┘
                                                 │
                            ┌──────────────────┬─┴───┬─────────────┐
                            │                  │     │             │
                            ▼                  ▼     ▼             ▼
                      ┌──────────┐      ┌──────────┐      ┌──────────┐
                      │          │      │          │      │          │
                      │ DynamoDB │      │    S3    │      │ Cognito  │
                      │          │      │          │      │          │
                      └──────────┘      └──────────┘      └──────────┘
  </pre>
</div>

## 🚦 Quick Start Guide

```bash
# Clone the repository
git clone https://github.com/Jeanfr1/marie-mobile-canvas.git

# Navigate to project directory
cd marie-mobile-canvas

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🌐 Deployment Guide

<details>
<summary><b>💫 Deploy to Netlify (Recommended)</b></summary>
<br>

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Environment variables:** Add AWS configuration
3. Click **Deploy** button
4. Your app will be live in minutes!

</details>

<details>
<summary><b>☁️ AWS Configuration</b></summary>
<br>

Backend services are already configured:

- **API Endpoint:** `https://buaes967sk.execute-api.us-east-1.amazonaws.com/prod`
- **User Authentication:** AWS Cognito
- **Database:** DynamoDB
- **Storage:** S3
- **Functions:** Lambda

</details>

## 📚 Documentation

<div align="center">

[![API Docs](https://img.shields.io/badge/API_Documentation-212121?style=for-the-badge&logo=read-the-docs&logoColor=white)](./API.md)
[![Architecture](https://img.shields.io/badge/Architecture-212121?style=for-the-badge&logo=blueprint&logoColor=white)](./ARCHITECTURE.md)
[![Project Rules](https://img.shields.io/badge/Project_Rules-212121?style=for-the-badge&logo=bookstack&logoColor=white)](./PROJECTS_RULES.md)
[![Maintenance](https://img.shields.io/badge/Maintenance_Guide-212121?style=for-the-badge&logo=git&logoColor=white)](./MAINTENANCE.md)

</div>

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 👨‍💻 Author

<div align="center">
  <h3>Jean Araujo</h3>

[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Jeanfr1)
[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/jeanfr1)

</div>

---

<div align="center">
  <sub>Built with ❤️ and modern web technologies</sub>
</div>

<!-- Netlify build trigger: 2025-05-03 16:30 -->
