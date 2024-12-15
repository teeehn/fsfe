const express = require('express');

const server = require('http').createServer();
const app = express();

app.get('/', function(req, res) {
  res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(3000, function() {
  console.log('Server listening on port 3000.');
});

process.on('SIGINT', () => {
  server.close(() => {
    shutdownDB();
  });
});

// Begin Websockets

const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
  const numClients = wss.clients.size;
  console.log('Client connected. Total connected clients: ' + numClients);

  wss.broadcast('Current visitors: ' + numClients);

  if (ws.readyState === ws.OPEN) {
    ws.send('Welcome to the server!');
  }

  db.run(`INSERT INTO visitors (count, time) 
    VALUES (${numClients}, datetime('now'))
  `);

  ws.on('close', function close() {
    wss.broadcast('Current visitors: ' + numClients);
    console.log('A client disconnected');
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

/** End Web Sockets */
/** Database */

const sqlite = require('sqlite3');
const db = new sqlite.Database(':memory:');

db.serialize(function() {
  db.run(`
    CREATE TABLE visitors (
      count INTEGER,
      time TEXT
    )
  `)
});

function getCounts() {
  db.each(`SELECT * FROM visitors`, (err, row) => {
    console.log(row);
  });
}

function shutdownDB() {
  getCounts();
  console.log('Database shutting down.');
  db.close();
}

/** End Database */
