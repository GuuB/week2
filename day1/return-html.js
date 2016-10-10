var http = require("http");

function readHTML (url, callback) {


  http.get(url, (response) => {    // HTTP Response Callback
    response.setEncoding("utf8");             // Use UTF-8 encoding

    var htmlData = '';
    
    response.on('data', function(d) {           // On Data Received
      htmlData += d;
    });

    response.on("end", function() {
      callback(htmlData);             // On Data Completed
    });
  });
}

function printHTML (htmlData) {
  console.log(htmlData);
}

readHTML("http://httpbin.org/", printHTML);
