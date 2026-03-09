import express from "express";
import axios from "axios";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import fs from "fs";


const app=express();

// Load characters.json
const charactersData = JSON.parse(
  fs.readFileSync("./characters.json", "utf-8")
);

const limiter= rateLimit({
    windowMs:5*60*1000,
    limit:100,
    standardHeaders:"draft-7",
    legacyHeaders:false,
    
    // The handler function gives you access to 'res'
    handler:(req,res,next,Option)=>{
        res.status(429).render("error-limiter.ejs",{
            message:"Too many requests, please try again after 5 minutes."
        });
    }
});

app.use(express.static("public"));  // 1. Static files first (so images load even when blocked)
app.use(helmet());                  // 2. Helmet for security
app.use(limiter);                   // 3. Rate limiter last (to protect your API routes)



app.use(
    helmet.contentSecurityPolicy({
        directives:{
            "default-src": ["'self'"],
            "img-src":["'self'","https://dragonball-api.com","data:"],
            "script-src":["'self'"],
        },
    })
);


//1.Home-page route.
app.get("/",(req,res)=>{
    res.render("index.ejs");
});

//2.All Characters Page (LOCAL JSON Pagination)
app.get("/characters", (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 24;

    const allCharacters = charactersData.items;

    const start = (page - 1) * limit;
    const end = start + limit;

    const paginatedCharacters = allCharacters.slice(start, end);
    const totalPages = Math.ceil(allCharacters.length / limit);

    res.render("characters.ejs", {
      characters: paginatedCharacters,
      currentPage: page,
      totalPages: totalPages,
    });

  } catch (error) {
    res.render("characters.ejs", {
      characters: [],
      currentPage: 1,
      totalPages: 1,
      error: "Failed to load."
    });
  }
});


//3.Search-characters route.
app.get("/search-characters",async(req,res)=>{
    const charactername=req.query.name;
    if(!charactername){
        return res.redirect("/characters");
    }
    try{
        const response=await axios.get(`https://dragonball-api.com/api/characters?name=${encodeURIComponent(charactername)}`);
        const results= Array.isArray(response.data) ? response.data :[response.data];
        const totalPages= (response.data.meta) ? response.data.meta.totalPages : 1;
        res.render("characters.ejs",{
            characters:results,
            searchName:charactername,
            currentPage:1,
            totalPages:totalPages,

        });
    }catch(error){
        res.render("characters.ejs",{
            characters:[],
            currentPage:1,
            totalPages:1,
            searchName:charactername,
            error:"Character not found.",
        });

    }
});


//4.Character-detail-page route.
app.get("/characters/:id",async (req,res)=>{
    const id=req.params.id;
    try{
        const response= await axios.get(`https://dragonball-api.com/api/characters/${id}`);
        const character=response.data;
        res.render("character-details.ejs",{
            character:character,
        })
    }catch(error){
        res.status(404).render("404.ejs",{
            message:"Character not found! Maybe they were erase by Zeno.",
        });
    }
});


//5.Planets-page route.
app.get("/planets",async (req,res)=>{
    try{
        const pageno=req.query.page || 1;
        const response=await axios.get(`https://dragonball-api.com/api/planets?page=${pageno}&limit=12`);
        res.render("planets.ejs",{
            planets:response.data.items,
            currentPage:response.data.meta.currentPage,
            totalPages:response.data.meta.totalPages,
        });
    }catch(error){
        res.render("planets.ejs",{
            planets:[],
            currentPage:1,
            totalPages:1,
            error:"Failed to load planets",
        })
    }
})


//6.Search-planets route.
app.get("/search-planets",async (req,res)=>{
    const planetname=req.query.name;
    if(!planetname){
        return res.redirect("/planets");
    }
    try{
        const response=await axios.get(`https://dragonball-api.com/api/planets?name=${encodeURIComponent(planetname)}`);
        const results= Array.isArray(response.data) ? response.data :[response.data];
        const totalPages= (response.data.meta) ? response.data.meta.totalPages : 1 ;
        res.render("planets.ejs",{
            planets:results,
            searchName:planetname,
            currentPage:1,
            totalPages:totalPages,
        });
    }catch(error){
        res.render("planets.ejs",{
            planets:[],
            currentPage:1,
            totalPages:1,
            error:"Could not load the planets",
        })
    }
})


app.use((req,res)=>{
    res.status(404).render("404.ejs",{
        message: "Page not found"
    });
});


const PORT=process.env.PORT ||3000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})


