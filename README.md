# Aditya Degree College - Mentor Digital System

This is a simple React application for Aditya Degree College's Mentor Digital System. It allows mentors to log in and manage student data, and parents to view their children's progress.

## Features

- Mentor login
- Student database management
- Parent portal for viewing student data
- Digital signature upload

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Run the development server
    ```sh
    npm run dev
    ```

## Troubleshooting

The mock backend uses the browser's `localStorage` to persist student data. If you find that the data is out of sync or not showing the latest changes from the source code, you may need to clear the `localStorage` for this site.

**How to clear `localStorage` in Google Chrome:**

1.  Open the Developer Tools by pressing `F12` or `Ctrl+Shift+I`.
2.  Go to the `Application` tab.
3.  In the `Storage` section on the left, expand `Local Storage`.
4.  Right-click on the site's domain and select `Clear`.
5.  Refresh the page.