// Import the modules we need
var express = require ('express')
var ejs = require('ejs')
var mysql = require('mysql');
var bodyParser= require ('body-parser');
var $ = require('jquery');

// Define the database connection
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'appuser',
    password: 'app2027',
    database: 'forum_app',
    multipleStatements: true,
});
// Connect to the database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;


// Create the express application object
const app = express()
const session = require('express-session');
const port = 8000
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret:'forum',
    resave: true,
    saveUninitialized: true,
}));

// Set up css (https://stackoverflow.com/questions/49891373/how-can-i-add-bootstrap-to-a-project-in-expressjs)
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.static(__dirname + '/public'));

// Set the directory where Express will pick up HTML files
// __dirname will get the current directory
app.set('views', __dirname + '/views');

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Tells Express how we should process html files
// We want to use EJS's rendering engine
app.engine('html', ejs.renderFile);

// Define our data
var forumData = {forumName: "My4uM"}

// Requires the main.js file inside the routes folder passing in the Express app and data as arguments.  All the routes will go in this file
require("./routes/main")(app, forumData);

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

