const express = require('express');
const expresLayout = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session  = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(expresLayout);

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
  secret: 'CookingBlogSecretSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(fileUpload());

app.set('view engine','ejs');
app.set('layout',"./layouts/layout");

const routes = require('./server/routes/recipeRoutes.js');

app.use('/',routes);

app.listen(port,()=>{
    console.log(`listening to port ${port}`);
})