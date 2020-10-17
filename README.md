# wonderQ

## Introduction & business problem

## API Reference

### /API/v1/messages

This is an object representing the messages currently in the WonderQ system. Messages can be created by producers and subsequently retreived by consumers

#### Create a message

##### POST API/v1/messages

Used by producers to create messages

###### Parameters

body must contain a JSON object with the "data" property

###### Returns

Response code: 201

A messageID confirming the message was added to the queue successfully

##### GET API/v1/messages

Used by consumers to get the list of messages that are currently not in use by other consumers

###### Parameters

None

###### Returns

Response code: 200

status: whether or not the get request was successful

messageQueue: A list of data for the respective messages acquired by the consumer

##### DELETE API/v1/messages/:messageID

Used by consumers to inform WonderQ that they have processed the message and will delete from the queue

###### Parameters

messageID - mandatory

###### Returns

Response code: 200 if successful, 404 if messageID not provided

messageID of the specific message that was deleted from WonderQ

# On scaling for production

### code quality and manageability

Currently all handlers and logic is in a single JS file, the project would definitely need to be reorganized and better structured to accomodate for larger teams. Additionally code quality is currently not ideal, we would likely want better data modelling for objects such as messages.

### Lack of logging and error handling

Currently this module expects happy cases and doesn't provide much in the way of error handling or logging. I would likely use much more extensive testing, covering a wider variety of edge cases, as well code coverage should increase as well. I have used morgan for logging in the past and have seen great success

### Separation of layers

Currently all service logic and "database" access happens in a single layer, these should be abstracted into a different controller, service, and data access layer. wonderQueue in particular would likely be its own server or database to consist of more permanent storage rather than its current volatile state.

### Security

The system in its present state is very insecure, in production I believe it is imperative to have role based authentication through a tool like auth0 to manage roles, read/write access, etc.

### Performance

The app in its current state would not be able to handle throughout in large magnitudes, for example the get request currently returns all messages, in a production environment we would likely want to implement ranges based on timestamps or limits on the quantity of messages returned based on the consumer's request depending on what it can handle. We would also likely want to implement differing queues for differing services.

# Script for presentation

Intro: welcome to my presentation, I'm sure you have many of these to go through so I thought it would be much more fun to let you sit back and relax and let me walk you through my code and thought process. First I'll walk you through what I did and my understanding of each business requirement, then I will walk through what I know this project, lacks nad finally get into the requirements around how I would try to get this to scale for high volume, issues in production.

Walk through code from the top
Talk about timer and port

Why I used a hashmap - retrieving and inserting is fast which is key for this case which is important
