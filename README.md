# Vidyodaya Shishu Sadan School - Website

A modern, fully responsive static school website for Vidyodaya Shishu Sadan School located in Gauradaha-1, Jhapa, Nepal. 

## Tech Stack
- HTML5
- Tailwind CSS
- Vanilla JavaScript
- Vite (for local development and building)

## Features
- Fully responsive mobile-first design
- Modern UI/UX with smooth scroll animations (AOS)
- Lucide Icons
- Fully static (No backend, No DB)
- SEO and Open Graph tags included
- High performance (Optimized for Lighthouse)

## Folder Structure

```
vidhyodhya/
├── index.html        # Home Page
├── about.html        # About Us Page
├── academics.html    # Academics Page
├── facilities.html   # Facilities Page
├── gallery.html      # Gallery Page
├── notices.html      # Notices Page
├── contact.html      # Contact Page
├── package.json      # Node dependencies
├── tailwind.config.js# Tailwind Configuration
├── vite.config.js    # Vite Build Configuration
├── postcss.config.js # PostCSS Configuration
└── src/
    ├── css/
    │   └── style.css # Main Tailwind CSS & Custom Styles
    ├── js/
    │   └── main.js   # Interactivity & Animations
    └── assets/
        ├── images/   # Store images here
        └── icons/    # Store icons/favicon here
```

## Local Development

1. **Install Dependencies**
   Make sure you have [Node.js](https://nodejs.org/) installed, then run:
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   This will start a Vite local dev server and compile Tailwind CSS on the fly.

3. **Build for Production**
   ```bash
   npm run build
   ```
   This will generate a `dist` folder containing the optimized production-ready HTML, CSS, and JS.

## Deployment Instructions

The project is configured with Vite to easily bundle all HTML files and assets.

### Vercel
1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com/) and click **Add New > Project**.
3. Import your GitHub repository.
4. Vercel will automatically detect the Vite setup. The Build Command should be `npm run build` and Output Directory should be `dist`.
5. Click **Deploy**.

### Netlify
1. Push your repository to GitHub.
2. Log in to [Netlify](https://www.netlify.com/) and click **Add new site > Import an existing project**.
3. Connect your GitHub and select the repository.
4. Set Build command to `npm run build` and Publish directory to `dist`.
5. Click **Deploy site**.

### GitHub Pages
Since GitHub Pages usually hosts from the root or a `/docs` folder without building server-side (unless via Actions), you have two options:
**Option A (GitHub Actions):**
Create a `.github/workflows/deploy.yml` using the standard Vite + GitHub Pages workflow template to run `npm run build` and deploy the `dist` folder.

**Option B (Pre-build):**
1. Run `npm run build` locally.
2. Use a package like `gh-pages` to deploy the `dist` folder to the `gh-pages` branch.
   ```bash
   npx gh-pages -d dist
   ```

## Note on Media
Placeholder images from Unsplash are currently used. For production, please replace these URLs in the HTML files with local images placed inside `src/assets/images/` and reference them directly.
"# vidhyodaya" 
