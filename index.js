const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const admin=require('firebase-admin');
const app = express();
const port = process.env.PORT || 4000;

admin.initializeApp({
  credential: admin.credential.cert(require("./coffee-two-firebase-adminsdk-fbsvc-00ab6d9c77.json")),
  // credential: admin.credential.cert(require(`${process.env.ADMIN_SERVICE}`)),
});

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.COFFEE_USER}:${process.env.COFFEE_PASSWORD}@cluster0.rnwxqk9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // collections
    const coffeesTwoCollection = client.db('coffeeTwoDB').collection('coffesTwo');
    const usersTwoCollection = client.db('coffeeTwoDB').collection('usersTwo')
    // create single coffee data
    app.post('/coffees', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeesTwoCollection.insertOne(newCoffee);
      res.send(result);
    })

    // read all coffee data
    app.get('/coffees', async (req, res) => {
      const result = await coffeesTwoCollection.find().toArray();
      res.send(result)
    })
    // read single coffee data
    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await coffeesTwoCollection.findOne(query);
      res.send(result);
    });
    // delete single coffee data
    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id)
      };
      const result = await coffeesTwoCollection.deleteOne(query);
      res.send(result);
    })
    // update single coffee data
    app.put('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {
        _id: new ObjectId(id)
      };
      const options = { upsert: true };
      const updatedCoffee = req.body;
      console.log(updatedCoffee)
      const updatedDoc = {
        $set: updatedCoffee
      };
      const result = await coffeesTwoCollection.updateOne(filter, updatedDoc, options);
      res.send(result)
    });



    // create single user data
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await usersTwoCollection.insertOne(newUser);
      res.send(result)
    })

    // read all users
    app.get('/users', async (req, res) => {
      const result = await usersTwoCollection.find().toArray();
      res.send(result)
    });

    //read a single user
    app.get('/users/:id', async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result=await usersTwoCollection.findOne(query);
      res.send(result)
    });

    // delete single data
    app.delete('/users/:id', async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const uid=req.query.uid;
      await admin.auth().deleteUser(uid);
      const result=await usersTwoCollection.deleteOne(query);
      res.send(result);
    });

    // update signin time
    app.patch('/users',async(req,res)=>{
      const {email, lastSignInTime}=req.body;
      // console.log(info);
      const filter={email};
      const updatedDoc={
        $set: {
          lastSignInTime: lastSignInTime
        }
      };
      const result=await usersTwoCollection.updateOne(filter, updatedDoc);
      res.send(result)

    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
};


run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('coffee server is running now. this is 4000 ')
});
app.listen(port, (req, res) => {
  console.log(`coffee server is running on  port ${port}`);
})