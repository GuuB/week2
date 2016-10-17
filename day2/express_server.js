//                    URL SHORTENER SERVER


// REQUIREMENTS:

const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt-nodejs');

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieSession( {
  keys: ['key1', 'key2']
}));

// USER DATABASE
const db = {};

// URL DATABASE
const urlDB = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// FUNCTION RETURNS RANDOM STRING
const generateRandomString = function() {
  let shortURL = "";
  const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 7; i++)
    shortURL += char.charAt(Math.floor(Math.random() * char.length));
    return shortURL;
}

// UPDATE URLDB
const updateUrlDB = (db) => {
  for (let x in db) {
    for (let y in db[x]['userUrls']) {
      if (!urlDB[y]) {
        urlDB[y] = db[x]['userUrls'][y];
      }
    }
  }
}

// FUNCTION ADDS USER TO DATABASE
const addUser = (randomId, email, password) => {
  if (db[randomId] === true) {
    return false;
  } else if (email === undefined) {
    return false;
  } else if (password === undefined) {
    return false;
  } else if (checkUser(email, password) === true) {
    return false;
  } else {
    db[randomId] = {
      'id': randomId,
      'email': email,
      'password': password,
      'userUrls': {}
    };
    return true;
  }
};

// FUNCTION FINDS USER
const checkUser = (email, password) => {
  for (var x in db) {
    if (db[x]['email'] === email && bcrypt.compareSync(password, db[x]['password']) === true) {
        return true;
    }
  }
  return false;
}

// FUNCTION CREATES NEW KEY(SHORT-URL) AND LONG-URL
const add = function(shortUrl, longUrl, user_id) {
  for (z in db){
    if (db[z]['id'] === user_id) {
      db[z]['userUrls'][shortUrl] = longUrl;
      return true; // functions that change data return true on success
    }
  }
  return false;
};

// FUNCTION UPDATES LONG-URL AT KEY
const update = function(shortUrl, editedUrl, user_id) {
  for (let z in db) {
    if (user_id === db[z]['id']) {
      for (let i in db[z]['userUrls']) {
        if (shortUrl === i) {
          db[z]['userUrls'][i] = editedUrl;
          return db;
        }
      }
    }
  }
}

// FUNCTION DELETES KEY AND ELEMENT
const destroy = function(shortUrl, user_id) {
  for (let z in db) {
    if (db[z]['userUrls'][shortUrl]) {
      delete db[z]['userUrls'][shortUrl];
    }
  }
};


/*
 * ROUTING FUNCTIONS:
 */

// JSON PAGE
app.get("/urls.json", (req, res) => {
  res.json(urlDB);
});

// REDIRECT TO HOME PAGE
app.get("/", (req, res) => {
  res.redirect("/urls");
});

// HOME PAGE
app.get("/urls", (req, res) => {
  let database = {
    'user_id': req.session.user_id,
    'userDB': db,
    'publicUrls': urlDB
  }
  res.render("urls_index", {database: database, });
});

// PAGE TO CREATE NEW SHORT-URL
app.get("/urls/new", (req, res) => {
  let database = {
    'user_id': req.session.user_id,
    'userUrls': db
  }
  res.render("urls_new", {database: database});
});

// RECEIVES DATA POSTED FROM URLS/NEW
app.post("/urls/new", (req, res) => {
  add(generateRandomString(req.body.longURL), req.body.longURL, req.session.user_id);
  updateUrlDB(db);
  res.redirect("/");
});

// PAGE SHOWS NEW SHORT-URL
app.get("/urls/:id", (req, res) => {
  let shortUrl = req.params.id;
  let longUrl;
  for (let x in urlDB) {
    if (shortUrl === x) {
      longUrl = urlDB[x];
      let database = {
        'user_id': req.session.user_id,
        'userUrls': db
      };
      res.render("urls_showURL", {short: shortUrl, long: longUrl, database: database});
    }
  }
  res.status(404).send("URL not found!");
});

// UPDATES DATA AND REDIRECTS TO HOME PAGE
app.post("/urls/:shortUrl/edit", (req, res) => {
  let editedUrl = req.body.newUrl;
  let shortUrl = req.params.shortUrl;
  update(shortUrl, editedUrl, req.session.user_id);
  updateUrlDB(db);
  res.redirect("/urls")
});

// REDIRECTS USER TO LONG-URL PAGE
app.get("/u/:shortURL", (req, res) => {
  let longURL;
    for (let y in urlDB) {
      if (y === req.params.shortURL) {
        longURL = urlDB[y];
      }
    }
  res.redirect(longURL);
});

// REGISTER PAGE
app.get("/register", (req, res) => {
  let database = {
    user_id: req.session.user_id,
    urls: db
  }
  res.render("urls_register", {database: database});
});

// REDIRECTS TO HOME PAGE AFTER CREATING USER
app.post("/register", (req, res) => {
  const randomId = generateRandomString();
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password);
  if (addUser(randomId, email, password) === true) {
    req.session.user_id = randomId;
    res.redirect("/");
  } else {
    res.status(400).send("Invalid username!");
    res.redirect("/register");
  }
});

// LOGIN PAGE
app.get("/login", (req, res) => {
  let database = {
    user_id: req.session.user_id,
  }
  res.render("urls_login", {database: database});
});

// RESPONSE TO LOGIN
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (checkUser(email, password) === true) {
    for (let z in db) {
      if (db[z]['email'] === email){
        req.session.user_id = db[z]['id'];
        res.redirect("/");
      }
    }
  } else {
    res.status(403).send("username or password incorrect!");
    res.redirect("/login");
  }
});

// DELETES DATA AND REDIRECTS TO HOME PAGE
app.post("/urls/:shortUrl/delete", (req, res) => {
  destroy(req.params.shortUrl, req.params.shortURL);
  updateUrlDB(db);
  res.redirect("/urls");
});

// LOGOUT
app.post("/logout", (req, res) => {
  updateUrlDB(db);
  req.session = null;
  res.redirect("/");
});

/*
 * END OF ROUTING
 */


// START THE SERVER

var PORT = process.env.PORT || 8080; // default port 8080

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
