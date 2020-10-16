let wonderQueue = [];

wonderProducer = () => {
  let messageID = Date.now();
  wonderQueue.push({
    messageID: messageID,
    inUse: false,
  });

  return messageID;
};

wonderConsumerGet = () => {
  let arrayForThisConsumer = [];
  wonderQueue.forEach((x) => {
    if (x.inUse === false) {
      arrayForThisConsumer.push(x);
      x.inUse = true;
    }
  });
};

wonderConsumerConfirm = (messageID) => {
  wonderQueue.forEach((x, index) => {
    if (x.messageID === messageID) {
      wonderQueue.splice(index, 1);
    }
  });
};
