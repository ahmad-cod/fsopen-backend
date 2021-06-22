const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const app = express();
const Contact = require('./models/contact');
const { response } = require('express');

app.use(cors());
app.use(express.static('build'))
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms :res[content-length] :body - :req[content-length]'));


app.get('/api/persons', (request, response) => {
  Contact.find({}).then( persons => 
    response.json(persons)
    ).catch(err => console.log('get error', err))
})
app.get('/api/persons/:id', (request, response) => {
    Contact.findById(request.params.id).then(contact => {
       if(contact) {
        response.json(contact)
      }else {
        response.status(404).end()
      }
  }).catch(error => next(error))
})

app.post('/api/persons/', (request, response) => {
    const {name, number} = request.body;
    if(!name){
      response.status(400).json({error : 'name is missing'})
  }else if(!number){
    response.status(400).json({error : 'number is missing'})
}
    
    const contact = new Contact({
      name,
      number
    })
    contact.save().then(savedContact => response.json(savedContact))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number} = req.body;
  const contact = {name, number}
  Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
         .then(updatedContact => res.json(updatedContact))
         .catch(error => next(error))
})

const unknownEndPoint = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndPoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message)
  if(error.name === 'CastError'){
    return res.status(400).send({error: 'malformatted id'})
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
const host = '0.0.0.0';

app.listen(PORT, host, () => {
  console.log(`Server running on port ${PORT}`)
})