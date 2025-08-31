# Computer Science & Design (CSD) Department Website

A modern, responsive web application for the Computer Science & Design (CSD) department. The site showcases the department's academic programs, research, placements, achievements, certifications, faculty, and facilities, providing a comprehensive overview for students, faculty, and visitors.

## 🌟 Key Features

- **About the Department**: Overview of the CSD program, vision, mission, faculty, and facilities.
- **Academics**: Details about curriculum, certifications, and academic achievements.
- **Research**: Explore research papers and contributions from faculty and students.
- **Placements**: Placement statistics, top recruiters, and student placement records.
- **Achievements**: Highlights of student and faculty achievements.
- **Certifications**: Student certifications from NPTEL, Udemy, and more.
- **Contact**: Department contact information and address.
- **Mobile-Responsive Design**: Built with TailwindCSS for a seamless experience on all devices.
- **Dark/Light Theme**: Switch between light and dark modes for comfortable viewing.

## 🛠 Tech Stack
- **Frontend**: React.js, TailwindCSS, Framer Motion
- **Database**: Firebase Firestore
- **Auth & Storage**: Firebase Authentication & Storage

## 📋 Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Firebase account

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/csd-website.git
cd csd-website
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Running the Application
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the website in your browser.

### Building for Production
```bash
npm run build
```

This will create a production-ready build in the `build` folder.

## 🗂 Main Sections & File Structure

- `src/pages/about/AboutPage.js` — About the department, faculty, and facilities
- `src/pages/academics/Research.js` — Research papers and contributions
- `src/pages/academics/Placements.js` — Placement statistics and records
- `src/pages/academics/Achievements.js` — Student and faculty achievements
- `src/pages/academics/Certifications.js` — Student certifications
- `src/components/` — Reusable UI components (navbar, footer, cards, etc.)
- `src/contexts/ThemeContext.js` — Theme (light/dark) context
- `src/firebase/` — Firebase configuration and utilities

## 📁 File & Directory Overview

### src/

- **App.js** — Main application component, sets up routing and global structure.
- **index.js** — Entry point for the React application.
- **index.css** — Global CSS (mainly TailwindCSS imports and custom styles).
- **App.css** — (Empty or legacy, can be used for app-wide styles.)
- **logo.svg** — Department or site logo.
- **reportWebVitals.js** — Performance measuring utility (optional for analytics).
- **App.test.js** — Example test file for React testing setup.

#### assets/
- **css/styles.css** — Custom CSS styles for the website.

#### components/
- **layout/Navbar.js** — Responsive navigation bar, handles links and theme toggle.
- **layout/Footer.js** — Footer with department/contact info and links.
- **layout/Layout.js** — Page layout wrapper for consistent structure.
- **ui/text-hover-effect.jsx** — Animated text hover effect for headings or links.
- **ui/animated-testimonials.jsx** — Animated testimonials carousel.
- **ui/draggable-card.jsx** — Draggable card UI component.
- **ui/navbar-menu.js** — Mobile/desktop navbar menu logic.
- **ui/container-scroll-animation.jsx** — Scroll-based animation container.
- **ui/ThemeToggle.js** — Light/dark mode toggle button.
- **ui/GradientSelect.js** — Gradient color selector UI.
- **ui/ThemeDemo.js** — Demo for theme switching.
- **ui/StudentCard.js** — Card for displaying student info.
- **ui/PDFViewer.js** — Embedded PDF viewer for certificates.
- **sections/FacultySection.js** — Section for displaying faculty members.
- **admin/AdminDashboard.js** — Admin dashboard for managing site data.
- **admin/CertificationForm.js** — Admin form for adding certifications.
- **events/EventCard.jsx** — Card for displaying event info.
- **events/DetailModal.jsx** — Modal for event details.

#### contexts/
- **ThemeContext.js** — Provides theme (light/dark) context to the app.
- **AuthContext.js** — Provides authentication context and user state.

#### firebase/
- **client.js** — Firebase client configuration and initialization.
- **admin.js** — Firebase admin SDK setup (for server/admin scripts).
- **schema.js** — Firestore schema definitions and helpers.
- **auth.js** — Authentication utility functions (login, signup, etc.).
- **phoneauth.js** — Phone number authentication utilities.

#### lib/
- **utils.js** — General utility/helper functions used throughout the app.

#### pages/
- **about/AboutPage.js** — About the department, faculty, and facilities.
- **academics/Research.js** — Research papers and contributions.
- **academics/Placements.js** — Placement statistics and records.
- **academics/Achievements.js** — Student and faculty achievements.
- **academics/Certifications.js** — Student certifications (NPTEL, Udemy, etc.).
- **admin/AdminHome.js** — Admin home dashboard.
- **admin/AdminFaculty.js** — Admin management for faculty data.
- **admin/AdminEvents.js** — Admin management for events.
- **admin/AdminPlacements.js** — Admin management for placements.
- **admin/AdminResearch.js** — Admin management for research papers.
- **admin/AdminAchievements.js** — Admin management for achievements.
- **admin/AdminStudents.js** — Admin management for student data.
- **admin/AdminCertifications.js** — Admin management for certifications.
- **admin/AdminNotifications.js** — Admin notifications and announcements.
- **faculty/Faculty.js** — Faculty listing and profiles.
- **faculty/FacultyDetail.js** — Detailed view for a faculty member.
- **home/HomePage.js** — Main landing page with department highlights.
- **events/Events.js** — List and details of department events.
- **students/Students.js** — Student listing and profiles.
- **students/StudentDetail.js** — Detailed view for a student.
- **Login.js** — User login page.
- **Signup.js** — User registration page.
- **AdminSignup.js** — Admin registration page.

## 👩‍💻 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
This project is licensed under the MIT License.

## 🙏 Acknowledgements
- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
