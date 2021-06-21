const { urlencoded } = require('express');
const express = require('express');
const app = express();
const morgan = require('morgan')

app.use(urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('tiny'))

let contacts = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      },
      {
        "name": "Ahmad Ade",
        "number": "234748503",
        "id": 5
      }
]

app.get('/api/persons', (request, response) => {
    response.send(`
    <p>Phonebook has info for ${contacts.length} people</p>
    <div>${new Date().toString()}</div>`)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const contact = contacts.find(person => person.id === id);
    if(!contact) {
     response.status(400).send(`contact with id ${id} doesn't exist`)
    }
    response.send(contact)
})
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  contacts = contacts.filter(contact => contact.id !== id)
    res.send(`<p>contact successfully deleted</p>`)
})
app.post('/api/persons/', (request, response) => {
    const {name, number} = request.body;
    if(!name || !number ){
      response.status(400).send('Please input the required body')
  }
  const sameContact = contacts.find(contact => contact.name == name);
  console.log(sameContact)
  if(sameContact){
    response.status(400).send({ error: 'name must be unique' })
  }
    let id = Math.floor(Math.random() * 200);
    if(id < 5) {
      id = Math.floor(Math.random() * 1000);
    }
    const newContact = {
      name: request.body.name,
      number: request.body.number,
      id
    }
    console.log(newContact)

    
    response.send(newContact)
})

const port = 3000;
app.listen(port)