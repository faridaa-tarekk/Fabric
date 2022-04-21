const Pineapple = require("qantra-pineapple");
const fs = require("firebase-admin");

const serviceAccount = require("./credentials.json");
fs.initializeApp({
  credential: fs.credential.cert(serviceAccount),
});
const db = fs.firestore();
const fabricDb = db.collection("fabricSchema");
const rideDb = db.collection("overwriteSchema");

class PayloadLearner {
  constructor() {
    this.fields = {};
  }

  /** 
    receive api with associated payload, and checks the api.
    if api exists, then updateschema is called to update payload.
    if api doesnt exist, then fetchschems is called to create new payload.
  **/
  async add({ api, payload, flagOverwrite }) {
    var getFabric = await this.fetchFromFirebase(api);
    if (this.fields[api]) {
      var s = this._updateSchema(payload, api);
    } else {
      this.fields[api] = this._fetchSchema(payload);
    }
    if (flagOverwrite) {
      const getOverwrite = await rideDb.where("api", "==", api).get();
      var query = getOverwrite.docs;
      if (query && query.length > 0) {
        var qData = query[0].data();

        for (const key in qData.schema) {
          if (Object.keys(this.fields[api]).includes(key)) {
            var valueFields = this.fields[api];
            var valueSchema = qData.schema;
            valueFields[key] = valueSchema[key];
          }
        }
      }
    }

    await this.setinFirebase(api, getFabric);
  }

  /**
    receives existing api with payload. 
    Calls the flattenobject of the payload
    sends flattedobject and api to checkrequiredupdate to update values of schemas.
    first for loop checks existing payload with new payload 
    if new parameter is identified then required false
    second for loop checks new payload with existing payload
    if parameter is missing from new then required false
    returns the updated schema as output
  **/
  _updateSchema(payload, api) {
    var flattedObject = this.flattenObject(payload);
    var output = this.checkRequiredUpdated([flattedObject], api, false);

    for (const varObj in this.fields[api]) {
      if (!output.hasOwnProperty(varObj)) {
        var newObj = this.fields[api];
        var secondObj = newObj[varObj];
        secondObj.required = false;
      }
    }
    for (const varObj in output) {
      if (!this.fields[api].hasOwnProperty(varObj)) {
        output[varObj].required = false;
        var newObj = this.fields[api];
        newObj[varObj] = output[varObj];
      }
    }
    return output;
  }

  /**
    receives api and object array and flag status
    creates the values of schema based on true flag
    updates the values of the existing api schema based on false flag
    returns the updated schema
  **/
  checkRequiredUpdated = (arr, api, flagFetch) => {
    var returnValue = {};
    for (const arrayIndex of arr) {
      let firstObj = arrayIndex;
      for (const prop of Object.keys(firstObj)) {
        if (typeof firstObj[prop] != "object") {
          if (!returnValue[prop]) {
            returnValue[prop] = {};
          }

          if (!returnValue[prop].min) {
            var firstObjTrial = this.fields[api];
            if (flagFetch) {
              returnValue[prop].min = 9999999;
              returnValue[prop].max = 0;
            } else {
              var secondObj = firstObjTrial[prop];
              if (secondObj) {
                returnValue[prop].min = secondObj.min;
                returnValue[prop].max = secondObj.max;
              } else {
                returnValue[prop].min = 9999999;
                returnValue[prop].max = 0;
              }
            }
          }

          for (const s of Object.keys(firstObj)) {
            if (s == prop) {
              if (firstObj[s].toString().length < returnValue[prop].min) {
                if (flagFetch) {
                  returnValue[prop].min = firstObj[s].toString().length;
                } else {
                  returnValue[prop].min = firstObj[s].toString().length;

                  if (secondObj) {
                    secondObj.min = firstObj[s].toString().length;
                  }
                }
              }
              if (firstObj[s].toString().length > returnValue[prop].max) {
                if (flagFetch) {
                  returnValue[prop].max = firstObj[s].toString().length;
                } else {
                  returnValue[prop].max = firstObj[s].toString().length;

                  if (secondObj) {
                    secondObj.max = firstObj[s].toString().length;
                  }
                }
              }
            }
          }

          if (returnValue.hasOwnProperty(prop)) {
            var firstObjTrial = this.fields[api];
            if (flagFetch) {
              returnValue[prop].type = typeof firstObj[prop];
            } else {
              var secondObj = firstObjTrial[prop];
              if (secondObj) {
                secondObj.type = typeof firstObj[prop];
              }
              returnValue[prop].type = typeof firstObj[prop];
            }

            let counter = {};

            let arrOfLen = [];
            for (const aitem of arr) {
              if (aitem[prop] != undefined) {
                arrOfLen.push(aitem[prop].length);
                if (counter[prop]) {
                  counter[prop] += 1;
                } else {
                  counter[prop] = 1;
                }
              }
            }
            if (counter[prop] == arr.length) {
              returnValue[prop].required = true;
            } else {
              returnValue[prop].required = false;
            }
          }
        }
      }
    }
    return returnValue;
  };

  /**
    receives the new api's payload
    creates a new schema using the new payload
    calls the flattenobject of the payload
    sends the flattedobject to checkrequired to generate the new values
    returns the output to the new api
  **/
  _fetchSchema(payload) {
    var flattedObject = this.flattenObject(payload);
    var output = this.checkRequiredUpdated([flattedObject], null, true);
    return output;
  }

