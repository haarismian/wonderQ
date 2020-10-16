const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Welcome to WonderQ  !');
});

//Producers use this to create messages
app.post('/messages', (req, res) => {
  return res.send('POST HTTP method on messages resource');
});

//Consumers will use this to get messages not currently in use
app.post('/messages', (req, res) => {
  return res.send('POST HTTP method on messages resource');
});

//Consumers will use this to update the messages that they have used
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
