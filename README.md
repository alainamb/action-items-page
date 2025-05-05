# Action Items List

A modern task management application built with React that helps you organize your daily tasks, projects, and priorities.

**Live Demo:** [https://alainamb.github.io/action-items-page/](https://alainamb.github.io/action-items-page/)

## Description

Action Items List is a responsive web application designed to help you track tasks and organize projects. This application was developed as part of the MIT xPRO's Professional Certificate in Coding: Full Stack Development with MERN program, taught by Professor John Williams and Dr. Abel Sanchez (delivered by Emeritus).

The app provides a comprehensive task management system with features like project categorization, scheduling, search functionality, and data import/export capabilities—all while working entirely in your web browser with local storage for data persistence.

## Features

- **Action Item Management**
  - Create, edit, delete, and complete action items
  - Assign items to specific projects
  - Add detailed notes to each item
  - Schedule items for specific dates
  - Mark items as complete and restore them if needed

- **Project Organization**
  - Automatic project suggestion dropdown when creating new items
  - Filter items by project
  - View all projects in a sorted list

- **Search and Filter**
  - Search through action item text, projects, and notes
  - Filter by project
  - View items by status (Scheduled, Not Scheduled, Completed)

- **Data Management**
  - Local storage persistence
  - Export data to CSV or JSON formats
  - Import data from CSV or JSON files
  - Automatic date tracking for item creation and completion

## How to Use

### Adding Action Items

1. Fill in the "Action Item" field (required)
2. Select or create a project using the auto-suggest dropdown
3. Optionally set a scheduled date
4. Add any additional notes
5. Click "Add Action Item"

### Managing Items

- **Edit**: Click the "Edit" button to modify any item
- **Complete**: Mark items as done (moves them to the Completed section)
- **Delete**: Remove items permanently from Scheduled and Not Scheduled lists
- **Restore**: Bring completed items back to active status
- **Clear**: Clear items permanently from Completed list

### Searching and Filtering

- Use the search box to find items by text, project, or notes
- Use the project dropdown to filter by specific projects

### Data Import/Export

- **Export to CSV/JSON**: Save your data for backup or sharing
- **Import from CSV/JSON**: Load previously exported data to use on a new browser/device

## Technologies Used

- React
- JavaScript (ES6+)
- HTML5
- CSS3
- LocalStorage API
- File API (for import/export)

## Project Development Plan

This project is being developed in three phases:

1. ✅ **Local Implementation**: Initial browser-based version with local storage (completed)
2. ✅ **GitHub Pages Deployment**: Web-accessible version with local storage (current version)
3. 🔄 **Cloud Integration**: Future version with Google Sheets (or similar) integration for cross-device access

## Running Locally

If you want to run this project locally:

1. Clone this repository (make sure you're using the master branch which contains the React app)
```bash
git clone -b master https://github.com/alainamb/action-items-page.git
```

2. Navigate to the project directory
```bash
cd action-items-page
```

3. Install dependencies
```bash
npm install
```

4. Start the development server
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser

## Deploying to GitHub Pages

To set up your own version of this app on GitHub Pages, follow these steps:

### 1. Make sure you're working with the master branch

The master branch contains the React implementation of the app. If you've cloned a different branch, switch to master:

```bash
git checkout master
```

### 2. Install the gh-pages package

```bash
npm install gh-pages --save-dev
```

### 3. Update package.json

Add these properties to your package.json file:

```json
"homepage": "https://yourusername.github.io/your-repo-name",
"scripts": {
  // existing scripts
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

Make sure to replace `yourusername` and `your-repo-name` with your GitHub username and repository name.

### 4. Build and Deploy

First, build the production-ready app:
```bash
npm run build
```

Then deploy to GitHub Pages:
```bash
npm run deploy
```

The deploy command will create a production build and push it to a gh-pages branch on your GitHub repository.

### 5. Configure GitHub Repository Settings

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. Make sure the source is set to "gh-pages branch"

## Credits

- **Course**: MIT xPRO's Professional Certificate in Coding: Full Stack Development with MERN
- **Instructors**: Professor John Williams and Dr. Abel Sanchez
- **Delivery Partner**: Emeritus
- **Development Assistance**: Claude for coding support
- **Author**: Alaina Brandt

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

Special thanks to the MIT xPRO team and Emeritus for providing the educational framework for this project. This application was built as part of learning about React, state management, and front-end development.
