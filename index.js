const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const port = process.env.PORT || 5000

// middleware
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.crku76a.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    const usersCollection = client.db('airvnvDb').collection('users')
    const roomsCollection = client.db('airvnvDb').collection('rooms')
    const bookingsCollection = client.db('airvnvDb').collection('bookings')



    // save  user email and role in database 
    app.put('/users/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user
      }
      const result = await usersCollection.updateOne(query, updateDoc, options)
      res.send(result)
    });



    // get user 
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email
      const query = { email : email };
      const result = await usersCollection.findOne(query)
      res.send(result)
    });




    // save a room details in data base 
    app.post('/rooms', async (req, res) => {
      const room = req.body;
      const result = await roomsCollection.insertOne(room);
      res.send(result);
    });


    // get all rooms 
    app.get('/rooms', async (req, res,) => {
      const result = await roomsCollection.find().toArray();
      res.send(result);
    });

    // get single rooms 
    app.get('/room/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await roomsCollection.findOne(query)
      res.send(result)
    });




    // save booking in data base 
    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });






    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('AirCNC Server is running..')
})

app.listen(port, () => {
  console.log(`AirCNC is running on port ${port}`)
})
