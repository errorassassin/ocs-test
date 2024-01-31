// Import packages
const express = require("express")
const cors = require('cors');
const home = require("./api/home")

// Middlewares
const app = express();
app.use(express.json());

app.use(cors({
    origin: '*',
    credentials: true,
}));

// Routes
app.use("/api", home);

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
