require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vhsik0t.mongodb.net/?appName=Cluster0`;

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

    // get users
    app.get('/users', async(req, res) =>{
        const cursor = usersCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    });

    // get users details
    app.get('/users/:id', async(req, res) =>{
        const id = req.params.id
        console.log('user is', id);
        const query = {
            _id: new ObjectId(id)
        }
        const user = await usersCollection.findOne(query)
        res.send(user)
    })

    // post or insert the user 
    app.post('/users', async(req, res)=> {
        const newUser = req.body;
        console.log('user to be inserted', newUser);
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
    })

    // update user
    app.patch('/users/:id', async (req, res)=>{
        const id = req.params.id
        console.log('user is', id);
        const filter = {
            _id: new ObjectId(id)
        }

        const modifiedUser = req.body;

        const updateDocument = {
            $set: {
                name: modifiedUser.name,
                email: modifiedUser.email,
                role: modifiedUser.role
            }
        }

        const result = await usersCollection.updateOne(filter, updateDocument);
        res.send(result);
    })


    // delete user
    app.delete('/users/:id', async(req, res) =>{
        const id = req.params.id
        console.log('user is', id);

        const query = {
            _id: new ObjectId(id) 
        }

        const result = await usersCollection.deleteOne(query)
        res.send(result)
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
