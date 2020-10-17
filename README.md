# wonderQ - a WONDERful message broker (pun 100% intended)

## Video

I assume you have to review many similar projects and get a bit tired reading code so I've made a video walkthrough, so please sit back, grab some popcorn, and let me read and rationalize my code for you. Think one way mirror pair programming!

Click the picture below to be redirected to youtube!

[![Youtube](http://img.youtube.com/vi/h-rUZpCJAy8/0.jpg)](https://youtu.be/h-rUZpCJAy8 'Youtube')

## Introduction & business requirements

WonderQ is a NodeJS message broker allowing producers to publish messages and consumers to subsequently retrieve these messages and consume them. The WonderQ module must:

1. Allow producers to produce messages and receive a message ID in response as confirmation
2. Allow consumers to retrieve all messages currently not in use
3. Mark messages as in use if they have been retrieved by a consumer
4. Allow consumers to notify the message broker that messages have been processed, and subsequently delete them
5. Make messages not processed within a specified amount of time to be available for use once again

## API Reference

### /API/v1/messages

This is an object representing the messages currently in the WonderQ system. Messages can be created by producers and subsequently retreived by consumers

##### POST API/v1/messages - Create a message

Used by producers to create messages

###### Parameters

body must contain a JSON object with the "data" property

###### Returns

Response code: 201

A messageID confirming the message was added to the queue successfully

##### GET API/v1/messages - Retrieve messages

Used by consumers to get the list of messages that are currently not in use by other consumers

###### Parameters

None

###### Returns

Response code: 200

status: whether or not the get request was successful

messageQueue: A list of data for the respective messages acquired by the consumer

##### DELETE API/v1/messages/:messageID - Delete messages

Used by consumers to inform WonderQ that they have processed the message and will delete from the queue

###### Parameters

messageID - mandatory

###### Returns

Response code: 200 if successful, 404 if messageID not provided

messageID of the specific message that was deleted from WonderQ

# On scaling for production

### code quality and manageability

Currently all handlers and logic is in a single JS file, the project would definitely need to be reorganized and better structured to accomodate for larger teams. Additionally code quality is currently not ideal, we would likely want better data modelling for objects such as messages. Another example problem is within the post request, the ID is based on the Date.now() function, if 2 requests hit at the same time, we would run into collission issues, better ID'ing is necessary. Little things as well like having an appropriate gitignore for the .env file as well is important.

### Lack of logging and error handling

Currently this module expects happy cases and doesn't provide much in the way of error handling or logging. I would likely use much more robust testing, covering a wider variety of edge cases, as well code coverage should increase as well. I have used morgan for logging in the past and have seen great success

### Separation of layers

Currently all service logic and "database" access happens in a single layer, these should be abstracted into a different controller, service, and data access layer. wonderQueue in particular would likely be its own server or database to consist of more permanent storage rather than its current volatile state.

### Security

The system in its present state is very insecure, in production I believe it is imperative to have role based authentication through a tool like auth0 to manage roles, read/write access, etc.

### Performance

The app in its current state would not be able to handle throughout in large magnitudes, for example the get request currently returns all messages, in a production environment we would likely want to implement ranges based on timestamps or limits on the quantity of messages returned based on the consumer's request depending on what it can handle. We would also likely want to implement differing queues for differing services.
