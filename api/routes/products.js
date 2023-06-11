const router = require("express").Router();
const Products = require("../models/Products");

router.get("/", async (req, res) => {
  try {
    const products = await Products.find();
    res.json(products || []);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
