const express = require("express");
const app = express();
const cors = require("cors");
const { connectDB } = require("./utils/db");
const { PORT } = require("./constants");

// v1 router
const v1Router = require("./versions/v1/v1.router") 

// cors middleware
app.use(cors());

// Bodyparser middleware
app.use(express.json());

connectDB()
.then(() => {
    app.listen(PORT,() => {
        console.log(`Server running on PORT : ${PORT} `);
    })
})
.catch(() => {
    console.log("Unable to connect to database")
})

// v1 router
app.use("/v1",v1Router)