require('dotenv').config();
const express = require('express');
const connectDB = require('.server/config/db')

const app = express();
const port = 3005 || process.env.PORT;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// connect to DB

connectDB();

//static Files

app.use(express.static('FRONTEND'));

//Templating Engine


app.set('view engine', 'ejs');

//Routes
app.use("/", require("./server/routes/index"));

// Handle 404
app.get("*", function(req,res) {
    //res.status(404).send("404 Page Not Found.")
    res.status(404).render("404")
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});