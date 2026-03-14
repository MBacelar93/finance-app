const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

