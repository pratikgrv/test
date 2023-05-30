// Import required modules
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
// Create a new Express app instance
const app = express();

// Configure view engine and view directory
app.engine('ejs', ejsMate); // use ejsMate as the template engine
app.set('view engine', 'ejs'); // set ejs as the default template engine
app.set('views', path.join(__dirname, 'views')); // set the views directory to ./views
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(
  session({
    secret: 'lolol', // Replace with your own secret key
    resave: false,
    saveUninitialized: false
  })
);
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









app.use((req, res, next) => {
  const currentTimestamp = Date.now();
const currentDate = new Date(currentTimestamp);

const year = currentDate.getFullYear();
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const day = currentDate.getDate().toString().padStart(2, '0');
const hours = currentDate.getHours().toString().padStart(2, '0');
const minutes = currentDate.getMinutes().toString().padStart(2, '0');
const seconds = currentDate.getSeconds().toString().padStart(2, '0');

const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

console.log(formattedDate);
  next()
})



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
      id: post._id,
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

app.get("/createpost", (req, res) => {
  res.render("create");
})

app.post('/', async (req, res) => {
  const { title, content } = req.body;
  const Posts = await new Post({
    title: title,
    content: content
  })
  try {
    await Posts.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

app.delete('/posts/:postId', async (req, res) => {

  const id = req.params.postId;

  await Post.findByIdAndDelete(id);
  res.redirect('/');

})


// Handle all other routes with the notfound view
app.get('*', (req, res) => {
  res.render('notfound'); // render the notfound view
});

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log('Serving on port 3000');
});
