const router = require("express").Router();
const Orders = require("../models/Orders");

router.get("/", async (req, res) => {
    try {
        const { userId } = req;
        const orders = await Orders.find({ userId });
        res.json(orders || []);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { userId, body: {
            productList,
            totalAmount
        } } = req;

        if (!productList || productList.constructor !== Object || Object.keys(productList).length === 0) return res.status(400).json({ error: "Product list cannot be empty" });

        Object.keys(productList).forEach(key => {
            const count = productList[key]
            if (count===0 || isNaN(count)) delete productList[key]
        })

        const order = await Orders.create({ userId, productList, totalAmount })
        
        res.json(order || {});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

router.patch("/:orderId", async (req, res) => {
    try {
        const { 
            userId,
            body,
            params: { orderId }
        } = req;

        const order = await Orders.findById(orderId)
        if (userId !== order.userId) res.status(404).json({ error: "Order does not belong to current user"})

        if (body.productList && (body.productList.constructor !== Object || Object.keys(body.productList).length === 0)) return res.status(400).json({ error: "Product list cannot be empty" });

        Object.entries(body).forEach(([key, value]) => order[key]=value);
        
        const newOrder = await order.save();
        
        res.json(newOrder);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
