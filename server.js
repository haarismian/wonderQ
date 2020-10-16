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
  console.log('messages post hit');

  let messageID = Date.now();
  wonderQueue.push({
    messageID: messageID,
    inUse: false,
  });

  res.status(201).json({
    status: 'Success',
    data: {
      messageID: messageID,
    },
  });
});

//Consumers will use this to get messages not currently in use
app.get('/messages', (req, res) => {
  console.log('messages get hit');

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
app.put('/messages/:messageID', (req, res) => {
  console.log(req.params.messageID);
  console.log(req.body);

  wonderQueue.forEach((x, index) => {
    if (x.messageID === messageID) {
      wonderQueue.splice(index, 1);
    }
  });

  res.status(200).json({
    status: 'Success',
    data: {
      recipe: 'Big Mac',
    },
  });
});
