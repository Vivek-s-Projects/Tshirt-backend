require('dotenv').config()

const mongoose = require('mongoose');
const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

// My Routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const catagoryRoutes = require('./routes/catagory')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')


// db connection
mongoose.connect(process.env.DATABASE,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
        console.log("DB CONNECTED");
    }).catch(
        (e) => {
            console.log("DB NOT CONNECTED!!");
        }
    )

// This is meadlwear
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())

// Route

app.use("/api",authRoutes)
app.use('/api',userRoutes)
app.use('/api',catagoryRoutes)
app.use('/api',productRoutes)
app.use('/api',orderRoutes)


// port and server start
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App is runing at ${port}`);
})

