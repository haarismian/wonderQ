const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

//Welcome message
app.get('/', (req, res) => {
  res.send('Welcome to WonderQ  !');
});

let wonderQueue = [];

//Producers use this to create messages
app.post('/messages', (req, res) => {
  console.log(wonderQueue)
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
  console.log(wonderQueue)
  console.log('messages get hit');

  wonderQueue.forEach((x) => {
    if (x.inUse === false) {
      x.inUse = true;
    }
  });
  res.status(200).json({
    status: 'success',
    results: wonderQueue.length,
    data: {
      messages: wonderQueue,
    },
  });

});

//Consumers will use this to update the messages that they have used
app.put('/messages/:messageID', (req, res) => {
  let messageID = req.params.messageID
  console.log("message put hit");

  wonderQueue.forEach((x, index) => {

    // This should be strict on typing but converting it caused a bug I didn't have time to deal with
    if (x.messageID == messageID) {
      console.log('im here')
      wonderQueue.splice(index, 1);
    }

  });

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

