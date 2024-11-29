const http = require("http");

const hostname = "127.0.0.1";
const port = 3000;

let items = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
];

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  res.setHeader("Content-Type", "application/json");

  if (url === "/" && method === "GET") {
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Welcome to the Node.js server!" }));
  } else if (url === "/items" && method === "GET") {
    res.statusCode = 200;
    res.end(JSON.stringify(items));
  } else if (url === "/items" && method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const newItem = JSON.parse(body);
      newItem.id = items.length + 1;
      items.push(newItem);

      res.statusCode = 201;
      res.end(JSON.stringify(newItem));
    });
  } else if (url.startsWith("/items/") && method === "PUT") {
    const itemId = parseInt(url.split("/")[2]);

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const updatedItem = JSON.parse(body);

      let item = items.find((item) => item.id === itemId);
      if (item) {
        item.name = updatedItem.name || item.name;
        res.statusCode = 200;
        res.end(JSON.stringify(item));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Item not found" }));
      }
    });
  } else if (url.startsWith("/items/") && method === "DELETE") {
    const itemId = parseInt(url.split("/")[2]);

    const index = items.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      items.splice(index, 1);
      res.statusCode = 200;
      res.end(JSON.stringify({ message: "Item deleted successfully" }));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "Item not found" }));
    }
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
