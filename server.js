const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const app = express();
const PORT = process.env.PORT || 3000;

// Setting a default timer of 10 seconds
const messageTimeOut = config.messageTimeOut || 10000;

app.use(bodyParser.json());

//Welcome message
app.get('/', (req, res) => {
  res.send('Welcome to WonderQ!');
});

// Using a map because it is quick to insert at O(1) time complexity
const wonderQueue = new Map();

//Producers use this to create messages
//Space complexity: O(1)
//Time complexity: O(1)
app.post('/API/v1/messages', (req, res) => {
  // talk about how at scale this will not work because of 2 requests hitting same time
  const messageID = JSON.stringify(Date.now());
  wonderQueue.set(messageID, {
    inUse: false,
    data: req.body.data,
  });
  console.log(wonderQueue);

  res.status(201).json({
    status: 'Created.',
    messageID: messageID,
  });
});

//Consumers will use this to get messages not currently in use
//Space complexity: O(n)
//Time complexity: O(n)
app.get('/API/v1/messages', (req, res) => {
  const results = [];
  const messageIDs = [];

  //Only messages not in use are available to the consumers
  wonderQueue.forEach((value, key) => {
    if (!value.inUse) {
      value.inUse = true;

      results.push(value.data);
      messageIDs.push(key);
    }
  });

  setTimeout(() => {
    makeAvailable(messageIDs);
  }, messageTimeOut);

  console.log(wonderQueue);

  res.status(200).json({
    status: 'Successful.',
    messageQueue: results,
  });
});

//Consumers will use this to update the messages that they have used
//Space complexity: O(1)
//Time complexity: O(1)
app.delete('/API/v1/messages/:messageID', (req, res) => {
  const messageID = req.params.messageID;

  if (wonderQueue.has(messageID)) {
    wonderQueue.delete(messageID);

    res.status(200).json({
      status: 'Successful',
      messageID: messageID,
    });
  } else {
    res.status(404).json({
      status: 'Message ID not found',
      messageID: messageID,
    });
  }
});

// updating the inUse property to false after the timer elapses (default 30 seconds)
//Time complexity: O(n)
makeAvailable = (messageIDs) => {
  messageIDs.forEach((messageID) => {
    if (wonderQueue.has(messageID)) {
      const message = wonderQueue.get(messageID);
      message.inUse = false;
    }
  });
};

app.listen(PORT, () => {
  console.log(`server is up and listening on PORT: ${PORT}`);
});

exports.app = app;
//For testing purposes
exports.clearQueue = () => {
  wonderQueue.clear();
};
