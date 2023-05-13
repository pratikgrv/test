const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');



const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.render('home')
});

app.get('/about',(req, res) => {
    res.render('about')
});

app.get('*',(req, res) => {
    res.render('notfound')
});



app.listen(3000, () => {
    console.log('Serving on port 3000')
})
