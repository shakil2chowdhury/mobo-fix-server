const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const dbName = process.env.DB_NAME
const port = 5000;

app.use(cors())
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kzwlr.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(error => {
  const serviceCollection = client.db(dbName).collection("services");
  const ordersCollection = client.db(dbName).collection("orders");
  const adminCollection = client.db(dbName).collection("admins");
  const reviewCollection = client.db(dbName).collection("testimonials");

  app.post('/addService', (req, res) => {
    const newService = req.body;
    serviceCollection.insertOne(newService)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/addReview', (req, res) => {
    const newService = req.body;
    reviewCollection.insertOne(newService)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/getServices', (req, res) => {
    serviceCollection.find()
      .toArray((err, services) => {
        res.send(services)
      })
  })

  app.get('/getAllOrders', (req, res) => {
    ordersCollection.find()
      .toArray((err, allOrders) => {
        res.send(allOrders)
      })
  })

  app.get('/getReviews', (req, res) => {
    reviewCollection.find()
      .toArray((err, reviews) => {
        res.send(reviews)
      })
  })


  app.get('/checkout/:id', (req, res) => {
    serviceCollection.find({ "_id": ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  });

  app.put('/update/:id', (req, res) => {
    ordersCollection.updateOne({ _id: ObjectId(req.params.id) },
      {
        $set: { orderStatus: "Active" }
      })
      .then(result => res.send(true))
  });

  app.post('/getOrders', (req, res) => {
    const email = req.body.email;
    ordersCollection.find({ email: email })
      .toArray((err, orders) => {
        res.send(orders)
      })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/addNewAdmin', (req, res) => {
    const email = req.body;
    adminCollection.insertOne(email)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err, admins) => {
        res.send(admins.length > 0)
      })
  })
  app.delete('/deleteService/:id', (req, res) => {
    serviceCollection.deleteOne({ '_id': ObjectId(req.params.id) })
      .then(result => res.send(result.deletedCount > 0))
  })
})

app.get('/', (req, res) => {
  res.send('Welcome')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})