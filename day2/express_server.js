//                    URL SHORTENER SERVER


// REQUIREMENTS
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
let urlDB = require("./urlDB");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

/*
 * ROUTING FUNCTIONS
 */

// JSON PAGE
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// REDIRECT TO HOME PAGE
app.get("/", (req, res) => {
  res.redirect("/urls");
});

// HOME PAGE
app.get("/urls", (req, res) => {
  let database = {
    username: req.cookies["username"],
    urls: urlDB.getAll()
  }
  res.render("urls_index", {database: database});
});

// PAGE TO CREATE NEW SHORT-URL
app.get("/urls/new", (req, res) => {
  let database = {
    username: req.cookies["username"],
    urls: urlDB.getAll()
  }
  res.render("urls_new", {database: database});
});

// PAGE SHOWS NEW SHORT-URL
app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let longURL = urlDB.urlDatabase[shortURL];
  let database = {
    username: req.cookies["username"],
    urls: urlDB.getAll()
  }
  if (urlDB.urlDatabase[shortURL]) {
    res.render("urls_showURL", {short: shortURL, long: longURL, database: database});
  }
  else {
    res.status(404).send("URL not found!");
  }
});

// REDIRECTS USER TO LONG-URL PAGE
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDB.urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// REGISTER PAGE
app.get("/register", (req, res) => {
  let database = {
    username: req.cookies["username"],
    urls: urlDB.getAll()
  }
  res.render("urls_register", {database: database});
})

// RECEIVES DATA POSTED FROM URLS/NEW
app.post("/urls", (req, res) => {
  urlDB.add(urlDB.generateRandomString(req.body.longURL), req.body.longURL);
  res.redirect("/urls");
});

// DELETES DATA AND REDIRECTS TO HOME PAGE
app.post("/urls/:shortURL/delete", (req, res) => {
  urlDB.urlDatabase = urlDB.destroy(req.params.shortURL);
  res.redirect("/urls");
});

// UPDATES DATA AND REDIRECTS TO HOME PAGE
app.post("/urls/:shortURL/edit", (req, res) => {
  let id = req.body.newURL;
  let shortURL = req.params.shortURL;
  urlDB.urlDatabase = urlDB.update(shortURL, id);
  res.redirect("/urls")
})

// REDIRECTS TO LOGIN PAGE AFTER CREATING USER
app.post("/register", (req, res) => {
  let database = {
    username: req.cookies["username"],
    urls: urlDB.getAll()
  }
  urlDB.userDatabase[req.body.username] = req.body.username;
  res.cookie("username", req.body.username);
  res.redirect("/");
})

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
})

app.post("/login", (req, res) => {
  const user = req.body.username;
  if (urlDB.userDatabase[user]) {
    res.cookie("username", user);
  }
  res.redirect("/");
})

/*
 * END OF ROUTING
 */


// START THE SERVER
var PORT = process.env.PORT || 8080; // default port 8080
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


// app.get("/urls/create", (req, res) => {
//   res.render("urls")
// })
