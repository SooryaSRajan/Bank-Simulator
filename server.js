//express server, use const instead of var
const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const bank = require('./routes/manage_bank');
app.use(express.json());


//connect to mongo db
require("./config/database_config")();
app.use('/bank', bank);

//express json

//listen
app.listen(port, () => console.log(`Listening on port ${port}`));
