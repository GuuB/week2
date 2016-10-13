//                    URL SHORTENER SERVER


// REQUIREMENTS
const express = require("express");
const bodyParser = require("body-parser");
let urlDB = require("./urlDB");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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
  let urls = urlDB.getAll();
  res.render("urls_index", {urls: urls});
});

// PAGE TO CREATE NEW SHORT-URL
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// PAGE SHOWS NEW SHORT-URL
app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let longURL = urlDB.urlDatabase[shortURL];
  if (urlDB.urlDatabase[shortURL]) {
    res.render("urls_showURL", {short: shortURL, long: longURL});
  }
  else {
    res.status(404).send("URL not found!");
  }
});

// REDIRECTS USER TO LONG-URL
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDB.urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// RECEIVES DATA POSTED FROM URLS/NEW
app.post("/urls", (req, res) => {
  urlDB.add(urlDB.generateRandomString(req.body.longURL), req.body.longURL);
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  urlDB.urlDatabase = urlDB.destroy(req.params.shortURL);
  console.log(urlDB.urlDatabase);
  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  let id = req.body.newURL;
  let shortURL = req.params.shortURL;
  urlDB.urlDatabase = urlDB.update(shortURL, id);
  res.redirect("/urls")
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
