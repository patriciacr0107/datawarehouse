const mongoose = require('mongoose');
const validator = require('validator');

const contactSchema = new mongoose.Schema({
  names: {
    type: String,
    required: [true, 'Names is required'],
    trim: true,
    lowercase: true,
  },
  surnames: {
    type: String,
    required: [true, 'Surenames is required'],
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Pleas provide a valid email'],
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
    lowercase: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    lowercase: true,
  },
  interest: {
    type: Number,
    required: [true, 'Interest is required'],
    trim: true,
    lowercase: true,
  },
  chanels: [
    /* {
      account: {
        type: Number,
        required: [true, 'Account is required'],
        trim: true,
        lowercase: true,
      },
    },
    {
      preferences: {
        type: Number,
        required: [true, 'Preferences is required'],
        trim: true,
        lowercase: true,
      },
    },
    {
      chanel: {
        type: mongoose.Schema.ObjectId,
        ref: 'Region',
        required: true,
      },
    }, */
  ],
  company: {
    type: String,
    required: [true, 'Company is required'],
    trim: true,
    lowercase: true,
  },
  region: {
    type: mongoose.Schema.ObjectId,
    ref: 'Region',
    required: true,
  },
  country: {
    type: mongoose.Schema.ObjectId,
    ref: 'Country',
    required: true,
  },
  city: {
    type: mongoose.Schema.ObjectId,
    ref: 'City',
    required: true,
  },
});

contactSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'city',
    select: '-__v',
  });
  next();
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
