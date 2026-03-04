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
        
        // The API returns 'items' and 'links' for pagination
        res.render("characters", { 
            characters: response.data.items, 
            currentPage: parseInt(page),
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
        
        // The API returns 'items' and 'links' for pagination
        res.render("planets", { 
            planets: response.data.items, 
            currentPage: parseInt(page),
            links: response.data.links 
        });
    } catch (error) {
        res.render("planets", { planets: [], error: "Failed to load." });
    }
});



//Search/Filters
app.get("/search-planets", async (req, res) => {
    const planetName = req.query.name;
    try {
        const response = await axios.get(`https://dragonball-api.com/api/planets?name=${planetName}`);
        // Note: The API might return a single object or an array depending on the search
        const results = Array.isArray(response.data) ? response.data : [response.data];
        res.render("planets", { planets: results, currentPage: 1 });
    } catch (error) {
        res.render("planets", { planets: [], error: "No planet found with that name." });
    }
});


app.get("/search-characters", async (req, res) => {
    const charName = req.query.name; // Grabs 'name' from the URL: /search-characters?name=Goku
    try {
        // If there is a name, we filter. If not, we redirect to the main characters list.
        if (!charName) {
            return res.redirect("/characters");
        }

        const response = await axios.get(`https://dragonball-api.com/api/characters?name=${charName}`);
        
        // The search endpoint usually returns an array of matches
        const results = Array.isArray(response.data) ? response.data : [response.data];

        res.render("characters", { 
            characters: results, 
            currentPage: 1,
            searchName: charName 
        });
    } catch (error) {
        // If no character is found, the API might throw a 404
        res.render("characters", { 
            characters: [], 
            error: `No character found named "${charName}"`, 
            currentPage: 1,
            searchName: charName
        });
    }
});


app.listen(3000, () => console.log("Server running on http://localhost:3000"));