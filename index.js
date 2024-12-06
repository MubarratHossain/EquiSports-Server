const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6zv7z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const database = client.db("SportsEquipmentDB");
    const productsCollection = database.collection("products");
    const categoriesCollection = database.collection("categories");
    const equipmentsCollection = database.collection("equipments");

    // POST endpoint for adding a new product
    app.post('/products', async (req, res) => {
      try {
        const sportsEquipment = req.body;
        if (!sportsEquipment || Object.keys(sportsEquipment).length === 0) {
          return res.status(400).send({ message: "Invalid data provided" });
        }

        const result = await productsCollection.insertOne(sportsEquipment);
        res.status(201).send({ message: "Product added successfully", result });
      } catch (error) {
        res.status(500).send({ message: "Failed to add product", error: error.message });
      }
    });

    // GET endpoint for fetching all products
    app.get('/products', async (req, res) => {
      try {
        const products = await productsCollection.find({}).toArray();
        res.status(200).send(products);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch products", error: error.message });
      }
    });

    // POST endpoint for adding a new category
    app.post('/categories', async (req, res) => {
      try {
        const category = req.body;
        if (!category || !category.name) {
          return res.status(400).send({ message: "Invalid category data provided" });
        }

        const result = await categoriesCollection.insertOne(category);
        res.status(201).send({ message: "Category added successfully", result });
      } catch (error) {
        res.status(500).send({ message: "Failed to add category", error: error.message });
      }
    });

    // GET endpoint for fetching all categories
    app.get('/categories', async (req, res) => {
      try {
        const categories = await categoriesCollection.find({}).toArray();
        res.status(200).send(categories);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch categories", error: error.message });
      }
    });

    // POST endpoint for adding a new equipment
    app.post('/add_equipments', async (req, res) => {
      try {
        const equipment = req.body;
        if (!equipment || Object.keys(equipment).length === 0) {
          return res.status(400).send({ message: "Invalid equipment data provided" });
        }

        const result = await equipmentsCollection.insertOne(equipment);
        res.status(201).send({ message: "Equipment added successfully", result });
      } catch (error) {
        res.status(500).send({ message: "Failed to add equipment", error: error.message });
      }
    });

    // GET endpoint for fetching all equipments
    app.get('/add_equipments', async (req, res) => {
      try {
        const equipments = await equipmentsCollection.find({}).toArray();
        res.status(200).send(equipments);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch equipments", error: error.message });
      }
    });

    app.get('/add_equipments/:id', async (req, res) => {
      const id = req.params.id;

      try {
        
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid ID format' });
        }

        const equipmentItem = await equipmentsCollection.findOne({ _id: new ObjectId(id) });
       

        if (!equipmentItem) {
          return res.status(404).json({ message: 'Equipment not found' });
        }

        res.json(equipmentItem);
      } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
      }
    });

    console.log("Connected to MongoDB and routes are ready!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
  }
}

run().catch(console.dir);

app.get('/', async (req, res) => {
  res.send('Sports Equipment server is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
