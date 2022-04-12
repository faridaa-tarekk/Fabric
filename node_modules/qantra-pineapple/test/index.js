
const debug      = require('debug')('qantra:pineapple:test');
const assert     = require('assert');
const juice      = require('./juice');
const {validate}  = require('..');
const expect     = require('expect.js');
 
let schema = [
  {
      label: 'Created By',
      path: 'block.cBy',
      required: true, 
      type: 'String',
      length: { min: 1, max: 300 },
  },
  {
     label: 'Label',
     path: 'block.label',
     required: true,
     type: 'String',
     length: { min: 1, max: 300 }, 
  },
  {
      label: 'TraceId',
      path: 'block.traceId',
      required: false,
      type: 'String',
      length: { min: 1, max: 300 },
  },
  {
      label: 'Tags',
      path: 'block.tags',
      required: false,
      type: 'array',
      length: {
          min: 1, max: 100,
      },
      items: {
          type: 'String',
          length: { 
              min: 1, max: 300 
          },
      }
  },
  {
      label: 'Data',
      path: 'block.data',
      required: true,
      type: 'Object',
  },
  {
      label: 'Flags',
      path: 'block.flags',
      required: false,
      type: 'Object',
      items: [{
          label: 'Flags Item',
          type: 'Boolean',
          path: '*',
      }]
  },
  {
      label: 'Words',
      path: 'block.words',
      required: false,
      type: 'String',
      length: {
          min: 1, max: 1000
      },
  },
  {
      label: 'Meta',
      path: 'block.meta',
      required: false,
      type: 'Object',
  },
  {
      label: 'Counter',
      path: 'block.counter',
      require: false,
      type: 'Object',
      items: [{
          label: 'Counter Item',
          type: 'Number',
          path: '*',
      }]
  },
  
]




describe("test valid objects", function(){
  it("should accept minimal object fields", function(done){
    let payload = {
      block: {
        cBy: juice.model('createdBy'),
        label: 'team-block',
        data: {}
      }
    }
    let res = validate(payload, schema);
    expect(res).to.be.an('boolean');
    expect(res).to.be.false;
    done();
  })
})


// // fisrt model
// describe('Pineapple Model #1', function() {

//   let validationSchema = [
//       {

//           model: 'fullname',
//           required: true,
//           label: 'Fullname',
//           type: 'String',
//           length: {min: 3, max:100},
//           regex: /^([a-zA-Z0-9\s]{3,100})$/,

//       },
//   ];

//   let pineapple = new Pineapple(validationSchema);

//   let model     =   [
//       {model: 'fullname', path: 'user.name'},
//   ];

//   describe('#validate() #regex', function() {

//     it('should not return an error on a valid fullname', function(done) {

//       let payload = { user: {name: juice.model('valid-fullname') }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
      
//       expect(errors).to.be.an('boolean');
//       expect(errors).to.be.false;
//       done();

//     });

//     it('should return an error on an invalid regex fullname', function(done) {

//       let payload = { user: {name: juice.model('invalid-regex-fullname') }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug(model);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_regex');
//       done();

//     });
//   });


//   describe('#validate() #required', function() {

//     it('should return an error on an empty input ', function(done) {

//       let payload = { user: {name:''}};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_required');
//       done();

//     });
//   });

//   describe('#validate() #type', function() {

//     it('should return an error on a number input ', function(done) {

//       let payload = { user: {name: parseInt(juice.model('invalid-num-fullname')) }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_type');
//       done();
//     });

//     it('should return an error on a boolean input ', function(done) {

//       let payload = { user: {name: true }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_type');
//       done();
//     });

//     it('should return an error on an array input ', function(done) {

//       let payload = { user: {name: juice.model('valid-fullname').split(" ") }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_type');
//       done();
//     });
//   });

//   describe('#validate() #length', function() {

//     it('should return an error on an input below min length requirements', function(done) {

//       let payload = { user: {name: juice.model('invalid-length-fullname') }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_length');
//       done();
//     });

//     it('should return an error on an input exceeds max length requirements ', function(done) {

//       let payload = { user: {name: juice.model('invalid-length-fullname-2') }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_length');
//       done();
//     });
//   });

// });




// // second model

// describe('Pineapple Model #2', function() {

//   let validationSchema = [
//       {

//           model: 'email',
//           required: true,
//           label: 'Email',
//           type: 'String',
//           length: {min: 12, max:25},
//           regex:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//       },
//   ];

//   let pineapple = new Pineapple(validationSchema);

//   let model     =   [
//       {model: 'email', path: 'user.email'},
//   ];

//   describe('#validate() #regex', function() {

//     it('should not return an error on a valid email', function(done) {

//       let payload = { user: {email: juice.model('valid-email') }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       expect(errors).to.be.an('boolean');
//       expect(errors).to.be.false;
//       done();

//     });

//     it('should return an error on an invalid regex email', function(done) {

