const http = require('http');
const { lookup, registerRoutes } = require("./routes/routes");

const server = http.createServer((req, res) => {
  lookup(req, res);
});

(() => {
  registerRoutes();

  server.listen(3000, err => {
    if (err) {
      console.log("Errore: ", err);
    } else {
      console.log('Server in ascolto sulla porta 3000');
    }
  });
})()
