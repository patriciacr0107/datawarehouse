const factory = require('./handlerFactory.controller');
const Country = require('../models/country.model');

// Obtiene pais por id
exports.getCountryById = factory.getOne(Country);

// Obtiene todas las paises
exports.getAllCountries = factory.getAll(Country);

// Crea pais
exports.createCountry = factory.createOne(Country);

// Actualiza datos de la pais
exports.updateCountry = factory.updateOne(Country);

// Borra una pais
exports.deleteCountry = factory.deleteOne(Country);
