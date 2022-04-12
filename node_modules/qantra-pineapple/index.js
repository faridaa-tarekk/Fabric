const { load } = require('debug/src/browser');
const { times } = require('lodash');
const lodash = require('lodash');
const debug  = require('debug')('qantra:pineapple');

const defaultErrorSchema = {
    marker: '$label',
    onError: {
      required: '$label is required',
      length: '$label has invalid length',
      regex: '$label has invalid format',
      type: '$label invalid type',
      oneOf: '$label invalid option',
      inclusive: '$label dependent on ',
      exclusive: '$label conflict with other',
      canParse: '$label invalid parsing',
      items: 'one of the $label items is invalid',
      custom: 'rejected by custom validator',
    }
}

module.exports = class Pineapple {

  constructor({
    models=[], 
    errorSchema = defaultErrorSchema,
    customValidators = {},
  }={}){
    this.models              = models || {};
    this.errorSchema         = errorSchema;
    this.nonMethodVectors    = ['label','path','onError','propValue','model','required'];
    this.customValidators    = customValidators;
    this.validate            = this.validate.bind(this);
    this.trim                = this.trim.bind(this);
  }

  //validation helpers
  isString(v) {
    return lodash.isString(v);
  }
  isNumber(v) {
    return lodash.isNumber(v);
  }
  isArray(v) {
    return lodash.isArray(v)
  }
  isObject(v){
    return lodash.isPlainObject(v);
  }
  isBoolean(v){
    return lodash.isBoolean(v);
  }
  isNull(v){
    return lodash.isNull(v);
  }
  isUndefined(v){
    return lodash.isUndefined(v);
  }
  isRegExp(v){
    return lodash.isRegExp(v);
  }
  isDate(v){
    return lodash.isDate(v);
  }
  isNaN(v){
    return lodash.isNaN(v);
  }

  //validation methods
  _type(vo){
    let typeName    = vo.type.toLowerCase();
    typeName        = typeName.charAt(0).toUpperCase() + typeName.toLowerCase().substring(1);
    let methodName  = `is${typeName}`;
    let method      = this[methodName];
    if(method){
      return method(vo.propValue);
    } else { throw Error(`Unable to find method relevant with: ${typeName}`)}
  }
  _oneOf(vo){
    return vo.oneOf.includes(vo.propValue)
  }
  _length(vo){

    let vectorValue = vo.length;
    let propValue   = vo.propValue;
    //if data not array convert data to string
    if(!this.isArray(propValue)) {
      propValue = propValue.toString();
    }
    //if the length vector type = number
    if(this.isNumber(vectorValue)) return (vectorValue == propValue.length);

    let valid = true;

    if(vectorValue.min && valid){
      valid = (propValue.length >= vectorValue.min);
    }
    if(vectorValue.max && valid){
      valid = (propValue.length <= vectorValue.max);
    }
    return valid;

  }
  _regex(vo){
    return (new RegExp(vo.regex).test(vo.propValue))
  }
  async _custom(vo){
    if(this.customValidators[vo.custom]){
      try {
        return (await this.customValidators[vo.custom](vo.propValue));
      } catch(err){
        console.error(`Error: custom validator ( ${vo.custom} )  has triggered error: ${err.toString()}`);
        return false;
      }
    } else {
      throw Error(`custom validator ${vo.custom} not found`);
      return false;
    }
  }

  /**
    items can be called only in a property of type Array
    items validation vector can be an array if the 'to be validated prop' is array of objects
    items validation vector cab be an object if the 'to be validated prop' is array of strings or numbers
  */
  async _items(vo){
    vo = JSON.parse(JSON.stringify(vo));

    let result = true;
    let errorObject = null;

    if(vo.type == 'array'|| vo.type == 'Array' ){

      if(this.isArray(vo.items)){
        //call validate again
        for(let i=0; i<vo.propValue.length; i++){
          if(!this.isObject(vo.propValue[i])){
            errorObject = [this.createErrorObj('type', vo)];
          } else {
            errorObject = await this.validate(vo.propValue[i], vo.items);
          }
          /** because validating array of object recursively calls validate
           * we need to reference back to the parent the index of errored item. so if the errorObject contains index
           * it means that the index needs to be added to the parent log and
           * the errorObject will be embedded in the errros property
           */
          if(errorObject && errorObject.length>0){
            result = {
              index: i.toString(),
              errors: errorObject
            }
            break;
          }
        }

      } else {
        /** if object the elements under  */
        if(vo.items.items || vo.items.path) {
          throw Error('use array of items if it is an array of objects. path and items are not applicable in simple array elements');
        }

        let validationVectors = this.getValidationVectors(vo.items)

        for(let i=0; i<vo.propValue.length; i++){

          for(let x=0; x<validationVectors.length; x++){

            let valicationVectorName = validationVectors[x];

            let newVO = {
              propValue: vo.propValue[i],
              label: vo.label,
              vector: 'items',
              index: i.toString(),
              path: `${vo.path}`
            };

            newVO[valicationVectorName]=vo.items[valicationVectorName];

            errorObject = await this.exec(valicationVectorName, newVO);

            if(errorObject){
              result = errorObject;
              break;
            }
          }
          if(errorObject)break;
        }

      }
    } else {
      /** items are only available for arrays */
      throw Error(`Unable to validate items under path ${vo.path} because it is not an Array`);
    }

    return (result);
  }
  _canParse(vo){
    let v      = vo.propValue;
    let result = false;
    switch(vo.canParse){
        case 'date':
            result = (new Date(v) != "Invalid Date") && !this.isNaN(new Date(v));
            break;
        case 'int':
            result = (this.isNaN(parseInt(v)))?false:true;
            break;
        case 'float':
            result = ((this.isNaN(parseFloat(v)))?false:true);
    }
    return result;

  }



  /**
  extracts validation model from predefined
  validation scheme
  */
  getExactValidationModel(modelName){
    return this.models[modelName];
  }

  /** merge incoming model with baseModel */
  mergeModels(baseModel, inModel){
    let merged = lodash.merge(baseModel, inModel);
    return merged;
  }

  /** creates the returned error object */
  createErrorObj(validationVectorName, vo, result={}){
    let vv        = vo.vector || validationVectorName;
    let label     = vo.label || vo.path || '';
    let path      = vo.path;
    let log       = `_${validationVectorName}`+ ((vo.index)?` @index(${vo.index})`:'') + ((result.index)?` @index(${result.index})`:'');
    let message   = ( (vo.onError && vo.onError[vv] )   || this.errorSchema.onError[vv] || '').replace(this.errorSchema.marker, label);
    return {label, path, message, log, errors:result.errors||[]}
  }

  /** if the excution is succesful it will return null */
  async exec(validationVectorName, vo){

    let errorObject                 = null;
    let validationMethodName        = `_${validationVectorName}`;

    let method                      = this[validationMethodName];

      if(method){

        /** result can be true or false or object */
        let result = await method.bind(this)(vo);
        if(!result){
          errorObject = this.createErrorObj(validationVectorName, vo);
        } else if(this.isObject(result) && !result.index){
          /** this is an error object that returns from a property that is not an array of objects */
          errorObject = result;
        } else if(this.isObject(result) && result.index){
          /** this an error object that returns from validating array of objects - includes an index property referencing to the parent the index of the errored ite, */
          errorObject = this.createErrorObj(validationVectorName, vo, result);
        }

    } else {
      throw Error(`Unable to find validation method: ${validationMethodName}`)
    }

    return errorObject;
  }

  /**
  exports valid valdation vector names from the validation model
  **/
  getValidationVectors(vo){
    return Object.keys(vo).filter(i=>this[`_${i}`]);
  }

  /**
  passes every propvalue and validation vector to exec
  */
  async evaluate(obj, ivm, isItems){

    let inValidationModel    = ivm;
    let vo                   = inValidationModel;
    if(inValidationModel.model){
      let baseValidationModel  = this.getExactValidationModel(inValidationModel.model);
      if(!baseValidationModel){
        throw Error(`unable to find model ${inValidationModel.model}`);
        return;
      }
      /** if evaulating items  */
      if(isItems)baseValidationModel = baseValidationModel.items;

      //mergine the global and the specific
      vo   = this.mergeModels(baseValidationModel, inValidationModel);
      
    }

    //fallback to key if pathnot found;
    if(!vo.path)vo.path=vo.key;
    //items already have propValue
    /** get the deep value path */
    vo.propValue = lodash.get(obj, vo.path);

    if(vo.required && (this.isNull(vo.propValue)||this.isUndefined(vo.propValue))){
      return this.createErrorObj('required', vo);
    }
    //if not required and it is passed by null then we will not containue valudtion 
    if(this.isNull(vo.propValue)||this.isUndefined(vo.propValue))return null;

    //remove non method vectors
    let validationVectors = this.getValidationVectors(vo);


    let errorObject       = null;

    for(let i=0; i<validationVectors.length; i++){

      let validationVectorName = validationVectors[i];
      errorObject = await this.exec(validationVectorName, vo);

      if(errorObject)break;

    }

    return errorObject;

  }

  /**
    Passes every property and its validation to the evaluate
  */
  async validate(obj, validationModels){
    let errors = [];
     for(let i=0; i<validationModels.length; i++){
       let error = await this.evaluate(obj, validationModels[i]);
       if(error)errors.push(error);
     }
     if(errors.length>0) {
       return errors;
     } else { 
       return false;
     }
  }

  async trim(obj, validationModels){
    let trimmed = {};
    for(let i=0; i<validationModels.length; i++){
      let vo = validationModels[i];
      if(validationModels[i].model && this.models[validationModels[i].model]){
        vo = {...this.models[validationModels[i].model], ...validationModels[i]};
      }
      if(vo.items){
        if(this.isArray(vo.items)){

          let schema = vo.items;
          let value = lodash.get(obj, vo.path);

          for(let x=0; x<value.length; x++){
            /** item is an Object with multiple props  */
            lodash.set(trimmed, `${vo.path}[${x}]`, await this.trim(value[x], schema));
          }
          
        } else {
          /** items is an Array of specific non object */
          let value = lodash.get(obj, vo.path);
          if(value) lodash.set(trimmed, vo.path, value);
        }
      } else {
        let value = lodash.get(obj, vo.path);
        if(value) lodash.set(trimmed, vo.path, value)
      }
    }
    return trimmed;
  }
}









