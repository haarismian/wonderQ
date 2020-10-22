const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const app = express();
const PORT = process.env.PORT || 3000;
const messageTimeOut = config.messageTimeOut || 10000;

app.use(bodyParser.json());

//Welcome message
app.get('/', (req, res) => {
  res.send('Welcome to WonderQ!');
});

// Using a hashtable for its efficient searching, insertion, and deletion
const wonderQueue = new Map();

//Producers use this to create messages
//Space complexity: O(1)
//Time complexity: O(1)
app.post('/API/v1/messages', (req, res) => {
  const messageID = JSON.stringify(Date.now());
  wonderQueue.set(messageID, {
    inUse: false,
    data: req.body.data,
  });

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

// updating the inUse property to false after the timer elapses (default 10 seconds)
//Space complexity: n/a - no data created
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
