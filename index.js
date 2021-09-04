const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/process.env' });

const port = process.env.PORT;

const indexRoutes = require('./routes/index');

const app = express();

app.use(express.json())
app.use(cors());

app.use('/', indexRoutes);

app.listen(port)