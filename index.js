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

    const blogCollection = client.db("Bibek").collection("blogs");
    const commentCollection = client.db("Bibek").collection("comment");
    
    

    // Send a ping to confirm a successful connection
    


    app.get('/search', async (req, res) => {
  const query = req.query.q; // Get the search query from the request

  try {
    const items = await blogCollection.find({
  $or: [
    // { title: { $regex: query, $options: 'i' } },
    // { longDescription: { $regex: query, $options: 'i' } },
    { category: { $regex: query, $options: 'i' } },
  ],
}).toArray();
    res.send(items);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});




    app.post ("/blogs", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await blogCollection.insertOne(data);
      res.send(result);

    })

    


    app.post ("/comment", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await commentCollection.insertOne(data);
      res.send(result);

    })

    app.get("/comment/:id", async (req, res) => {
      
      const id = req.params.id;
      const result = await commentCollection.find({productId: id}).toArray();
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
      
      const result = await blogCollection.find().limit(6).toArray();
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

      const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    
    
    });


    app.delete("/watchlist1/:id", async (req, res) => {
      
      const id = req.params.id;
      console.log(id);

      const result = await watclistcollection.deleteOne({ _id: id });
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

          title: reviewm.title,
          email: reviewm.email,
          image: reviewm.image,
          longDescription: reviewm.longdescription,
          shortDescription: reviewm.shortdescription,
          category: reviewm.genre

        },
      }

      const result = await blogCollection.updateOne(filter, updatedReview, options);
      res.send(result);

    
    
    });


    // app.get("/reviews", async (req, res) => {
      
    //   const result = await blogCollection.find().toArray();
    //   res.send(result);
     
    // })


    app.get("/blogs", async (req, res) => {
      
      const result = await blogCollection.find().toArray();
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
