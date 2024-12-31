require("dotenv").config();
const express = require("express");
const cors = require("cors");

const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const uuid = require('uuid');


// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });







const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.28bsr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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
    // await client.connect();


    const reviewscollection = client.db("Bibek").collection("reviews");
    const watclistcollection = client.db("Bibek").collection("watchlist");
    
    

    // Send a ping to confirm a successful connection
    





    app.post ("/reviews", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await reviewscollection.insertOne(data);
      res.send(result);

    })


    app.post ("/watchlist", async (req, res) => {
      const _id = uuid.v4();
      const data = req.body;
      console.log(data);
      const result = await watclistcollection.insertOne({
        ...data,
        _id: _id
      });
      res.send(result);

    })


    app.get("/watchlist", async (req, res) => {
      const {email} = req.query;
      const result = await watclistcollection.find({email}).toArray();
      res.send(result);
    })



    app.get("/", async (req, res) => {
      
      const result = await reviewscollection.find().limit(6).toArray();
      console.log(result);
      res.send(result);
     
    })


    app.get("/my-review", async (req, res) => {
      
      const {email} = req.query;
      console.log(email)
      const result = await reviewscollection.find({email}).toArray();
      res.send(result);
     
    })


    app.delete("/my-review1/:id", async (req, res) => {
      
      const id = req.params.id;

      const result = await reviewscollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    
    
    });



    app.put("/update-reviews/:id", async (req, res) => {
      
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const reviewm = req.body;
      
    
      const updatedReview = {
        $set: {
          name: reviewm.name,
          title: reviewm.title,
          email: reviewm.email,
          thumbnail: reviewm.thumbnail,
          rating: reviewm.rating,
          publishing_year: reviewm.publishing_year,
          description: reviewm.description,
          genre: reviewm.genre

        },
      }

      const result = await reviewscollection.updateOne(filter, updatedReview, options);
      res.send(result);

    
    
    });


    app.get("/reviews", async (req, res) => {
      
      const result = await reviewscollection.find().toArray();
      res.send(result);
     
    })


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    // await client.db("admin").command({ ping: 1 });



   

   
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


const users =[
  {id:1, name:'sakib', email:'sakib@com'},
  {id:2, name:'sakib', email:'sakib@com'},
  {id:3, name:'sakib', email:'sakib@com'},

]
// Root endpoint
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });


app.get("/users", (req, res) => {
  res.send(users);
});






// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
