require('dotenv').config();
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY || SECRET_KEY === "fallback-secret-key-123") {
    console.warn("WARNING: SECRET_KEY is not set or using insecure default. Please update your .env file.");
}

const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
let ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin123";

// --- SECURITY MIDDLEWARE ---

// Limit payload size to prevent DoS
app.use(express.json({ limit: '10kb' })); 
app.use(cookieParser());

// Rate limiting for login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 login requests per windowMs
    message: { message: "Too many login attempts, please try again after 15 minutes" }
});

// Rate limiting for public contact form
const messageLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 messages per hour
    message: { message: "Too many messages sent. Please try again later." }
});

// --- SERVE STATIC FILES ---

// Serve the admin panel
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));
// Serve uploaded images directly
app.use('/src/assets/images', express.static(path.join(__dirname, 'src/assets/images')));
// Serve the main generated website
app.use(express.static(path.join(__dirname, 'dist')));

// Multer for image uploads
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only images are allowed'));
    }
});

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
        const decoded = jwt.verify(token, SECRET_KEY || "fallback-secret-key-123");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// --- API ROUTES ---

app.post('/api/login', loginLimiter, (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) { 
        const token = jwt.sign({ username }, SECRET_KEY || "fallback-secret-key-123", { expiresIn: '1h' });
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
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
    try {
        const data = fs.readFileSync(path.join(__dirname, 'data/notices.json'), 'utf8');
        let parsed = JSON.parse(data);
        if(parsed.notices) parsed = parsed.notices; 
        res.json(parsed);
    } catch (e) {
        res.status(500).json({ message: "Error reading notices" });
    }
});

app.post('/api/notices', authenticate, async (req, res) => {
    const notices = req.body;
    if (!Array.isArray(notices) && !notices.notices) {
        return res.status(400).json({ message: "Invalid data format" });
    }
    try {
        fs.writeFileSync(path.join(__dirname, 'data/notices.json'), JSON.stringify(notices, null, 2));
        await rebuildSite();
        res.json({ message: "Notices updated and site rebuilt" });
    } catch (e) {
        res.status(500).json({ message: "Error saving notices" });
    }
});

app.delete('/api/notices/:index', authenticate, async (req, res) => {
    try {
        const index = parseInt(req.params.index);
        let data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/notices.json'), 'utf8'));
        let notices = data.notices ? data.notices : data;
        if (index < 0 || index >= notices.length) return res.status(400).json({ message: "Invalid index" });
        
        notices.splice(index, 1);
        fs.writeFileSync(path.join(__dirname, 'data/notices.json'), JSON.stringify(data, null, 2));
        await rebuildSite();
        res.json({ message: "Notice deleted" });
    } catch (e) {
        res.status(500).json({ message: "Error deleting notice" });
    }
});

app.get('/api/gallery', (req, res) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'data/gallery.json'), 'utf8');
        let parsed = JSON.parse(data);
        if(parsed.gallery) parsed = parsed.gallery;
        res.json(parsed);
    } catch (e) {
        res.status(500).json({ message: "Error reading gallery" });
    }
});

app.post('/api/gallery', authenticate, async (req, res) => {
    const gallery = req.body;
    if (!Array.isArray(gallery) && !gallery.gallery) {
        return res.status(400).json({ message: "Invalid data format" });
    }
    try {
        fs.writeFileSync(path.join(__dirname, 'data/gallery.json'), JSON.stringify(gallery, null, 2));
        await rebuildSite();
        res.json({ message: "Gallery updated and site rebuilt" });
    } catch (e) {
        res.status(500).json({ message: "Error saving gallery" });
    }
});

app.delete('/api/gallery/:index', authenticate, async (req, res) => {
    try {
        const index = parseInt(req.params.index);
        let data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/gallery.json'), 'utf8'));
        let gallery = data.gallery ? data.gallery : data;
        
        if (index < 0 || index >= gallery.length) return res.status(400).json({ message: "Invalid index" });

        const imagePath = gallery[index].image;
        if (imagePath && imagePath.startsWith('/src/assets/images/')) {
            const fullPath = path.join(__dirname, imagePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }
        
        gallery.splice(index, 1);
        fs.writeFileSync(path.join(__dirname, 'data/gallery.json'), JSON.stringify(data, null, 2));
        await rebuildSite();
        res.json({ message: "Image deleted" });
    } catch (e) {
        res.status(500).json({ message: "Error deleting gallery item" });
    }
});

app.get('/api/messages', authenticate, (req, res) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'data/messages.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (e) {
        res.json([]);
    }
});

app.post('/api/messages', messageLimiter, (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ message: "Name, email and message are required" });
    }

    try {
        let messages = [];
        const filePath = path.join(__dirname, 'data/messages.json');
        if (fs.existsSync(filePath)) {
            messages = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
        
        messages.unshift({ name, email, subject, message, date: new Date().toISOString() });
        fs.writeFileSync(filePath, JSON.stringify(messages.slice(0, 500), null, 2)); // Limit to last 500 messages
        res.json({ message: "Message saved" });
    } catch(e) {
        res.status(500).json({ message: "Error saving message" });
    }
});

app.delete('/api/messages/:index', authenticate, (req, res) => {
    try {
        const index = parseInt(req.params.index);
        let messages = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/messages.json'), 'utf8'));
        if (index < 0 || index >= messages.length) return res.status(400).json({ message: "Invalid index" });
        
        messages.splice(index, 1);
        fs.writeFileSync(path.join(__dirname, 'data/messages.json'), JSON.stringify(messages, null, 2));
        res.json({ message: "Message deleted" });
    } catch (e) {
        res.status(500).json({ message: "Error deleting message" });
    }
});

app.post('/api/upload', authenticate, upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    
    try {
        const filename = Date.now() + '-' + path.parse(req.file.originalname).name.replace(/[^a-zA-Z0-9]/g, '') + '.webp';
        const outputDir = path.join(__dirname, 'src/assets/images');
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
        
        const outputPath = path.join(outputDir, filename);
        
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

app.post('/api/settings/password', authenticate, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    if (currentPassword !== ADMIN_PASS) {
        return res.status(401).json({ message: "Incorrect current password" });
    }
    
    if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters" });
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || "Something went wrong!" });
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'dist/404.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
