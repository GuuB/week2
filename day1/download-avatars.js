'use strict';

// REQUIREMENTS
const request = require('request');
const fs = require('fs');

// ARGUMENTS
const repoOwner = process.argv[2];
const repoName = process.argv[3];

// FUNCTION TAKES ELEMENT AT URL AND ADDS IT TO SELECTED FOLDER AND NAMES IT WITH USER LOGIN
const downloadImageByURL = function(url, filePath) {
  request(url).pipe(fs.createWriteStream("./avatars/" + filePath + ".png"));
}

// FUNCTION PROVIDES INITIAL PROTOCOL AND DOMAIN NAME AND REQUESTS JSON FILE
const githubRequest = function(endpoint, cb) {
  const githubRoot = "https://api.github.com";
  let options = {
    url: `${githubRoot}${endpoint}`,
    headers: {
      'User-Agent': 'request'
    }
  };
  request.get(options, cb);
}

// FUNCTION COMPLETES URL WITH INPUTED ARGUMENTS
const getRepoContributors = function(repoOwner, repoName, cb) {
  githubRequest(`/repos/${repoOwner}/${repoName}/contributors`, cb);
}

// CALLS FUNCTION AND PROVIDES CALLBACK
// NEW FOLDER IS CREATED WITH ALL AVATARS OF CONTRIBUTORS
getRepoContributors(repoOwner, repoName, (err, response, body) => {
  if (err) {
    console.log("Errors:", err);
  } else {
    let contributors = JSON.parse(body);
    if (!fs.existsSync("./avatars")) {
      fs.mkdirSync("./avatars");
    }
    contributors.forEach(function(contributor) {
      let avatarUrl = contributor['avatar_url'];
      let avatarLogin = contributor['login'];
      downloadImageByURL(avatarUrl, avatarLogin);
    });
  }
});
