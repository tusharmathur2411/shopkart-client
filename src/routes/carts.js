const router = require("express").Router();
const Carts = require("../models/Carts");

router.get("/", async (req, res) => {
    try {
        const { userId } = req;
        const cart = await Carts.findOne({ userId });
        res.json((cart && cart.productList) || {});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { userId, body} = req;
        let cart = await Carts.findOne({ userId });
        if (!cart) {
            cart = await Carts.create({ userId, productList: body })
        }
        else {
            cart.productList = body
            cart = await cart.save();
        }
        
        res.json(cart.productList || {});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
