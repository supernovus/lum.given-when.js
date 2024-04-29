"use strict";

const given = require('./given');

/**
 * Test values against sets of rules and then perform specific
 * actions or return specific values based on the passing rule(s).
 * 
 * @module module:@lumjs/given-when
 */
exports = module.exports =
{
  /**
   * Given function
   * @alias module:@lumjs/given-when.given
   * @see module:@lumjs/given-when/given
   */
  given,

  /**
   * When tests
   * @alias module:@lumjs/given-when.when
   * @see module:@lumjs/given-when/when
   */
  when: require('./when'),

  /**
   * Wanted value converters and helpers
   * @alias module:@lumjs/given-when.want
   * @see module:@lumjs/given-when/want
   */
  want: require('./want'),
}

/**
 * A {@link module:@lumjs/given-when/given} Rule object.
 * 
 * @typedef {object} module:@lumjs/given-when~WhenRule
 * 
 * @prop {(function|object)} when - The test definition.
 * 
 * If this is a `function`, it will be passed the target value
 * as the sole argument, and must return a boolean value indicating
 * the success or failure of the test.
 * 
 * If this is an `object` then for each enumerable property in it,
 * we will look for a test with the property name being a test in
 * {@link module:@lumjs/given-when/when}, and the value being
 * an `Array` of arguments to be passed to the test (after the target
 * value, which is always the first argument.) All `when` tests
 * return boolean values.
 * 
 * Regardless of the source of the test function, the `this` context
 * variable will be set to an object, consisting of `{rule, opts}`;
 * where `rule` is this rule object itself, and `opts` are the options
 * passed to the `given()` function call.
 * 
 * @prop {mixed} value - The return value to use if the test matches.
 * 
 * Depending on the options passed to a `given()` call, not all `value`
 * properties may be considered valid return values.
 * 
 * So even if the `when` test passes, the `value` will only be returned
 * if it is considered valid, otherwise the process will move on to the
 * next rule.
 * 
 * @prop {function} [run] An optional callback to run if test passes.
 * 
 */
