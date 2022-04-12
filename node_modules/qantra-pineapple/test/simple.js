let Pineapple = require('../index.js');
let pine = new Pineapple();

const run = async ()=>{
    let schema = [
        /** will fail in length */
        {
          path: 'user.firstname',
          label: 'First Name',
          length: { min:3 , max: 8 },
        },
        /** will fail in regex*/
        {
            path: 'user.email',
            label: 'Email',
            regex: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$',
        },
        /** will fail in type */
        {
            path: 'user.age',
            label: 'Age',
            type: 'Number',
        },
        /** will fail in option */
        {
            path: 'user.gender',
            oneOf: ['male','female'],
            required: true,
        },
        /** will fail in reqiured */
        {
            path: 'user.licenseId',
            label: 'license Id',
            required: true,
        }
      ]
      
      let payload = {
        user: {
            firstname: 'bahi hussein abdel baset',
            email: 'jumbo@mumbo@shit',
            age: 'twelve',
            gender: 'monkey',
        }
      }
      
      let error = await pine.validate(payload, schema);
      if(error){
        console.log(error);

        /***
         * [
            {
                label: 'First Name',
                path: 'user.firstname',
                message: 'First Name has invalid length',
                log: '_length',
                errors: []
            },
            {
                label: 'Age',
                path: 'user.age',
                message: 'Age invalid type',
                log: '_type',
                errors: []
            },
            {
                label: 'user.gender',
                path: 'user.gender',
                message: 'user.gender invalid option',
                log: '_oneOf',
                errors: []
            },
            {
                label: 'license Id',
                path: 'user.licenseId',
                message: 'license Id is required',
                log: '_required',
                errors: []
            }
            ]
         */
      }
}


run();