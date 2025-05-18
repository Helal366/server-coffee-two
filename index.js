const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app=express();
const port=process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// console.log('pass',process.env.COFFEE_PASSWORD)
const uri = `mongodb+srv://coffee-two:fE1vaOPKWpUNzETk@cluster0.rnwxqk9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const coffeesTwoCollection=client.db('coffeeTwoDB').collection('coffesTwo');
    const usersTwoCollection=client.db('coffeeTwoDB').collection('usersTwo')
    // create single coffee data
    app.post('/coffees', async(req,res)=>{
        const newCoffee=req.body;
        console.log(newCoffee);
        const result=await coffeesTwoCollection.insertOne(newCoffee);
        res.send(result);
    })

    // read all coffee data
    app.get('/coffees', async(req,res)=>{
        const result=await coffeesTwoCollection.find().toArray();
        res.send(result)
    })
    // read single coffee data
    app.get('/coffees/:id', async(req,res)=>{
      const id=req.params.id;
      console.log(id);
      const query={_id:new ObjectId(id)}
      const result=await coffeesTwoCollection.findOne(query);
      res.send(result);
    });
    // delete single coffee data
    app.delete('/coffees/:id', async(req,res)=>{
      const id=req.params.id;
      const query={
        _id: new ObjectId(id)
      };
      const result=await coffeesTwoCollection.deleteOne(query);
      res.send(result);
    })
    // update single coffee data
    app.put('/coffees/:id', async(req, res)=>{
      const id=req.params.id;
      const filter={
        _id: new ObjectId(id)
      };
      const options={upsert:true};
      const updatedCoffee=req.body;
      console.log(updatedCoffee)
      const updatedDoc={
        $set: updatedCoffee
      };
      const result = await coffeesTwoCollection.updateOne(filter , updatedDoc, options);
      res.send(result)
    });



    // create single user data
    app.post('/users', async(req,res)=>{
        const newUser=req.body;
        console.log(newUser);
        const result = await usersTwoCollection.insertOne(newUser);
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('coffee server is running now. this is 4000 ')
});
app.listen(port, (req,res)=>{
    console.log(`coffee server is running on  port ${port}`);
})