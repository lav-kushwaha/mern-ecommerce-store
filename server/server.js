require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require('./routes/auth/auth-routes.js');
const adminProductsRouter = require('../server/routes/admin/products-routes.js')
const shopProductsRouter = require("../server/routes/shop/products-routes.js")
const shopCartRouter = require('../server/routes/shop/cart-routes.js')
const shopAddressRouter = require('../server/routes/shop/address-routes.js')
const shopOrderRouter = require('../server/routes/shop/order-routes.js')
const adminOrderRouter = require('../server/routes/admin/order-routes.js')



const app = express();
const PORT = process.env.PORT || 5000;

//read req.body from client or parse data into json to js.
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:[
        "Content-Type",
        'Authorization',
        'Cache-Control',
        'Expires',
        'Pragma'
    ],
    credentials:true
  })
);

app.use("/api/auth",authRouter);
app.use("/api/admin/products",adminProductsRouter);
app.use("/api/admin/orders",adminOrderRouter);
app.use("/api/shop/products",shopProductsRouter);  
app.use("/api/shop/cart",shopCartRouter);  
app.use('/api/shop/address',shopAddressRouter);
app.use('/api/shop/order', shopOrderRouter);


//connecting DB
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is listening on : http://localhost:${PORT}`);
    });
    console.log("Db is connected");
  })
  .catch((err) => {
    console.log("Database is not connected", err);
  });
