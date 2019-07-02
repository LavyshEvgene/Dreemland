const setup = {port: 8100}
var mongoose = require("mongoose");
var session = require("express-session");
const express = require('express');
var MongoStore = require("connect-mongo")(session);
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');
var cors = require('cors');
const jsonParser = express.json({limit: '50mb'});
const mongoClient = new MongoClient("mongodb://localhost:27017/", {useNewUrlParser: true});
let dbClient;
var userApi = require('./apis/user');

app.use(express.static(path.join(__dirname, 'public')));
app.use(jsonParser);
app.use(express.urlencoded({limit: '50mb'}));
app.use(fileUpload());
app.use(session({
  secret: 'i need more beers',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    url: "mongodb://localhost:27017/sessiondreemland"
  })
}));
app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));

mongoClient.connect(function (err, client) {
  if (err) return console.log(err);
  dbClient = client;
  app.listen(setup.port, function () {
    console.log("Сервер ожидает подключения...");
  });
});

app.get('/test', (req, res) => {
  res.send('Test');
});

app.get('/api/categories', function (req, res) {
  const collection = dbClient.db('dreemland').collection('categories');
  collection.find({}).toArray(function (err, catalog) {
    if (err) return console.log(err);
    res.send(catalog);
  });
});

app.get('/api/items', function (req, res) {
  const collection = dbClient.db('dreemland').collection('products');
  collection.find({}).toArray(function (err, products) {
    if (err) console.log(err);
    res.send(products);
  })
});

app.get('/api/login', function (req, res) {
  if (req.session.user) res.send(req.session.user);
  else res.send({result: false})
});

app.post('/api/login', function (req, res) {
  userApi.checkUser(req.body).then(function (user) {
    if (user) {
      req.session.user = user;
      res.send(user);
    } else {
      res.send({result: false});
    }
  })
});

app.post('/api/reg', function (req, res) {
  console.log(req.body);
  userApi.createUser(req.body).then(function (result) {
    res.send({result: true})
  }).catch(function (err) {
    res.send({result: false})
  })
});

app.post('/api/logout', function (req, res) {
  if (req.session.user) {
    delete req.session.user;
  }
  res.end();
});

app.post('/api/add_product', function (req, res) {
  const collection = dbClient.db('dreemland').collection('products');
  var product = req.body;
  collection.insertOne(product);
  res.end();
});

app.post('/api/remove_product', function (req, res) {
  const collection = dbClient.db('dreemland').collection('products');
  var id = req.body.id;
  collection.remove({"_id": new objectId(id)});
  res.end();
});

app.post('/api/update_product', function (req, res) {
  const collection = dbClient.db('dreemland').collection('products');
  const product = req.body.product;
  const name = product.name;
  const category = product.category;
  const characters = product.characters;
  const description = product.description;
  const img = product.img;
  const price = product.price;
  collection.findOneAndUpdate({'_id': new objectId(product._id)}, {
    $set: {
      name,
      category,
      characters,
      description,
      img,
      price
    }
  });
  res.end();
});

app.post('/api/add_category', function (req, res) {
  const collection = dbClient.db('dreemland').collection('categories');
  const category = req.body.name;
  collection.insert({name: category, categories: []});
  res.end();
});

app.post('/api/remove_category', function (req, res) {
  const collection = dbClient.db('dreemland').collection('categories');
  var id = req.body.id;
  collection.remove({"_id": new objectId(id)});
  res.end();
});

app.post('/api/update_category', function (req, res) {
  const collection = dbClient.db('dreemland').collection('categories');
  const name = req.body.name;
  const id = req.body.id;
  collection.findOneAndUpdate({'_id': new objectId(id)}, {$set: {name}});
  res.end();
});

app.post('/api/update_subcategories', function (req, res) {
  const collection = dbClient.db('dreemland').collection('categories');
  const categories = req.body.categories;
  const id = req.body.id;
  collection.findOneAndUpdate({'_id': new objectId(id)}, {$set: {categories}});
  res.end();
});

app.post('/api/save_img', function (req, res) {
  let file = req.file;
  file.mv('/var/www/nginx/dreemland/' + file.name, function (err) {
    if (err) {
      console.log(file);
      console.log(err);
    }
  });
  res.end();
});

app.post('/api/add_order', function (req, res) {
  const collection = dbClient.db('dreemland').collection('orders');
  const userId = req.body.userId;
  const items = req.body.items;
  const status = 'NEW';
  collection.insert({userId, items, status});
  res.end();
});

app.get('/api/orders', function (req, res) {
  const collection = dbClient.db('dreemland').collection('orders');
  collection.find({}).toArray(function (err, orders) {
    if (err) return console.log(err);
    res.send(orders);
  });
});

app.get('/api/users', function (req, res) {
  const collection = dbClient.db('dreemland').collection('users');
  collection.find({}).toArray(function (err, users) {
    if (err) return console.log(err);
    res.send(users);
  })
});

app.post('/api/remove_order', function (req, res) {
  const collection = dbClient.db('dreemland').collection('orders');
  var id = req.body.id;
  collection.remove({"_id": new objectId(id)});
  res.end();
});

app.post('/api/update_order', function (req, res) {
  const collection = dbClient.db('dreemland').collection('orders');
  var id = req.body.id;
  var name = req.body.name;
  collection.findOneAndUpdate({'_id': new objectId(id)}, {$set: {status: name}});
  res.end();
});

process.on("SIGINT", () => {
  dbClient.close();
  process.exit();
});