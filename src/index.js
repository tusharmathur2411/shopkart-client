const express = require("express");
const app = express();
const productsRouter = require("./routes/products");
const authRouter = require("./routes/googleAuth");
const mongoose = require("mongoose");
const cors = require("cors");
const { UI_ROOT_URI } = require("./config");

app.use(
  cors({
    origin: UI_ROOT_URI,
    credentials: true
  })
);
const uri =
  "mongodb+srv://shopkart:shopkart2411@cluster0.dc0kr.mongodb.net/shopkart?retryWrites=true&w=majority";
mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err) => console.log("DB connecnted")
);

app.use(express.json());

app.use("/auth", authRouter);
app.use("/products", productsRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

const port = process.env.PORT || 5001;
app.listen(port, () =>
  console.log(
    `Server started on port ${port}. ${new Date().toLocaleTimeString(
      undefined,
      { timeZone: "Asia/Kolkata" }
    )}`
  )
);
