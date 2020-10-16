const express = require('express');
const app = express();
const port = 3000;

//Welcome message
app.get('/', (req, res) => {
  res.send('Welcome to WonderQ  !');
});

let wonderQueue = [];

//Producers use this to create messages
app.post('/messages', (req, res) => {
  return res.send('POST HTTP method on messages resource');
});

//Consumers will use this to get messages not currently in use
app.get('/messages', (req, res) => {
  try {
    let arrayForThisConsumer = [];
    wonderQueue.forEach((x) => {
      if (x.inUse === false) {
        arrayForThisConsumer.push(x);
        x.inUse = true;
      }
    });
    res.status(200).json({
      status: 'success',
      results: arrayForThisConsumer.length,
      data: {
        messages: arrayForThisConsumer,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

//Consumers will use this to update the messages that they have used
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
