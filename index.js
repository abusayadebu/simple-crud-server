const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://simpleCrudUser:UhlJZ4hTxZJBCVsO@cluster0.vhsik0t.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const run = async ()=> {
    try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db('simpleCrud');
    const usersCollection = db.collection('users')

    app.get('/users', async(req, res) =>{
        const cursor = usersCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } 
    
    finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('simple crud server is running');
})


app.listen(port, ()=>{
    console.log(`simple crud running on ${port}`);
})
