/**
 * Reseplaneraren
 * Provides access to Västtrafik journey planner
 *
 * OpenAPI spec version: 1.10.1
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.2.3
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.Reseplaneraren) {
      root.Reseplaneraren = {};
    }
    root.Reseplaneraren.DateBegin = factory(root.Reseplaneraren.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The DateBegin model module.
   * @module model/DateBegin
   * @version 1.10.1
   */

  /**
   * Constructs a new <code>DateBegin</code>.
   * @alias module:model/DateBegin
   * @class
   * @param value {Date} Begin of timetable period in format YYYY-MM-DD
   */
  var exports = function(value) {
    var _this = this;

    _this['$'] = value;
  };

  /**
   * Constructs a <code>DateBegin</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DateBegin} obj Optional instance to populate.
   * @return {module:model/DateBegin} The populated <code>DateBegin</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('$')) {
        obj['$'] = ApiClient.convertToType(data['$'], 'Date');
      }
    }
    return obj;
  }

  /**
   * Begin of timetable period in format YYYY-MM-DD
   * @member {Date} $
   */
  exports.prototype['$'] = undefined;



  return exports;
}));


