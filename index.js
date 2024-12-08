const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6zv7z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const database = client.db("SportsEquipmentDB");
    const productsCollection = database.collection("products");
    const categoriesCollection = database.collection("categories");
    const equipmentsCollection = database.collection("equipments");
    const usersCollection = database.collection("users");
    const myItemsCollection = database.collection("my-items");

    app.post('/my-items', async (req, res) => {
      try {
        const equipmentItem = req.body.equipmentItem; 

        if (!equipmentItem) {
          res.status(400).send({ message: "Invalid equipment data" });
          return;
        }

        
        const result = await myItemsCollection.insertOne({
          equipmentItem: equipmentItem,
          addedAt: new Date(),
        });

        res.send({ message: "Item added to 'my-items' collection", result });
      } catch (error) {
        res.status(500).send({ message: "Failed to add item", error: error.message });
      }
    });

    
    app.get('/my-items', async (req, res) => {
      try {
        const myItems = await myItemsCollection.find({}).toArray();
        res.send(myItems);  
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch items", error: error.message });
      }
    });
    app.get('/my-items/:id', async (req, res) => {
      const id = req.params.id;
      try {
        
        if (!ObjectId.isValid(id)) {
          res.status(400).send({ message: "Invalid ID format" });
          return;
        }
    
        
        const item = await myItemsCollection.findOne({ _id: new ObjectId(id) });
    
        if (!item) {
          res.status(404).send({ message: "Item not found" });
          return;
        }
    
        
        res.send(item);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch item", error: error.message });
      }
    });
    
    app.delete('/my-items/:id', async (req, res) => {
      const id = req.params.id;
      try {
        if (!ObjectId.isValid(id)) {
          res.status(400).send({ message: "Invalid ID format" });
          return;
        }
        const result = await myItemsCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          res.status(404).send({ message: "Item not found" });
          return;
        }
        res.send({ message: "Item deleted successfully" });
      } catch (error) {
        res.status(500).send({ message: "Failed to delete item", error: error.message });
      }
    });
    app.put('/my-items/:id', async (req, res) => {
      const id = req.params.id; 
      let updatedFields = req.body; 
    
      try {
        
        if (!ObjectId.isValid(id)) {
          res.status(400).send({ message: "Invalid ID format" });
          return;
        }
    
        
        if (updatedFields._id) {
          delete updatedFields._id;
        }
    
        
        const result = await myItemsCollection.updateOne(
          { _id: new ObjectId(id) }, 
          { $set: updatedFields }, 
          { returnDocument: 'after' } 
        );
    
        if (result.value) {
          res.status(200).send({ message: "Item updated successfully", updatedItem: result.value });
        } else {
          res.status(404).send({ message: "Item not found" });
        }
      } catch (error) {
        console.error("Update error:", error.message);
        res.status(500).send({ message: "Failed to update item", error: error.message });
      }
    });
    
    
    

    app.post('/products', async (req, res) => {
      try {
        const sportsEquipment = req.body;
        if (!sportsEquipment || Object.keys(sportsEquipment).length === 0) {
          res.status(400).send({ message: "Invalid data provided" });
          return;
        }
        const result = await productsCollection.insertOne(sportsEquipment);
        res.send({ message: "Product added successfully", result });
      } catch (error) {
        res.status(500).send({ message: "Failed to add product", error: error.message });
      }
    });


    app.get('/products', async (req, res) => {
      try {
        const products = await productsCollection.find({}).toArray();
        res.send(products);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch products", error: error.message });
      }
    });



    app.post('/categories', async (req, res) => {
      try {
        const category = req.body;
        if (!category || !category.name) {
          res.status(400).send({ message: "Invalid category data provided" });
          return;
        }
        const result = await categoriesCollection.insertOne(category);
        res.send({ message: "Category added successfully", result });
      } catch (error) {
        res.status(500).send({ message: "Failed to add category", error: error.message });
      }
    });


    app.get('/categories', async (req, res) => {
      try {
        const categories = await categoriesCollection.find({}).toArray();
        res.send(categories);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch categories", error: error.message });
      }
    });



    app.post('/add_equipments', async (req, res) => {
      try {
        const equipment = req.body;
        if (!equipment || Object.keys(equipment).length === 0) {
          res.status(400).send({ message: "Invalid equipment data provided" });
          return;
        }
        const result = await equipmentsCollection.insertOne(equipment);
        res.send({ message: "Equipment added successfully", result });
      } catch (error) {
        res.status(500).send({ message: "Failed to add equipment", error: error.message });
      }
    });


    app.get('/add_equipments', async (req, res) => {
      try {
        const equipments = await equipmentsCollection.find({}).toArray();
        res.send(equipments);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch equipments", error: error.message });
      }
    });


    app.get('/add_equipments/:id', async (req, res) => {
      const id = req.params.id;
      try {
        if (!ObjectId.isValid(id)) {
          res.status(400).send({ message: "Invalid ID format" });
          return;
        }
        const equipmentItem = await equipmentsCollection.findOne({ _id: new ObjectId(id) });
        if (!equipmentItem) {
          res.status(404).send({ message: "Equipment not found" });
          return;
        }
        res.send(equipmentItem);
      } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });
    app.put('/add_equipments/:id', async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
    
      try {
        if (!ObjectId.isValid(id)) {
          res.status(400).send({ message: "Invalid ID format" });
          return;
        }
    
        const result = await equipmentsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedProduct }
        );
    
        if (result.matchedCount > 0) {
          res.status(200).send({ message: 'Product updated successfully' });
        } else {
          res.status(404).send({ message: 'Product not found' });
        }
      } catch (error) {
        console.error('Error updating product:', error); 
        res.status(500).send({ message: 'Server error', error: error.message });
      }
    });
    
    

    app.post('/users', async (req, res) => {
      try {
        const newUser = req.body;
        if (!newUser || !newUser.name || !newUser.email) {
          res.status(400).send({ message: "Invalid user data provided" });
          return;
        }
        const result = await usersCollection.insertOne(newUser);
        res.send({ message: "User created successfully", result });
      } catch (error) {
        res.status(500).send({ message: "Failed to create user", error: error.message });
      }
    });


    app.get('/users', async (req, res) => {
      try {
        const users = await usersCollection.find({}).toArray();
        res.send(users);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch users", error: error.message });
      }
    });
    app.get('/add_equipments/:id', async (req, res) => {
      const id = req.params.id;
      try {
        
        if (!ObjectId.isValid(id)) {
          res.status(400).send({ message: "Invalid ID format" });
          return;
        }
    
       
        const equipment = await equipmentsCollection.findOne({ _id: new ObjectId(id) });
    
        
        if (!equipment) {
          res.status(404).send({ message: "Equipment not found" });
          return;
        }
    
        
        res.send(equipment);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch equipment", error: error.message });
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
