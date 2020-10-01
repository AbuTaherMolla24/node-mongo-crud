const express = require('express');


const bodyParser = require('body-parser');
const { response } = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;


const uri = "mongodb+srv://organicUser:mahbub123@cluster0.kluoa.mongodb.net/orgamicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})


client.connect(err => {
  const productCollection = client.db("orgamicdb").collection("products");

  app.get("/products", (req, res) => {
    productCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/products/:id', (req, res) => {
    productCollection.find({_id: ObjectID(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })
  
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
    .then(result =>{
      console.log('data added successfully');
      res.redirect('/');
    })
  })

  app.patch('/update/:id', (req, res) => {
    console.log(req.body.price);
    productCollection.updateOne({_id: ObjectID(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then( result => {
      response.send(result.modifiedCount >0);
    })
  })

  app.delete('/delete/:id', (req, res) => {
    productCollection.deleteOne({_id: ObjectID(req.params.id)})
    .then( result => {
      response.send(result.deletedCount > 0 );
    })
  })
  
});


app.listen(3000);