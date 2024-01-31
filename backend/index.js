// Import packages
const express = require("express")
const home = require("./api/home")

// Middlewares
const app = express();
app.use(express.json());

// Routes
app.use("/api", home);

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
