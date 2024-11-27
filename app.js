const http = require('http')

http.createServer(function(req, res) {
  res.write('Coming soon...something cool.');
  res.end();
}).listen(3000);

console.log('Server listening on port 3000.');

