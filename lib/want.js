"use strict";

const core = require('@lumjs/core');
const 
{
  F, N,
  isArray, isIterable, isProperty,
  isNil, notNil
} = core.types;

/**
 * Some pre-defined converters and output filters for the Given-When system.
 * 
 * @exports module:@lumjs/given-when/want
 */
const want = exports = module.exports =
{
  /**
   * Convert any value to a lowercase string
   * @param {*} v - Value
   * @returns {string}
   */
  lc(v) 
  { 
    if (isNil(v)) return '';
    return v.toString().toLowerCase(); 
  },

  /**
   * Convert any value to an UPPERCASE string
   * @param {*} v - Value
   * @returns {string}
   */
  UC(v) 
  { 
    if (isNil(v)) return '';
    return v.toString().toUpperCase(); 
  },

  /**
   * Attempt conversion using a function or method.
   * 
   * @param {*} v - Value
   * 
   * @param {(function|string|symbol)} c - Converter
   * 
   * If this is a `function` we return `c(v);` and are done.
   * 
   * If this is a `string` or `symbol`, and `v` is NOT `null` or `undefined`,
   * then we look for a `function` property (aka a method) named `c` in `v`.
   * If the `c` method exists, we return `v[c]();` and are done.
   * 
   * @param {*} [d] Optional default value.
   * 
   * This will only be used if `c` was not a `function`,
   * and there was no `c` method to be called on `v`.
   * 
   * @returns {*} The value from `c` if it was valid, or `d` otherwise.
   */
  convert(v, c, d)
  {
    if (typeof c === F)
    { // Converter was a function.
      return c(v);
    }
    else if (notNil(v) && isProperty(c) && typeof v[c] === F)
    { // Converter was a method on the value.
      return v[c]();
    }

    return d;
  },

  /**
   * Return a single item
   * 
   * @param {*} v - Input value
   * 
   * If this is an `Array`, we return `v[i];` nothing else required.
   * 
   * If this is another `Iterable` object, we convert it to an array
   * using `Array.from()` and then treat it the same as with `Array`.
   * 
   * If this is any other kind of value, we will assume that it is
   * already a singular value, and return it as-is.
   * 
   * @param {number} i - 0-based index of item to return if `v` is a list.
   * 
   * Positive numbers represent the offset from the _start_ of the list.
   * Negative numbers represent the offset from the _end_ of the list.
   * 
   * So `0` is the first item, and `-1` is the last item.
   * 
   * @param {boolean} [ni=false] If `true` skip conversion of `Iterable`
   * 
   * @returns {*} Output value
   */
  single(v, i, ni=false)
  {
    if (typeof i !== N)
    {
      console.error("invalid index offset", {i});
      i = 0;
    }

    const pos    = (a) => ((i < 0) ? a.length+i : i);
    const offset = (a) => a[pos(a)];

    if (isArray(v))
    { 
      return offset(v); 
    }
    else if (!ni && isIterable(v))
    {
      return offset(Array.from(v));
    }

    // Anything else is returned as-is.
    return v;
  },

  /**
   * Return the _first_ singular item
   * 
   * Uses {@link module:@lumjs/given-when/want.single single()} with
   * a fixed `i` value of `0` to always return the first item.
   * 
   * @param {*} v - Input value
   * @param {boolean} [ni=false] See `single()`
   * @returns {*} Output value
   */
  first(v, ni) 
  { 
    return want.single(v, 0, ni);
  },

  /**
   * Return the _last_ singular item
   * 
   * Uses {@link module:@lumjs/given-when/want.single single()} with
   * a fixed `i` value of `-1` to always return the last item.
   * 
   * @param {*} v - Input value
   * @param {boolean} [ni=false] See `single()`
   * @returns {*} Output value
   */
  last(v, ni) 
  { 
    return want.single(v, -1, ni);
  },

  /**
   * Return an array
   * 
   * @param {*} v - Input value
   * 
   * If the value is already an `Array`, no conversion needs to be done.
   * 
   * If the value is another `Iterable` object, it will be converted using
   * the `Array.from()` static method.
   * 
   * Any other kind of value will be converted by wrapping it: `[v]`
   * 
   * @param {function} [filter] A filter function.
   * 
   * If specified then we call `v = v.filter(filter);`
   * 
   * @param {function} [map] A map function.
   * 
   * If specified then we call `v = v.map(map);`
   * 
   * @returns {Array} Value after any conversion, filtering, and mapping.
   * 
   */
  array(v, filter, map)
  {
    if (!isArray(v))
    {
      if (isIterable(v))
      {
        v = Array.from(v);
      }
      else
      {
        v = [v];
      }
    }

    if (typeof filter === F)
    {
      v = v.filter(filter);
    }

    if (typeof map === F)
    {
      v = v.map(map);
    }

    return v;
  },
  
}
