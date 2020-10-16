const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

//Welcome message
app.get('/', (req, res) => {
  res.send('Welcome to WonderQ  !');
});

let wonderQueue = new Map();

//Producers use this to create messages
app.post('/messages', (req, res) => {
  console.log(wonderQueue);
  console.log('messages post hit');

  let messageID = JSON.stringify(Date.now());
  wonderQueue.set(messageID, { inUse: false });

  res.status(201).json({
    status: 'Success',
    data: {
      messageID: messageID,
    },
  });
});

//Consumers will use this to get messages not currently in use
//Space complexity:
//Time complexity:
app.get('/messages', (req, res) => {
  // console.log(wonderQueue);
  // console.log('messages get hit');

  let messageQueue = [];

  wonderQueue.forEach((value, key) => {
    if (value.inUse === false) {
      value.inUse = true;
    }
    messageQueue.push(key);
  });

  res.status(200).json({
    status: 'success',
    results: messageQueue.length,
    data: {
      messageQueue: messageQueue,
    },
  });
});

//Consumers will use this to update the messages that they have used
app.put('/messages/:messageID', (req, res) => {
  let messageID = req.params.messageID;
  console.log('message put hit');

  if (wonderQueue.has(messageID)) {
    wonderQueue.delete(messageID);
  }

  res.status(201).json({
    status: 'Success',
    data: {
      messageID: messageID,
    },
  });
});

app.listen(PORT, () => {
  console.log(`server is up and listening on PORT: ${PORT}`);
});
