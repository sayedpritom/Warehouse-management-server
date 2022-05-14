const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden Access' });
        }
        console.log('decoded', decoded);
        req.decoded = decoded;
        next();
    })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6jazw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const itemsCollection = client.db("warehouse").collection("items");

        // Auth 
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({ accessToken })
        })



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
        app.get('/manageInventories/:email', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email;
            const email = req.params.email;

            
            if(email === decodedEmail) {
                const query = { email };
                const options = {sort: { name: 1 }};
                const cursor = itemsCollection.find(query, options);
                const items = await cursor.toArray();
                res.send(items)
            }
            else {
                res.status(403).send({message: 'Forbidden Access'})
            }
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

app.get('/', function (req, res) {
    res.send('Running warehouse server')
})

app.listen(port, () => {
    console.log('listening on port ' + port)
})