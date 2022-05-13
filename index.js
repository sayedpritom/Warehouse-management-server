const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/', function (req, res) {
    res.send('Hello World')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6jazw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const itemsCollection = client.db("warehouse").collection("items");

        // Items API 

        // get 6 inventory items for home page
        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = itemsCollection.find(query).limit(6);
            const items = await cursor.toArray();
            res.send(items)
        })

        // get all items for manageInventories page
        app.get('/manageInventories', async (req, res) => {
            const query = {};
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items)
        })

        // get all items for manageInventories page added by a particular user
        app.get('/manageInventories/:email', async (req, res) => {
            const query = { email: req.params.email };
            const options = {
                // sort returned documents in ascending order by title (A->Z)
                sort: { name: 1 },
            };
            const cursor = itemsCollection.find(query, options);
            const items = await cursor.toArray();
            res.send(items)
        })

        // get a particular item
        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemsCollection.findOne(query);
            res.send(item)
        })

        // update an item
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const updatedItem = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    name: updatedItem.name,
                    price: updatedItem.price,
                    description: updatedItem.description,
                    img: updatedItem.img,
                    supplier: updatedItem.supplier,
                    quantity: updatedItem.quantity,
                },
            };
            const result = await itemsCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        // delete an item
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const updatedItem = req.body;
            const query = { _id: ObjectId(id) };

            const result = await itemsCollection.deleteOne(query);
            if (result.deletedCount === 1) {
                console.log("Successfully deleted one document.");
            } else {
                console.log("No documents matched the query. Deleted 0 documents.");
            }
            res.send(result)
        })

        // create an item
        app.post('/add', async (req, res) => {
            const doc = req.body;
            const result = await itemsCollection.insertOne(doc);
            res.send(result)
            console.log(`A document was inserted with the _id: ${result.insertedId}`);

        })


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);



app.listen(port, () => {
    console.log('listening on port ' + port)
})