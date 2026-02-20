# Elegant Graphic Designer Portfolio

A minimalist, elegant portfolio designed for graphic designers and art directors. Built with pure HTML, CSS, and JavaScript, making it perfectly suited for free hosting on GitHub Pages.

## How to Update Your Portfolio (The "Manual Admin" Process)

Since this site is hosted on GitHub Pages (which only supports static files), you don't have a traditional backend admin panel. Instead, you update your site by editing the `data.json` file directly on GitHub.

### 1. Update Your Personal Info
1. Open the `data.json` file in your repository.
2. Edit the `personalInfo` section with your name, title, bio, email, and social links.
3. Commit the changes. The site will automatically update!

### 2. Uploading New Work
1. **Upload the Image:**
   - Go to the `assets/images/` folder in your GitHub repository.
   - Click **Add file** > **Upload files**.
   - Upload your new image (e.g., `my-new-project.jpg`) and commit the change.
2. **Add to the Gallery:**
   - Open the `data.json` file.
   - In the `works` array, add a new block for your project:
     ```json
     {
       "id": 4,
       "title": "My New Project",
       "category": "Branding",
       "image": "assets/images/my-new-project.jpg",
       "description": "A brief description of the project."
     }
     ```
   - Make sure to add a comma `,` after the previous project block if it's not the last one.
   - Commit the changes.

## Deploying to GitHub Pages
1. Go to your repository **Settings** on GitHub.
2. Navigate to the **Pages** section on the left sidebar.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the `main` (or `master`) branch and the `/ (root)` folder.
5. Click **Save**. Your site will be live at `https://<your-username>.github.io/<repository-name>/` within a few minutes!

## Local Development
If you want to preview the site on your computer before pushing to GitHub:
1. You cannot just double-click `index.html` because web browsers block fetching `data.json` from local files for security reasons (CORS).
2. Instead, use a local server. If you use VS Code, install the **Live Server** extension, right-click `index.html`, and select "Open with Live Server". Alternatively, you can run `npx serve` or `python3 -m http.server` in your terminal.