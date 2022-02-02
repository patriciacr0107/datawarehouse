const factory = require('./handlerFactory.controller');
const catchAsync = require('../utils/catchAsync');
const moment = require('moment-timezone');
const City = require('../models/city.model');

// Obtiene ciudad por id
exports.getCityById = factory.getOne(City);

// Obtiene todas las ciudades
exports.getAllCities = factory.getAll(City);

// Crea ciudad
exports.createCity = factory.createOne(City);

// Actualiza datos de la ciudad
exports.updateCity = factory.updateOne(City);

// Borra una ciudad
exports.deleteCity = factory.deleteOne(City);
