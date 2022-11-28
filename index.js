const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config();
// const { MongoClient, ServerApiVersion } = require('mongodb');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.BIKE_COLLECTION}:${process.env.BIKE_COLLECTION_PASS}@cluster0.y5qodl2.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoriesCollection = client.db("bikeCollection").collection('categories');
        const bikeCategoryCollection = client.db("bikeCollection").collection("bikeCategories")
        const bookingCollection = client.db("bikeCollection").collection("booking")
        const userCollection = client.db("bikeCollection").collection("user")

        //category button data    
        app.get('/categoryItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const categoryName = await bikeCategoryCollection.findOne(query)
            if (!categoryName) {
                return
            }
            const name = categoryName.categoryName;
            const filter = { categories: name };
            const result = await categoriesCollection.find(filter).toArray();
            res.send(result)

        })

        app.get('/bikeCategory', async (req, res) => {
            const query = {};
            const bikeCategory = await bikeCategoryCollection.find(query).toArray();
            res.send(bikeCategory)
        })
        //add category api
        app.get('/categories', async (req, res) => {
            const query = {};
            const category = await categoriesCollection.find(query).toArray();
            res.send(category)
        })

        app.post('/categories', async (req, res) => {
            const category = req.body;
            const result = await categoriesCollection.insertOne(category);
            res.send(result)
        })

        app.get('/user/booking', async (req, res) => {
            const query = { Email: req.query.Email };
            const result = await bookingCollection.find(query).toArray();
            res.send(result)
        })

        //booking api
        app.get('/booking', async (req, res) => {
            const query = {};
            const booking = await bookingCollection.find(query).toArray();
            res.send(booking)
        })

       

        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking)
            res.send(result)
        })
        //user api 
        app.get('/user', async (req, res) => {
            const query = {};
            const user = await userCollection.find(query).toArray();
            res.send(user)
        })
        // user admin api
      
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isAdmin: user?.Option === 'admin' });
        })
        //user buyer api
        app.get('/users/buyer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isBuyer: user?.Option === 'Buyer' });
        })
        //user seller api
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isSeller: user?.Option === 'Seller' });
        })
//all user api
        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    Option: 'admin'
                }
            }
            const result = await userCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            console.log(result)
            res.send(result);



        })

        // buyer api
        app.get('/user/buyer', async (req, res) => {
            const query = { Option: "Buyer" };
            const result = await userCollection.find(query).toArray();
            res.send(result)
        })
        //seller api
        app.get('/user/seller', async (req, res) => {
            const query = { Option: "Seller" };
            const result = await userCollection.find(query).toArray();
            res.send(result)
        })
        //admin api
        app.get('/user/admin',async(req,res)=>{
           const  query={Option:"admin"};
            const result=await userCollection.find(query).toArray();
            res.send(result);
        })


    }
    finally {

    }
}
run().catch(console.log);








app.get('/', (req, res) => {
    res.send('bike server is running')
})
app.listen(port, () => {
    console.log(`bike server is running port is ${port}`)
})