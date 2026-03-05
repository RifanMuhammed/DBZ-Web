import express from "express";
import axios from "axios";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, 
    limit: 100, 
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    // The handler function gives you access to 'res'
    handler: (req, res, next, options) => {
        res.status(429).render("error-limiter", {
            message: "Too many requests, please try again after 5 minutes"
        });
    }
});


app.use(express.static("public"));  // 1. Static files first (so images load even when blocked)
app.use(helmet());                  // 2. Helmet for security
app.use(limiter);                   // 3. Rate limiter last (to protect your API routes)
app.set("view engine", "ejs");


app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": ["'self'"],
      "img-src": ["'self'", "https://dragonball-api.com", "data:"],
      "script-src": ["'self'", "'unsafe-inline'"], // 'unsafe-inline' allows your Intersection Observer script
    },
  })
);



// 1. Home Page
app.get("/", (req, res) => {
    res.render("index");
});



// 2. All Characters Page (Pagination)
app.get("/characters", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const response = await axios.get(`https://dragonball-api.com/api/characters?page=${page}&limit=24`);
        const totalPages = response.data.meta.totalPages;
        res.render("characters", { 
            characters: response.data.items, 
            currentPage: parseInt(page),
            totalPages: totalPages,
        });
    } catch (error) {
        res.render("characters", { 
            characters: [],
            currentPage: 1,
            totalPages: 1,
            error: "Failed to load." 
        });
    }
});




// 2. All Planets Page (Pagination)
app.get("/planets", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const response = await axios.get(`https://dragonball-api.com/api/planets?page=${page}&limit=12`);
        const totalPages = response.data.meta.totalPages;
        res.render("planets", { 
            planets: response.data.items, 
            currentPage: parseInt(page),
            totalPages: totalPages,
        });
    } catch (error) {
        res.render("planets", { 
            planets: [], 
            currentPage: 1, 
            totalPages: 1, 
            error: "Failed to load." 
        });
    }
});





// 3. Search Characters
app.get("/search-characters", async (req, res) => {
    const charName = req.query.name;
    if (!charName) return res.redirect("/characters");
    try {
        const response = await axios.get(`https://dragonball-api.com/api/characters?name=${encodeURIComponent(charName)}`);
        const results = Array.isArray(response.data) ? response.data : [response.data];
        const totalPages = (response.data.meta) ? response.data.meta.totalPages : 1;
        res.render("characters", { 
            characters: results, 
            currentPage: 1,
            searchName: charName,
            totalPages: totalPages, 
        });
    } catch (error) {
        res.render("characters", { 
            characters: [], 
            currentPage: 1,
            totalPages: 1, 
            searchName: charName,
        });
    }
});



// 4. Search Planets
app.get("/search-planets", async (req, res) => {
    const planetName = req.query.name;
    if(!planetName) return res.redirect("/planets");
    try {
        const response = await axios.get(`https://dragonball-api.com/api/planets?name=${encodeURIComponent(planetName)}`);
        const totalPages = (response.data.meta) ? response.data.meta.totalPages : 1;
        const results = Array.isArray(response.data) ? response.data : [response.data];
        res.render("planets", { 
            planets: results, 
            currentPage: 1,
            totalPages: totalPages,
        });
    } catch (error) {
        res.render("planets", { 
            planets: [], 
            currentPage: 1,      
            totalPages: 1, 
            error: "No planet found with that name." 
        });
    }
});




// 6. Character Detail Page
app.get("/character/:id", async (req, res) => {
    try {
        const charId = req.params.id;
        const response = await axios.get(`https://dragonball-api.com/api/characters/${charId}`);
        const character = response.data;
        res.render("character-detail", { character: character });
    } catch (error) {
        res.status(404).render("404", { message: "Character not found! Maybe they were erased by Zeno?" });
    }
});




// For Routes that dont exist
app.use((req, res) => {
    res.status(404).render("404", { message: "Page not found!" });
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
