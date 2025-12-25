# AutoNote Web Dashboard

The central hub for the AutoNote ecosystem. This responsive web application allows users to view, organize, edit, and manage the notes captured via the Chrome Extension.

## 🛠 Tech Stack

*   **Framework:** React 18.
*   **Build Tool:** Vite.
*   **Styling:** Tailwind CSS.
*   **State Management:** Recoil.
*   **Routing:** React Router DOM.
*   **Notifications:** React Hot Toast.
*   **Deployment:** GitHub Pages.

## 🚀 Features

*   **Dashboard:** A grid/list view of all your saved notes.
*   **Note Editor:**
    *   Rich viewing of captured content.
    *   **Edit Mode:** Modify text, add new sections.
    *   **Smart Actions:** Copy individual sections, Copy All, Delete sections.
    *   **Title Editing:** Rename notes directly from the viewer.
*   **Authentication:** Secure Sign In and Sign Up pages.
*   **Responsive Design:** Optimized for various screen sizes.

## 📂 Project Structure

*   `src/pages/`: Main route components (Dashboard, Shownote, Signin, etc.).
*   `src/components/`: Reusable UI components (Buttons, Cards, Headers).
*   `src/store/`: Recoil atoms for global state management.
*   `src/App.jsx`: Main application routing and layout.

## 🔧 Setup & Installation

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run Locally:**
    ```bash
    npm run dev
    ```

3.  **Build:**
    ```bash
    npm run build
    ```

4.  **Deploy:**
    This project is configured to deploy to GitHub Pages.
    ```bash
    npm run deploy
    ```
    *This command builds the project and pushes the `dist` folder to the `gh-pages` branch.*
