let axios = require("axios")
let express = require("express")
let app = express();
let cors = require("cors")

app.use(express.json());
app.use(cors());

let httpMethodMiddleware = (req, res, next) =>{
    if(req.method !== "POST"){
        return res.status(405).json({type: "error", message: "Only POST method allowed"})
    }
    next();
}

let pokemon_all = async (limit) =>{
    try{
        let response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`)
        let data = response.data;
        let pokeData = data['results'];

        let pokemonArray = [];

        pokeData.forEach((data) =>{
            let pokemon_names = {
                name: data.name
            }
            pokemonArray.push(pokemon_names);
        })

        return pokemonArray;
    }
    catch(e){
        return null;
    }
}

let pokemon_search = async (search) =>{
    let pokemon_names = await pokemon_all("1000000000");
    let pokemon_cleanName = search.trim().toLowerCase();

    let filter_pokenames = pokemon_names.filter(pokemon => pokemon.name.trim().toLowerCase().includes(pokemon_cleanName));
    return filter_pokenames;
}

app.get("/pokemon-all", async (req, res) =>{
    let limit = req.query.limit;

    if(!limit || limit === ""){
        return res.status(200).json({"message": "limit query is requied"})
    }
    else if(isNaN(limit)){
        return res.status(200).json({"message": "limit should be a number"})
    }
    else if(Number(limit) <= 0){
        return res.status(200).json({"message": "limit should be greater than 0"})
    }

    let pokemonNames = await pokemon_all(limit);
    res.json(pokemonNames);
})

app.get("/pokemon-search", async (req, res) =>{
    let search = req.query.search;

    if(!search || search === ""){
        return res.status(200).json({"message": "search query is requied"})
    }
    else if (!isNaN(search)) {
        return res.status(200).json({ "message": "search should be a string" });
    }

    let pokemon_names = await pokemon_search(search);
    res.json(pokemon_names)
})

app.get("/pokemon", (req, res) =>{
    res.json({ "message": "Use a Pokémon name after /pokemon/ for specific pokémon details" });
})

app.get("/pokemon/:name", (req, res) =>{
    let name = req.params.name;

    if(!name || name.trim() === ""){
        return res.status(200).json({"message": "pokemon name is requied"})
    }
    else if (!isNaN(name.trim())) {
        return res.status(200).json({ "message": "pokemon name should be a string" });
    }

    res.json({"message": name.trim()});
})

app.listen(5000, () =>{
    console.log("Running")   
})