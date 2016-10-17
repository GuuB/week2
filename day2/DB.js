//               URL SHORTENER DATABASE & FUNCTIONS


// USER DATABASE
const database = {};

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
const updateUrlDB = (database) => {
  for (let x in database) {
    for (let y in database[x].urls) {
      urlDB[y] = database[x].urls[y];
    }
  }
}

// FUNCTION ADDS USER TO DATABASE
const addUser = (randomId, email, password) => {
  // FIX FOR ID BEING THE SAME
  if (database[randomId] === true || email.length === 0 || password.length === 0) {
    return false;
  } else {
    database[randomId] = {
      'id': randomId,
      'email': email,
      'password': password,
      'userUrls': {}
    };
    console.log(database);
    return true;
  }
};

//FIX
// FUNCTION FINDS USER // DOESNT WORK -> RETURNS FALSE ALWAYS
const checkUser = (email, password) => {
  for (var x in database) {
    console.log("x", database[x]);
    console.log("password in db", database[x]['password']);
    console.log("password", password);
    if (database[x]['email'] === email && database[x]['password'] === password) {
      return true;
    }
  }
  return false;
}

// FIX
// FUNCTION CREATES NEW KEY(SHORT-URL) AND LONG-URL
const add = function(shortUrl, longUrl, user_id) {
  console.log(user_id);
  database[user_id]['userUrls'][shortUrl] = longUrl;
  console.log(database[user_id]);
  return true; // functions that change data return true on success
};

//FIX
// FUNCTION UPDATES LONG-URL AT KEY
const update = function(shortUrl, editedUrl, user_id) {
  database[user_id]['userUrls'][shortUrl] = editedUrl;
  return database;
}

// FIX
// FUNCTION DELETES KEY AND ELEMENT
const destroy = function(shortUrl, user_id) {
  if (database[shortUrl]['userUrls'][shortUrl]) {
    delete database[shortUrl]['userUrls'][shortUrl];
  }
};

// FUNCTIONS THAT ARE EXPORTED
module.exports = {
  urlDB: urlDB,
  updateUrlDB: updateUrlDB,
  checkUser: checkUser,
  add: add,
  addUser: addUser,
  update: update,
  destroy: destroy,
  generateRandomString: generateRandomString,
  database: database,
}
