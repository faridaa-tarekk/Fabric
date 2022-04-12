# pineapple
advanced json object validator specially designed to validate user json input and return readable error messages

![alt text](./pineapple.jpg "juice")


# Install

```npm install qantra-pineapple```

# Simple Usuage

```
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

        /*** OUTPUT
          [
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
```

### Using validation models to avoid repetition 

validation models can be used to define validation object that 
can be used in multiple schemes

```
const models = {
  id: {
    type: 'string'
    regex: '^[a-f\d]{24}$'
  }
}

pine = Pine({models});

let schema1 = [
  {
    path: 'user.id',
    model: 'id'
  },
]

let schema2 = [
  {
    path: 'product.id',
    model: 'id'
  }
]

pine.validate(obj1, schema1);
pine.validate(obj2, schema2);

this will simply compine {...model, ...schemaObject}

```


# Validation Props

* **label**: label is useful for returning a user readable message
* **type**: can be 'string', 'number', 'array', 'object', 'boolean', 'date'
* **required**: true or false
* **length**: can be a number or object length: 5 , length: {min: 10, max: 100}
* **regex**: takes a regex expression to match
* **oneOf**: array of string from which the user value must be included ['male','female']
* **canParse**: takes a string 'int' , 'date' , 'float' check if a value can be parsed.
* **items**: validates array items and takes an a validation model reference object if validating array of strings of validation models reference array if validating array of objects


### Advanced Example

```

//validation schema
let validationModels = [
  {
    model: 'name',
    label: 'Username',
    regex: /^([a-zA-Z0-9\s]{3,50})$/
  },
  {
    model: 'mobile',
    required: false,
  },
  {
    model: 'age',
    label: 'Age',
    type: 'Number',
  },
  {
    model: 'skills',
    label: 'User Skills',
    type: 'Array',
    length: {max:5},
    items: {
      type: 'String',
      length: { min: 3, max: 50}
    }
  },
  {
    model: 'gender',
    label: 'Gender',
    type: 'String',
    oneOf: ['male', 'female'],
  },
  {
    model: 'books',
    label: 'User Books',
    type: 'Array',
    items: [

      {
        label: 'Book Title',
        path: 'title',
        type: 'String',
        required: true,
      },
      {
        label: 'Prints',
        path: 'prints',
        type: 'Array',
        items: [
          {
            label: 'Country',
            path: 'country',
            type: 'String',
            required: true,
          },
          {
            label: 'Release Date',
            path: 'release.date',
            canParse: 'date'
          }
        ]
      }

    ]
  }


]

// user object
let userInput = {
  user: {
    name: 'bahi hussein',
    age: '19',
    skills: ['coding','drawing', 'ts'],
    games: [
      {title: 'outlast', score: 80},
      {title: 'red alert', score: 100},
    ],
    gender: 'ninja',
    books: [
      {
        title: 'bezzels',
        prints: [
          {
            country: 'egypt',
            release:{
              date: 1586193356622
            },
          },
          {
            country: 'uk',
            release:{
              date: 'king toot'
            },
          }
        ]
      }
    ],

    adult: true,

  }
}


//model reference
let modelReference = [
  { model: 'name', path: 'user.name', label: 'Writer Name'},
  { model: 'mobile', path: 'user.mobile', required: true,},
  { model: 'age', path: 'user.age' },
  { model: 'skills', path: 'user.skills' },
  { model: 'gender', path: 'user.gender' },
  { model: 'books',  path: 'user.books' },
]

let pineapple = new Pineapple({models: validationModels});

let result = pineapple.validate(userInput, modelReference);

```

console.log(JSON.stringify(result))

```
[
   {
      "label":"user.mobile",
      "path":"user.mobile",
      "message":"user.mobile is required",
      "log":"_required",
      "errors":[

      ]
   },
   {
      "label":"Age",
      "path":"user.age",
      "message":"Age invalid type",
      "log":"_type",
      "errors":[

      ]
   },
   {
      "label":"User Skills",
      "path":"user.skills",
      "message":"one of the User Skills items is invalid",
      "log":"_length @index(2)",
      "errors":[

      ]
   },
   {
      "label":"Gender",
      "path":"user.gender",
      "message":"Gender invalid option",
      "log":"_oneOf",
      "errors":[

      ]
   },
   {
      "label":"User Books",
      "path":"user.books",
      "message":"one of the User Books items is invalid",
      "log":"_items @index(0)",
      "errors":[
         {
            "label":"Prints",
            "path":"prints",
            "message":"one of the Prints items is invalid",
            "log":"_items @index(1)",
            "errors":[
               {
                  "label":"Release Date",
                  "path":"release.date",
                  "message":"Release Date invalid parsing",
                  "log":"_canParse",
                  "errors":[

                  ]
               }
            ]
         }
      ]
   }
]

```

## Methods

* validate(payload, schema) validates object against schema 
* trim(payload, schema) trim's the object to match schema requirments

# custom validator 
```
const blockPine = new Pineapple({
    models,
    customValidators: {
    'switch': (data)=>{
        let switchKeys = Object.keys(data);
        let valid = true;
        for(let i=0; i<switchKeys.length; i++){
            if(typeof data[switchKeys[i]] !== "boolean"){
                valid = false;
                break;
            }
        }
        return valid;
    },
    counter: (data)=>{
        let counterKeys = Object.keys(data);
        let valid = true;
        for(let i=0; i<counterKeys.length; i++){
            if(!_.isNumber(data[counterKeys[i]])){
                valid = false;
                break;
            }
        }
        return valid;
    }
}});

```

it can be used in the schema with prop custom:<custom validator link>