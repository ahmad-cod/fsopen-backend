const mongoose = require('mongoose');

console.log('argv', process.argv)
if(process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2];
const url = `mongodb+srv://ahmad:${password}@cluster0.cxs4b.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
}).then()

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number: String
})

const Contact = mongoose.model('Contact', contactSchema)
if(process.argv.length === 3) {
    return Contact.find({}).then(res => {
        res.forEach(contact => console.log(contact))
        mongoose.connection.close()
    })
}
const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4]
})

contact.save().then(res => {
    console.log('contact saved', contact);
    mongoose.connection.close()
}).catch(err => console.log(err))