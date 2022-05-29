const express = require('express')
const app = express()
const port = 3000;
const bodyparser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// import db 
const connectDB = require("./server/connection");

// connecting to database 
connectDB();

// using bodyParser to parse JSON bodies into JS objects
// app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));


// adding morgan to log HTTP requests
app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(__dirname + '/public'));



app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const routes = require('./server/routes')
app.use("/", routes);

//start express server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
})