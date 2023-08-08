
import express from "express";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

import cors from "cors";

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ua7kx7j.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


const run = async () => {
  try {
    const db = client.db("pc_builder_lab");
    const productCollection = db.collection("products");

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.toArray();

      res.send({ status: true, data: products });
    });

    // get single product 
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.findOne({ _id: ObjectId(id) });
      console.log(result);
      res.send(result);
    });




    // Get Category wise product 
    app.get('/product/:catUrl', async (req, res) => {

      const categoryPath = req.params.catUrl;

      const result = productCollection.find({ categoryUrl: categoryPath });
      const getCategoryWiseProducts = await result.toArray()
      res.send(getCategoryWiseProducts);
    });

  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Pc Builder Lab app listening on port ${port}`);
});
