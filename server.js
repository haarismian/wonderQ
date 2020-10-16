const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

var config = require('./config');

// Setting a default timer of 10 seconds
const messageTimeOut = config.messageTimeOut || 10000;

//Welcome message
app.get('/', (req, res) => {
  res.send('Welcome to WonderQ!');
});

// Using a map because it is quick to insert at O(1) time complexity
let wonderQueue = new Map();

//Producers use this to create messages
//Space complexity: O(1)
//Time complexity: O(1)
app.post('/API/v1/messages', (req, res) => {
  console.log('I act as the exchange before hitting the queue!');

  let messageID = JSON.stringify(Date.now());
  wonderQueue.set(messageID, {
    inUse: false,
    timeOfCreation: messageID,
    timeLastAccessed: null,
  });

  res.status(201).json({
    status: 'Created.',
    data: {
      messageID: messageID,
    },
  });
});

//Consumers will use this to get messages not currently in use
//Space complexity: O(n)
//Time complexity: O(n)
app.get('/API/v1/messages', (req, res) => {
  // console.log(wonderQueue);
  // console.log('messages get hit');

  //creating a temp message queue to provide to consumers
  let tempMessageQueue = [];
  let currentTime = Date.now();

  //Only messages not in use are available to the consumers
  wonderQueue.forEach((value, key) => {
    if (value.inUse === false) {
      value.inUse = true;
      timeLastAccessed = currentTime;
      tempMessageQueue.push(key);
    }
  });

  res.status(200).json({
    status: 'success',
    results: tempMessageQueue.length,
    data: {
      messageQueue: tempMessageQueue,
    },
  });
});

//Consumers will use this to update the messages that they have used
//Space complexity: n/a no new data structure created
//Time complexity: O(1)
app.put('/API/v1/messages/:messageID', (req, res) => {
  let messageID = req.params.messageID;

  if (wonderQueue.has(messageID)) {
    wonderQueue.delete(messageID);

    res.status(200).json({
      status: 'Successful',
      data: {
        messageID: messageID,
      },
    });
  } else {
    res.status(404).json({
      status: 'Message ID not found',
      data: {
        messageID: messageID,
      },
    });
  }
});

// updating the inUse property to false after the timer elapses (default 30 seconds)
//Space complexity: O(n)
//Time complexity: O(n)
setInterval(() => {
  wonderQueue.forEach((value, key) => {
    let currentTime = Date.now();

    if (currentTime - value.timeLastAccessed > messageTimeOut) {
      value.inUse = false;
    }
  });
}, messageTimeOut);

app.listen(PORT, () => {
  console.log(`server is up and listening on PORT: ${PORT}`);
});
