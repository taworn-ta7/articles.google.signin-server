'use strict';
const cors = require('cors');
const express = require('express');
const app = express();

// add modules to express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/signin', require('./signin'));

// listen to port
const port = 8080;
app.listen(port, () => console.log(`server listening on port: ${port}`));