//       let payload = { user: {email: juice.model('invalid-regex-email') }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_regex');
//       done();
//     });
//   });

//   describe('#validate() #require', function() {

//     it('should return an error on an empty input ', function(done) {

//       let payload = { user: {email:''}};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_required');
//       done();
//     });
//   });

//   describe('#validate() #length', function() {

//     it('should return an error on an invalid length email', function(done) {

//       let payload = { user: {email: juice.model('invalid-length-email') }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_length');
//       done();
//     });
//   });

//   describe('#validate() #type', function() {

//     it('should return an error on a numeric input', function(done) {

//       let payload = { user: {email: 1006 }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_type');
//       done();
//     });

//     it('should return an error on a boolean input', function(done) {

//       let payload = { user: {email: true }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_type');
//       done();
//     });

//     it('should return an error on an input array ', function(done) {

//       let payload = { user: {email: juice.model('valid-email').split("") }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_type');
//       done();
//     });
//   });
// });


// // third model

// describe('Pineapple Model #3', function() {

//   let validationSchema = [
//       {
//         model: 'gender',
//         required: true,
//         type: 'String',
//         oneOf: ['male','female']
//       },
//   ];

//   let pineapple = new Pineapple(validationSchema);

//   let model    =   [
//       {model: 'gender', path: 'user.gender'},
//   ];

//   describe('#validate() #require', function() {

//     it('should not return error on an existed gendr', function(done) {

//       let payload = { user: {gender: "female"}};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       expect(errors).to.be.an('boolean');
//       expect(errors).to.be.false;
//       done();

//     });

//     it('should return an error on an empty input', function(done) {

//       let payload = { user: {gender: "eeee" }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_required');
//       done();
//     });
//   });

//   describe('#validate() #type', function() {

//     it('should return an error on an wrong input type ', function(done) {

//       let payload = { user: {gender: 12 }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_type');
//       done();
//     });
//   });

//   describe('#validate() #oneOf', function() {

//     it('should return an error on an wrong input type ', function(done) {

//       let payload = { user: {gender: "males" }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_oneOf');
//       done();
//     });
//   });
// });

// // fourth model

// describe('Pineapple Model #4', function() {

//   let validationSchema= [
//       {
//           model: 'language',
//           required: true,
//           type: 'String',
//           length: 2,
//           oneOf: ['en','ar'],
//       }
//   ];

//   let pineapple = new Pineapple(validationSchema);

//   let model    =   [
//       {model: 'language', path: 'user.language'},
//   ];

//   describe('#validate() #require', function() {

//     it('should not return error on an existed language', function(done) {

//       let payload = { user: {language: "en"}};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       expect(errors).to.be.an('boolean');
//       expect(errors).to.be.false;
//       done();

//     });

//     it('should return an error on an empty input', function(done) {

//       let payload = { user: {language: "" }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_required');
//       done();
//     });
//   });

//   describe('#validate() #type', function() {

//     it('should return an error on an wrong input type ', function(done) {

//       let payload = { user: {language: 12 }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_type');
//       done();
//     });
//   });

//   describe('#validate() #length', function() {

//     it('should return an error on an invalied length of an input', function(done) {

//       let payload = { user: {language: 'eng' }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_length');
//       done();
//     });
//   });

//   describe('#validate() #oneOf', function() {

//     it('should return an error on an wrong input type ', function(done) {

//       let payload = { user: {language: "an" }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_oneOf');
//       done();
//     });
//   });
// });


// // fifth model


// describe('Pineapple Model #5', function() {

//   const validationSchema = [
//       {
//           model: 'date',
//           label: 'date',
//           required: true,
//           canParse: 'date'
//       }
//   ];

//   let pineapple = new Pineapple(validationSchema);

//   let model     =   [
//     { model: 'date', path: 'user.date'}
//   ];

//   describe('#validate() #require', function() {

//     it('should not return error on an existed date', function(done) {

//       let payload = { user: {date: 6565258258528 }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       expect(errors).to.be.an('boolean');
//       expect(errors).to.be.false;
//       done();

//     });

//     it('should return an error on an empty input', function(done) {

//       let payload = { user: {date: 0 }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_required');
//       done();
//     });
//   });


//   describe('#validate() #canParse', function() {

//     it('should return an error on an input can not parse', function(done) {

//       let payload = { user: {date: "7amada" }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_canParse');
//       done();
//     });
//   });
// });


// // sixth model

// describe('Pineapple Model #6', function() {

//   let validationSchema = [
//       {
//          model: 'countries',
//          label: 'Countries',
//          required: true,
//          type: 'String',
//          oneOf: ['egypt','oman','usa']
//      }
//   ];

//   let pineapple = new Pineapple(validationSchema);

//   let model     =   [
//       {model: 'countries', path: 'user.countries'},
//   ];

//   describe('#validate() #require', function() {

