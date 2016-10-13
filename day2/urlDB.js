//               URL SHORTENER DATABASE & FUNCTIONS

// USER DATABASE
const userDatabase = {}

// URL DATABASE
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// DATABASE
const database = {
  'urlDatabase': urlDatabase,
  'userDatabase': userDatabase
}

// FUNCTION RETURNS RANDOM STRING
function generateRandomString() {
  let shortURL = "";
  const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 7; i++)
    shortURL += char.charAt(Math.floor(Math.random() * char.length));
    return shortURL;
}

// FUNCTION RETURNS FULL DATABASE
function getAll() {
  return urlDatabase;
}

// FUNCTION RETURNS LONG-URL FOR IMPUTED SHORT-URL
function get(id) {
  return urlDatabase[id];
}

// FUNCTION CREATES NEW KEY(SHORT-URL) AND LONG-URL
function add(shortURL, longURL) {
  urlDatabase[shortURL] = longURL;
  return true; // functions that change data return true on success
}

// FUNCTION UPDATES LONG-URL AT KEY
function update(shortURL, editedURL) {
  urlDatabase[shortURL] = editedURL;
  return urlDatabase;
}

// FUNCTION DELETES KEY AND ELEMENT
function destroy(shortURL) {
  if (urlDatabase[shortURL]) {
    delete urlDatabase[shortURL];
  }
  return urlDatabase;
}

// FUNCTIONS THAT ARE EXPORTED
module.exports = {
  userDatabase: userDatabase,
  urlDatabase: urlDatabase,
  getAll: getAll,
  get: get,
  add: add,
  update: update,
  destroy: destroy,
  generateRandomString: generateRandomString,
  database: database
}
