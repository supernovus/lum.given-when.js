"use strict";

const core = require('@lumjs/core');
const {isa} = core.types;

/**
 * Some pre-defined tests and helpers for the Given-When system.
 * 
 * @module module:@lumjs/given-when/when
 */
const when = exports = module.exports =
{
  isa, // Using `isa()` as a built-in test.

  notBlank(v)
  {
    return (v.toString().trim() !== '');
  },

} // exports

if (core.context.isBrowser)
{ // Some browser specific tests.
  Object.assign(when, require('./browser'));
}
