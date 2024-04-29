"use strict";

const want = require('../want');
const {lc,UC} = want;

// Browser-specific when tests.
const when = exports = module.exports =
{  
  /**
   * Test the tag name of an element.
   * 
   * Available only in browser window context.
   * 
   * @param {Element} el
   * @param {...string} tags - Valid tag name(s)
   * 
   * The tags may be specified as _case-insensitive_, as they will be
   * automatically normalized to _uppercase_ as per the DOM specifications.
   * 
   * @returns {boolean} 
   * 
   * @alias module:@lumjs/given-when/when.tag
   */
  tag(el,...tags) 
  {
    if (tags.length === 0) return false; // Nothing to check.

    if (tags.length === 1)
    { // A single tag to check, use a shortcut.
      return (el.tagName === UC(tags[0]));
    }

    // Multiple tags to check, normalize them all.
    return (tags.map(UC).includes(el.tagName));
  },

  /**
   * Test the `type` property of an <input> element.
   * 
   * Available only in browser window context.
   * 
   * @param {Element} el
   * 
   * Only `<input>` elements will be considered valid for the purposes
   * of this test. Anything else will automatically be a test failure.
   * 
   * @param {...string} types - Valid `type` values
   * 
   * The types may be specified as _case-insensitive_, as they will be
   * automatically normalized to _lowercase_ as per the DOM specification.
   * 
   * @returns {boolean}
   * 
   * @alias module:@lumjs/given-when/when.input
   */
  input(el,...types) 
  {
    if (types.length === 0) return false;
    if (!when.tag(el, 'INPUT')) return false; // Not an <input>

    if (types.length === 1)
    {
      return (el.type === lc(types[0]));
    }

    return (types.map(lc).includes(el.type));
  },  

} // exports
