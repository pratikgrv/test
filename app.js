// Import required modules
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');

// Create a new Express app instance
const app = express();

// Configure view engine and view directory
app.engine('ejs', ejsMate); // use ejsMate as the template engine
app.set('view engine', 'ejs'); // set ejs as the default template engine
app.set('views', path.join(__dirname, 'views')); // set the views directory to ./views

// Serve static files from the /public directory
app.use(express.static(__dirname + '/public'));

// Define routes
app.get('/', (req, res) => {
  res.render('home'); // render the home view
});

app.get('/about', (req, res) => {
  res.render('about'); // render the about view
});

// Handle all other routes with the notfound view
app.get('*', (req, res) => {
  res.render('notfound'); // render the notfound view
});

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log('Serving on port 3000');
});
