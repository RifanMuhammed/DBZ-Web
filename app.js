import express from "express";
import axios from "axios";
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

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

// 3. Search Characters
app.get("/search-characters", async (req, res) => {
    const charName = req.query.name;
    if (!charName) return res.redirect("/characters");
    try {
        const response = await axios.get(`https://dragonball-api.com/api/characters?name=${charName}`);
        const results = response.data;
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

// 4. All Planets Page (Pagination)
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

// 5. Search Planets
app.get("/search-planets", async (req, res) => {
    const planetName = req.query.name;
    if(!planetName) return res.redirect("/planets");
    try {
        const response = await axios.get(`https://dragonball-api.com/api/planets?name=${planetName}`);
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
        res.status(404).send("Character not found");
    }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));