//     it('should not return error on an existed country', function(done) {

//       let payload = { user: {countries: "usa"}};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       expect(errors).to.be.an('boolean');
//       expect(errors).to.be.false;
//       done();

//     });

//     it('should return an error on an empty input', function(done) {

//       let payload = { user: {countries: "" }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_required');
//       done();
//     });
//   });

//   describe('#validate() #type', function() {

//     it('should return an error on an wrong input type ', function(done) {

//       let payload = { user: {countries: 12 }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_type');
//       done();
//     });
//     it('should return an error on an wrong input type ', function(done) {

//       let payload = { user: {countries: "usa".split() }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_type');
//       done();
//     });
//   });

//   describe('#validate() #oneOf', function() {

//     it('should return an error on an wrong input type ', function(done) {

//       let payload = { user: {countries: "an" }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_oneOf');
//       done();
//     });
//   });
// });

// // seventh model

// describe('Pineapple Model #7', function() {

//   let validationSchema = [
//     {
//         model: 'address',
//         label: 'shipping address',
//         required: true,
//         type: 'String',
//         length: {min:10, max:40}
//     }
//   ];

//   let pineapple = new Pineapple(validationSchema);

//   let model     =   [
//       {model: 'address', path: 'user.address'},
//   ];

//   describe('#validate() #require', function() {

//     it('should not return error on an existed country', function(done) {

//       let payload = { user: {address: juice.model('valid-address') }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       expect(errors).to.be.an('boolean');
//       expect(errors).to.be.false;
//       done();

//     });

//     it('should return an error on an empty input', function(done) {

//       let payload = { user: {address: "" }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_required');
//       done();
//     });
//   });

//   describe('#validate() #type', function() {

//     it('should return an error on an wrong input type', function(done) {

//       let payload = { user: {address: 1276746 }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_type');
//       done();
//     });
//     it('should return an error on an wrong input type ', function(done) {

//       let payload = { user: {address: juice.model('valid-address').split() }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_type');
//       done();
//     });
//   });

//   describe('#validate() #length', function() {

//     it('should return an error on an invalid length below min ', function(done) {

//       let payload = { user: {address: juice.model('invalid-address-min') }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_length');
//       done();
//     });

//     it('should return an error on an invalid length exceeds max ', function(done) {

//       let payload = { user: {address: juice.model('invalid-address-max') }};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_length');
//       done();
//     });
//   });
// });


// // eighth model

// describe('Pineapple Model #8', function() {

//   let validationSchema= [
//     {
//       model:'geo',
//       required: true,
//       type: 'Array',
//       items: [
//         {
//           path: 'lat',
//           required: true,
//           type: 'Array',
//           items: {
//             type: 'String',
//             length:5
//           }
//         },
//         {
//           path: 'lng',
//           required: true,
//           type: 'Array',
//           items: [
//             {
//               path: 'lng',
//               required: true,
//               type: 'String',
//               length:5
//             }
//           ]
//         }
//       ]
//     }
//   ];

//   let pineapple = new Pineapple(validationSchema);

//   let model     =   [
//     {model: 'geo', path: 'user.geo'},
//   ];

//   describe('#validate() #require', function() {

//     it('should not return an error on an existed location', function(done) {

//       let payload = {
//         user: {
//           geo: [
//             {
//               lat:['aaaaa','eaaaa','eaaaa'],
//               lng:[{lng: '1hhhf'}]
//             }
//           ]
//         }
//    };
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       expect(errors).to.be.an('boolean');
//       expect(errors).to.be.false;
//       done();
//     });

//     it('should return an error on an empty input ', function(done) {

//       let payload = { user: {geo:''}};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_required');
//       done();
//     });
//   });

//   describe('#validate() #type', function() {

//     it('should return an error on a string type input', function(done) {

//       let payload = { user: {geo:'string'}};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_type');
//       done();
//     });

//     it('should return an error on a string type input', function(done) {

//       let payload = { user: {geo: 090909}};
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_type');
//       done();
//     });
//   });

//   describe('#validate() #items', function() {


//     it('should return an error on a lat item lengh ', function(done) {

//       let payload = { user: {geo: [ {
//         lat:['aaa','eaaaa','eaaaa'],
//         lng:[{lng: '1hhhf'}]
//         }
//      ]}
//    };
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_items @index(0)');
//       done();
//     });

//     it('should return an error on a lng item', function(done) {

//       let payload = { user: {geo: [ {
//         lat:['aaaaa','eaaaa','eaaaa'],
//         lng:[{lng: '1hf'}]
//         }
//      ]}
//    };
//       let errors = pineapple.validate(payload, model);
//       debug(payload);
//       debug('errors',errors);
//       expect(errors).to.be.an('array');
//       expect(errors).to.have.length(1);
//       expect(errors[0].log).to.equal('_items @index(0)');
//       done();
//     });
//   });
// });
