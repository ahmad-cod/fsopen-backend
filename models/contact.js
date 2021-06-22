const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
// const password = process.argv[2];
const url = process.env.MONGODB_URI;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const contactSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      minLength: 3,
      unique: true
  },
  number: {
      type: String,
      required: true,
      minLength: 8
  }
})

contactSchema.plugin(uniqueValidator)

contactSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v
  }
})
module.exports = mongoose.model('Contact', contactSchema)
