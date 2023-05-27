// Import required modules
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
// Create a new Express app instance
const app = express();

// Configure view engine and view directory
app.engine('ejs', ejsMate); // use ejsMate as the template engine
app.set('view engine', 'ejs'); // set ejs as the default template engine
app.set('views', path.join(__dirname, 'views')); // set the views directory to ./views
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the /public directory
app.use(express.static(__dirname + '/public'));

mongoose.connect("mongodb://127.0.0.1:27017/pratikgrvDB", {
  useNewUrlParser: true,

});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

// Define routes
app.get("/", async function (req, res) {
  try {
    const posts = await Post.find({});
    res.render("home", {
      posts: posts,
    });
  } catch (err) {
    // Handle any potential errors
    console.error(err);
    // Respond with an appropriate error message
    res.status(500).send("Internal Server Error");
  }
});


app.get('/about', (req, res) => {
  res.render('about'); // render the about view
});


app.get("/posts/:postId", async function (req, res) {
  try {
    const requestedPostId = req.params.postId;
    const post = await Post.findOne({ _id: requestedPostId });

    if (!post) {
      // Handle the case when the post is not found
      return res.status(404).send("Post not found");
    }

    res.render("post", {
      title: post.title,
      content: post.content
    });
  } catch (err) {
    // Handle any potential errors
    console.error(err);
    // Respond with an appropriate error message
    res.status(500).send("Internal Server Error");
  }
});






// Handle all other routes with the notfound view
app.get('*', (req, res) => {
  res.render('notfound'); // render the notfound view
});

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log('Serving on port 3000');
});
