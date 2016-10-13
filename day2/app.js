const http = require("http");
const PORT = 8080;

// a function which handles requests and sends response
function requestHandler(request, response) {
  if (request.url == "/") {
      response.end("Welcome!");
    } else if (request.url == "/urls") {
      response.end("www.lighthouselabs.ca\nwww.google.com");
    } else if (request.url == "/www.lighthouselabs.ca") {
      response.end("www.lighthouselabs.ca");
    } else if (request.url == "/www.google.com") {
      response.end("www.google.com");
    } else {
      response.statusCode = 404;
      response.end("Unknown Path");
    }
}

var server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});
