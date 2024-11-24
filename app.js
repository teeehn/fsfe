const http = require('http')

http.createServer(function(req, res) {
  res.write('On the way to becoming a full stack engineer!');
  res.end();
}).listen(3000);

console.log('Server listening on port 3000.');

