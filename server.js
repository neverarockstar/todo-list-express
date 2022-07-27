//Imports the express library
const express = require('express')
//defines a shorthand variable for use in methods
const app = express()
//enables use of mongoDB client module - connects to database
const MongoClient = require('mongodb').MongoClient
//defines a variable to assign a port for express to listen on
const PORT = 2121
//loads.env package and calls config method from it - imports .env file from root directory
require('dotenv').config()

//giving db a name so we don've have to retype
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//initialize the connection to mongoDB
//Returns a promise. If resolved, connection successful. If rejected, connection failed.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// handling a successfully resolved promise and printing to the console.
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        // assigning the connected client instance, attached to the 'db' variable
        db = client.db(dbName)
    })
    .catch(error => console.error(error))

//telling express that ejs is the view engine
app.set('view engine', 'ejs')
//serve everything in the public folder as is
app.use(express.static('public'))
//middleware (intercepts requests/responses) - allows data to be passed to server by request (https://localhost/route?=value&othervariable=othervalue)
app.use(express.urlencoded({ extended: true }))
//telling express to read json
//middleware to load the json body parser for incoming request
app.use(express.json())

//defines a get method at the route of the server/ When there is a request to the root url, do this
app.get('/',async (request, response)=>{
    //get all documents in the 'todos' collection and push them to an array
    const todoItems = await db.collection('todos').find().toArray()
    //request to return a count of all records with the 'completed' field equal to false
    const itemsLeft = await db
        .collection('todos')
        .countDocuments({completed: false})
    //render the 
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//POST method for receiving a new todo item
app.post('/addTodo', (request, response) => {
    //adds new todo item to the db with the completed field defaulted to false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //handles retured promise, logs to the server and redirects back to root page
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    //logs an error to the console if there is one
    .catch(error => console.error(error))
})

//defines an endpoint to handle a put request
app.put('/markComplete', (request, response) => {
    //updates a record using values received from 'itemFromJS' in the body of the request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //When the DB is updated, it will sort everything and put anythning new to the end of the list and not the top
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        //ID and -1 puts stuff at end of array
        upsert: false
    })
    //If successful, log and send the response. If not, log the error
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//defines an endpoint to handle a put request
app.put('/markUnComplete', (request, response) => {
    //updates a record using values received from 'itemFromJS' in the body of the request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //When the DB is updated, it will sort everything and put anything new to the end of the list and not the top
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        //ID and -1 puts stuff at end of array
        upsert: false
    })
    //If successful, log and send the response. If not, log the error
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//defines an endpoint to handle a delete request
app.delete('/deleteItem', (request, response) => {
    //mongodb function to delete a single todo item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //if successful, log and send response
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //if it fails, log the error
    .catch(error => console.error(error))

})

//starts the server and waits for requests
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})