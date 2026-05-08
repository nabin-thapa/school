require('dotenv').config();
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || "fallback-secret-key-123";
const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
let ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin123";

app.use(express.json());
app.use(cookieParser());

// Serve the admin panel
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));
// Serve uploaded images directly (so they are instantly available to admin without waiting for Vite)
app.use('/src/assets/images', express.static(path.join(__dirname, 'src/assets/images')));

// Serve the main generated website (dist contains compiled CSS and HTML)
app.use(express.static(path.join(__dirname, 'dist')));

// Multer for image uploads (Memory Storage so we can compress it first)
const upload = multer({ storage: multer.memoryStorage() });

// Rebuild HTML function
const rebuildSite = () => {
    return new Promise((resolve, reject) => {
        exec('npm run build', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error rebuilding site: ${error}`);
                reject(error);
            }
            console.log(`Site rebuilt: ${stdout}`);
            resolve();
        });
    });
};

// Middleware to authenticate
const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// --- API ROUTES ---

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) { 
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.json({ message: "Logged in successfully" });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Logged out" });
});

app.get('/api/notices', (req, res) => {
    let data = fs.readFileSync(path.join(__dirname, 'data/notices.json'), 'utf8');
    let parsed = JSON.parse(data);
    if(parsed.notices) parsed = parsed.notices; // handle decap cms structure just in case
    res.json(parsed);
});

app.post('/api/notices', authenticate, async (req, res) => {
    const notices = req.body;
    fs.writeFileSync(path.join(__dirname, 'data/notices.json'), JSON.stringify(notices, null, 2));
    await rebuildSite();
    res.json({ message: "Notices updated and site rebuilt" });
});

app.delete('/api/notices/:index', authenticate, async (req, res) => {
    const index = parseInt(req.params.index);
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/notices.json'), 'utf8'));
    let notices = data.notices ? data.notices : data;
    notices.splice(index, 1);
    fs.writeFileSync(path.join(__dirname, 'data/notices.json'), JSON.stringify(data, null, 2));
    await rebuildSite();
    res.json({ message: "Notice deleted" });
});

app.get('/api/gallery', (req, res) => {
    let data = fs.readFileSync(path.join(__dirname, 'data/gallery.json'), 'utf8');
    let parsed = JSON.parse(data);
    if(parsed.gallery) parsed = parsed.gallery;
    res.json(parsed);
});

app.post('/api/gallery', authenticate, async (req, res) => {
    const gallery = req.body;
    fs.writeFileSync(path.join(__dirname, 'data/gallery.json'), JSON.stringify(gallery, null, 2));
    await rebuildSite();
    res.json({ message: "Gallery updated and site rebuilt" });
});

app.delete('/api/gallery/:index', authenticate, async (req, res) => {
    const index = parseInt(req.params.index);
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/gallery.json'), 'utf8'));
    let gallery = data.gallery ? data.gallery : data;
    
    const imagePath = gallery[index].image;
    if (imagePath && imagePath.startsWith('/src/assets/images/')) {
        try {
            fs.unlinkSync(path.join(__dirname, imagePath));
        } catch(e) { console.log("File already deleted or not found"); }
    }
    
    gallery.splice(index, 1);
    fs.writeFileSync(path.join(__dirname, 'data/gallery.json'), JSON.stringify(data, null, 2));
    await rebuildSite();
    res.json({ message: "Image deleted" });
});

// Messages API
app.get('/api/messages', authenticate, (req, res) => {
    let data = fs.readFileSync(path.join(__dirname, 'data/messages.json'), 'utf8');
    res.json(JSON.parse(data));
});

app.post('/api/messages', (req, res) => { // Public route for parents to submit forms
    const message = req.body;
    let messages = [];
    try {
        messages = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/messages.json'), 'utf8'));
    } catch(e) {}
    messages.unshift(message); // Add to top
    fs.writeFileSync(path.join(__dirname, 'data/messages.json'), JSON.stringify(messages, null, 2));
    res.json({ message: "Message saved" });
});

app.delete('/api/messages/:index', authenticate, (req, res) => {
    const index = parseInt(req.params.index);
    let messages = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/messages.json'), 'utf8'));
    messages.splice(index, 1);
    fs.writeFileSync(path.join(__dirname, 'data/messages.json'), JSON.stringify(messages, null, 2));
    res.json({ message: "Message deleted" });
});

app.post('/api/upload', authenticate, upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    
    try {
        const filename = Date.now() + '-' + path.parse(req.file.originalname).name.replace(/[^a-zA-Z0-9]/g, '') + '.webp';
        const outputPath = path.join(__dirname, 'src/assets/images', filename);
        
        await sharp(req.file.buffer)
            .resize(1200, null, { withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(outputPath);
            
        const imageUrl = `/src/assets/images/${filename}`;
        res.json({ imageUrl });
    } catch (err) {
        console.error("Compression Error:", err);
        res.status(500).json({ message: "Error compressing image" });
    }
});

// Settings API
app.post('/api/settings/password', authenticate, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    if (currentPassword !== ADMIN_PASS) {
        return res.status(401).json({ message: "Incorrect current password" });
    }
    
    if (!newPassword || newPassword.length < 5) {
        return res.status(400).json({ message: "New password must be at least 5 characters" });
    }

    try {
        const envPath = path.join(__dirname, '.env');
        let envData = fs.readFileSync(envPath, 'utf8');
        
        if (envData.includes('ADMIN_PASSWORD=')) {
            envData = envData.replace(/^ADMIN_PASSWORD=.*$/m, `ADMIN_PASSWORD=${newPassword}`);
        } else {
            envData += `\nADMIN_PASSWORD=${newPassword}`;
        }
        
        fs.writeFileSync(envPath, envData);
        ADMIN_PASS = newPassword; 
        
        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating password" });
    }
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'dist/404.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
