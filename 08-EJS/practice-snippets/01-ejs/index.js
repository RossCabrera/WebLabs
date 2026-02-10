import express from "express";
import ejs from 'ejs';

const app = express();
const port = 3000;

// Tell express we use EJS
app.set("view engine", "ejs");


// Middleware
function checkWeekend(req, res, next){
    const today = new Date().getDate();
    res.locals.isWeekend = today === 0 || today === 6;
    next();
}

/*
function checkWeekend(req, res, next) {
    const day = new Date().getDay(); \\
    const isWeekend = day === 0 || day === 6;
  
    req.isWeekend = isWeekend; 
    next(); 
  }
*/

// Home route 
app.get("/", checkWeekend, (req, res) => {
    res.render("index");
});

/*
app.get("/", checkWeekend, (req, res) => {
    res.render("day", {
      isWeekend: req.isWeekend
    });
  });
*/

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
  });







