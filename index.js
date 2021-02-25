var express = require('express');
const cors = require("cors");
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;


// Requiring our models for syncing
var db = require('./models');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())


const userRoutes = require("./controllers/user");
app.use(userRoutes);
const tankRoutes = require("./controllers/tank");
app.use("/api/tanks",tankRoutes);
const fishRoutes = require("./controllers/fish");
app.use("/api/fishes",fishRoutes);

db.sequelize.sync({ force: false }).then(function() {
    app.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
    });
});