const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/todos', require('./routes/todos'));

app.listen(5000, () => {
  console.log('server has started on port 5000');
});