  /**
    transforms a deeply nested object 
    to a flattened object with only first layer
    key of the first layer are seprarted by delimiter 
    @param {object} ob js object to 
    @param {string} marker the delimiter
    @return the flattened object
  **/
  flattenObject = (ob, marker) => {
    if (!marker) marker = ".";
    var toReturn = {};
    for (var i in ob) {
      if (!ob.hasOwnProperty(i)) continue;
      if (typeof ob[i] == "object" && ob[i] !== null) {
        if (Array.isArray(ob[i])) {
          toReturn[i] = ob[i];
        } else {
          var flatObject = flattenObject(ob[i], marker);
          for (var x in flatObject) {
            if (!flatObject.hasOwnProperty(x)) continue;
            toReturn[i + marker + x] = flatObject[x];
          }
        }
      } else {
        toReturn[i] = ob[i];
      }
    }
    return toReturn;
  };

  /**
    receives specific api  
    sends the api schema to pineconvertor
    returns the converted schema of specific api
  **/
  getSchema({ api }) {
    return this._pineConverter(this.fields[api]);
  }

  /**
    creates object valueobj
    loops through schemas in this.fields
    converts schemas using pineconvertor and stores as array in object
    returns the object of all the current schemas
  **/
  getSchemes() {
    let valueObj = {};
    for (const valueSchemas in this.fields) {
      valueObj[valueSchemas] = this._pineConverter(this.fields[valueSchemas]);
    }
    return valueObj;
  }

  /**
    receives object with schema
    loops through data in schema                
    converts the values to default pineapple form
    returns the new array object of schema
  **/
  _pineConverter(arrayOfFields) {
    var arraySchema = [];
    for (const dataObj in arrayOfFields) {
      arraySchema.push({
        path: dataObj,
        label: dataObj.toUpperCase(),
        required: arrayOfFields[dataObj].required,
        type: arrayOfFields[dataObj].type,
        length: {
          min: arrayOfFields[dataObj].min,
          max: arrayOfFields[dataObj].max,
        },
      });
    }
    return arraySchema;
  }

  /**
    receives the schema and the userinput
    generates the new pineapple
    uses the validate method to check the schems vs the userinput
    prints any identified error
  **/
  async pineValidate(schema, userInput) {
    let pineapple = new Pineapple();
    let sError = await pineapple.validate(userInput, schema);
    console.log("-----Error-----");
    console.log(sError);
  }

  //get schemas from firestore based on userinput
  async fetchFromFirebase(apiInput) {
    const getFabric = await fabricDb.where("api", "==", apiInput).get();
    var query = getFabric.docs;
    if (query && query.length > 0) {
      if (getFabric) {
        var qData = query[0].data();
        var qApi = qData.api;
        var qSchema = qData.schema;
        this.fields[qApi] = qSchema;
      }
      return getFabric;
    }
  }

  /**
   * check if data is preloaded in database
   * if found then update data
   * else set data
   **/
  async setinFirebase(apiInput, getFabric) {
    var schemasExisting = this.fields[apiInput];
    if (getFabric) {
      var query = getFabric.docs;
      var qData = query[0].data();

      if (qData) {
        await fabricDb.doc(query[0].id).update({
          schema: schemasExisting,
        });
      }
    } else {
      await fabricDb.doc().set({
        api: apiInput,
        schema: schemasExisting,
      });
    }
  }

  async setOverwrite(sentApi, value) {
    const getOverwrite = await rideDb.where("api", "==", sentApi).get();

    var query = getOverwrite.docs;

    if (query && query.length > 0) {
      var qData = query[0].data();
      if (!qData) {
        await rideDb.doc().set({
          api: sentApi,
          schema: value,
        });
      } else {
        await rideDb.doc(query[0].id).update({
          schema: value,
        });
      }
    } else {
      await rideDb.doc().set({
        api: sentApi,
        schema: value,
      });
    }
  }
}

(async () => {
  let payloadLearner = new PayloadLearner();

  await payloadLearner.add({
    api: "login",
    payload: {
      username: "ff",
      password: "2022",
      mobile: 011234,
    },
    flagOverwrite: false,
  });

  await payloadLearner.add({
    api: "login",
    payload: {
      username: "fabricPackage",
      password: "20",
      mobile: 01123455623,
    },
    flagOverwrite: false,
  });

  await payloadLearner.add({
    api: "signup",
    payload: {
      username: "bahi",
      password: 1019292,
      mobile: "1040596039059",
    },
    flagOverwrite: true,
  });

  await payloadLearner.add({
    api: "signup",
    payload: {
      // username: 'abbbbbbbb',
      password: "266",
      mobile: 123456,
      address: "12",
    },
    flagOverwrite: false,
  });

  await payloadLearner.add({
    api: "signin",
    payload: {
      username: "bahi",
      password: "1019292",
      mobile: "123123",
      is: true,
    },
    flagOverwrite: false,
  });
  await payloadLearner.add({
    api: "signin",
    payload: {
      username: "bahitoo",
      password: "1019293435",
      mobile: "2",
      is: false,
    },
    flagOverwrite: false,
  });

  await payloadLearner.setOverwrite("signup", {
    username: { max: 18, min: 2, required: true, type: "string" },
  });
  await payloadLearner.setOverwrite("login", {
    password: { max: 17, min: 5, required: true, type: "number" },
  });
  let schema = payloadLearner.getSchema({ api: "signup" });

  console.log("-----schema-----");
  console.log(schema);
  let userInput = { password: "abc", is: 7 };

  let errorSchema = await payloadLearner.pineValidate(schema, userInput);
})();
