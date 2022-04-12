const Juice      = require('qantra-juice');

const charSets = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '1234567890',
    special: '@%+!#$?:~'
  }
  
  const combos = {
    'lowercase': ['lowercase'],
    'uppercase': ['uppercase'],
    'numbers': ['numbers'],
    'alpha-numeric': ['lowercase','uppercase','numbers'],
    'complex': ['lowercase','uppercase','numbers','special'],
    'lowercase-alpha-numeric': ['lowercase', 'numbers'],
    'uppercase-alpha-numeric': ['uppercase', 'numbers']
  }
  
  const templates = {
    'createdBy': [{'alpha-numeric': 100}],
    'valid-fullname': [{'alpha-numeric':8}, ' ', {'alpha-numeric': 5}],
    'invalid-length-fullname': [{'alpha-numeric':1}, ' '],
    'invalid-length-fullname-2': [{'alpha-numeric':51}, ' ', {'alpha-numeric':51}],
    'invalid-num-fullname': [{'numbers':8}, ' ', {'numbers': 5}],
    'invalid-regex-fullname': [{'complex':8}, ' ', {'alpha-numeric': 5}],
    'valid-email': [{ 'lowercase-alpha-numeric': 10 }, '@gmail.com'],
    'invalid-regex-email': [".", { 'lowercase': 3 }, '@gmail.com',],
    'invalid-length-email': [{ 'lowercase': 30 }, '@gmail.com',],
    'valid-address': [{'alpha-numeric': 20}],
    'invalid-address-max': [{'alpha-numeric': 50}],
    'invalid-address-min': [{'alpha-numeric': 8}]
  }
  
  let juice = new Juice(charSets, combos, templates);

  module.exports = juice;