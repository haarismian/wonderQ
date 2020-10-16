# wonderQ

## What I would do if I had more time

I learned a producer should hit an exchange first then go to queue

Implement features that make it so the consumer doesn't have to wait

organize it better with data models for messages and routes

implement async

different queues for different services

morgan for logs

I am not proud of this

# Things I liked about the assignment

clever way to see how I code plus my knowledge of DS and algorithms

# Things to do still

Write documentation for your API endpoints. Talk about their inputs/outputs, formats, methods, responses, etc

• Discuss in writing (in your Github README): what steps would you need to take in order to scale this system to make it production ready for very high volume? What are potential issues in production that might arise and how would you go about implementing solutions? For each of the previous questions, which tools/technologies would you use and why? Please be detailed.

# Script for presentation

Intro: welcome to my presentation, I'm sure you have many of these to go through so I thought it would be much more fun to let you sit back and relax and let me walk you through my code and thought process. First I'll walk you through what I did and my understanding of each business requirement, then I will walk through what I know this project, lacks nad finally get into the requirements around how I would try to get this to scale for high volume, issues in production.

Walk through code from the top
Talk about timer and port

Why I used a hashmap

Things I know need to be improved:
Separation of layers: controller > service layer > data access layer
Authentication
