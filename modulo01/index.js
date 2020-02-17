const express = require("express");

const server = express();

server.use(express.json());

const users = ["Raphael", "Diego", "Renato"];

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Metodo : ${req.method}; url:${req.url}`);
  next();
  console.timeEnd("Request");
});

function checkUserExistin(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }
  return next();
}

function checkUserinArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "User does not exits" });
  }
  req.user = user;
  return next();
}

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUserinArray, (req, res) => {
  return res.json(req.user);
});

server.post("/users", checkUserExistin, (req, res) => {
  const { name } = req.body;
  users.push(name);

  return res.json(users);
});
server.put("/users/:index", checkUserinArray, checkUserExistin, (req, res) => {
  const { name } = req.body;
  const { index } = req.params;
  users[index] = name;
  return res.json(users);
});
server.delete("/users/:index", checkUserinArray, (req, res) => {
  const { index } = req.params;
  console.log(index);
  users.splice(index, 1);
  return res.json(users);
});

server.listen(3000);
