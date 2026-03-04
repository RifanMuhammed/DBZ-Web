const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public")); // Allows us to use the CSS file

// 1. Home Page
app.get("/", (req, res) => {
    res.render("index");
});

// 2. All Charcters Page ,Pagination
app.get("/characters", async (req, res) => {
    try {
        const page = req.query.page || 1; // Get page from URL, e.g., /planets?page=2
        const response = await axios.get(`https://dragonball-api.com/api/characters?page=${page}&limit=24`);
        const totalPages = response.data.meta.totalPages;
        // The API returns 'items' and 'links' for pagination
        res.render("characters", { 
            characters: response.data.items, 
            currentPage: parseInt(page),
            totalPages: totalPages,
            links: response.data.links 
        });
    } catch (error) {
        res.render("planets", { planets: [], error: "Failed to load." });
    }
});


// 3. All Planets Page ,Pagination
app.get("/planets", async (req, res) => {
    try {
        const page = req.query.page || 1; // Get page from URL, e.g., /planets?page=2
        const response = await axios.get(`https://dragonball-api.com/api/planets?page=${page}&limit=12`);
        const totalPages = response.data.meta.totalPages;

        
        // The API returns 'items' and 'links' for pagination
        res.render("planets", { 
            planets: response.data.items, 
            currentPage: parseInt(page),
            links: response.data.links,
            totalPages:totalPages,
        });
    } catch (error) {
        res.render("planets", { planets: [], error: "Failed to load." });
    }
});



//Search/Filters
app.get("/search-planets", async (req, res) => {
    const planetName = req.query.name;
    if(!planetName){
        return res.redirect("/planets");
    }
    try {
        const response = await axios.get(`https://dragonball-api.com/api/planets?name=${planetName}`);
        const totalPages = (response.data.meta) ? response.data.meta.totalPages : 1;

        // Note: The API might return a single object or an array depending on the search
        const results = Array.isArray(response.data) ? response.data : [response.data];
        res.render("planets", { 
            planets: results, 
            currentPage: 1,
            totalPages:totalPages,
        });

    } catch (error) {
        res.render("planets", { 
            planets: [], 
            currentPage: 1,      // ADD THIS LINE
            totalPages: 1, 
            error: "No planet found with that name." 
        });
    }
});


app.get("/search-characters", async (req, res) => {
    const charName = req.query.name;
    if (!charName) {
        return res.redirect("/characters");
    }

    try {
        const response = await axios.get(`https://dragonball-api.com/api/characters?name=${charName}`);
        
        // Search results are usually a direct array, so meta doesn't exist
        const results = response.data; 
        
        // Safely check if meta exists, otherwise default to 1
        const totalPages = (response.data.meta) ? response.data.meta.totalPages : 1;

        res.render("characters", { 
            characters: results, 
            currentPage: 1,
            searchName: charName,
            totalPages: totalPages 
        });
    } catch (error) {
        res.render("characters", { 
            characters: [], 
            currentPage: 1,
            totalPages: 1, 
            searchName: charName
        });
    }
});


app.listen(3000, () => console.log("Server running on http://localhost:3000"));