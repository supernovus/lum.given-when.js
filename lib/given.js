"use strict";

const core = require('@lumjs/core');
const {F,isObj,isArray} = core.types;

const when = require('./when');
const { notNil } = require('../../core/lib/types');

/**
 * Test a value using well-defined rules.
 * 
 * @param {*} v - Value to test
 * 
 * @param {module:@lumjs/given-when~WhenRule[]} [rules] Rules to test value
 * 
 * The first rule which has a passing test and a valid return value, 
 * will return its assigned value, and no further tests will be ran.
 * So if you are using custom rules, make sure they are in an order
 * that won't prevent some rules from never being used.
 * 
 * @param {object} [opts] Options
 * 
 * @param {mixed} [opts.fallback] Fallback value to use if no rules match.
 * 
 * @param {function} [opts.return] A return value processor/filter function.
 * 
 * If specified, this function will be passed the return value from the
 * matching rule (or the fallback value if no rule matched), and the `opts`. 
 * Whatever this function returns will be used as the _actual_ return value
 * from the `given()` call itself.
 * 
 * @param {function} [opts.valid] A value valdiation function.
 * 
 * If specified, this will determine if a value being returned by a rule
 * is valid or not. Only values passing the test will be returned.
 * 
 * If not specified, any value other than `null` or `undefined` is valid.
 * 
 * @returns {*} Value from matching test after any processing.
 * 
 * @exports module:@lumjs/given-when/given
 */
function given(v, rules, opts={})
{
  //console.debug("given()", {v,rules,opts});
  if (!isArray(rules))
  {
    console.error({v, rules, opts});
    throw new TypeError("Invalid rules");  
  }

  const retVal   = (typeof opts.return === F) ? opts.return : v => v;
  const validVal = (typeof opts.valid === F)  ? opts.valid  : notNil;

  for (const rule of rules)
  {
    const ctx = {rule, opts};
    let invalid = null;

    if (isObj(rule))
    {
      const hasVal = validVal(rule.value);
      const hasRun = (typeof rule.run === F);

      if (typeof rule.when === F)
      { // A test function was explicitly defined.
        if (rule.when.call(ctx, v))
        { // Test passed.
          if (hasRun) rule.run(v, opts);
          if (hasVal) return retVal(rule.value);
        }
      }
      else if (isObj(rule.when))
      { // Pre-defined tests in the `when` helper.
        let foundTest = false;

        for (const subkey in rule.when)
        {
          const subval = rule.when[subkey];
          if (typeof when[subkey] === F && isArray(subval))
          {
            foundTest = true;
            if (when[subkey].call(rule, v, ...subval))
            { // Test passed.
              if (hasRun) rule.run(v, opts);
              if (hasVal) return retVal(rule.value);
            }
          }
        }

        if (!foundTest)
        { // No valid tests found in the when object.
          invalid = "no named test in 'rule.when' object";
        }
      }
      else
      { // No valid 'when' property.
        invalid = "invalid 'rule.when' type";
      }
    }
    else
    { // We don't support anything else at this time.
      invalid = "invalid 'rule' type";
    }

    if (invalid)
    {
      console.error(invalid, {rule, rules, value: v, opts});
    }

  } // for rule of rules

  // If we reached here, no rules with a valid return value matched.
  return retVal(opts.fallback);

} // given()

module.exports = given;
