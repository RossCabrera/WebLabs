import express from 'express';
import { dirname } from "path";
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// Password
const SECRET_PASSWORD = "ILoveProgramming";


// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(express.urlencoded({extended: true}));

function validatePassword(req, res, next){
    const userPassword = req.body.password;
    
    if(userPassword === SECRET_PASSWORD){
        next();
    }else{
        res.send("<h1>Wrong Password. Try Again.</h1><a href='/'> Go Back</a>")
    }
}

// ==================== ROUTES ====================
app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/check", validatePassword, (req, res) =>{
    res.sendFile(__dirname + "/public/secret.html");
});



// ==================== START SERVER ====================
app.listen(port, () =>{
    console.log(`Server running on port ${port}`);
});

