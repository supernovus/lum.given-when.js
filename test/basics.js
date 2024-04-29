"use strict";

const plan = 14;

const t = require('@lumjs/tests').new({module,plan});

const core = require('@lumjs/core');
const {def,F,S,O,isObj,isArray} = core.types;

const {given,when,want} = require('../lib');

function id(o, i)
{
  def(o, '$id', i);
  return o;
}

const WHEN_1 =
id([
  {
    when:
    {
      isa: [F,S]
    },
    value: 'fnORstr',
  },
  {
    when(v) 
    {
      return isObj(v);
    },
    value: ['isObj','truth!'],
  },
], 'N<value>');

const WHEN_2 =
id([
  {
    when:
    {
      isa: [S,O]
    },
    run(v)
    {
      GV[4] = JSON.stringify(v)+'||'+this.value;
    },
    value: 'Yes Please!',
  },
  {
    when:
    {
      isa: [F],
    },
    run(v)
    {
      GV[4] = v.toString();
    },
  },
], 'N<run>');

const valid = v => (typeof v === S || isArray(v));

// returns a lowercase string value
const WANT_1 =
id(
{
  fallback: '',
  valid,
  return(v)
  {
    return want.lc(want.first(v));
  },
}, 'T<lc,first>');

// returns an array of uppercase values
const WANT_2 =
id(
{
  fallback: [],
  valid,
  return(v)
  {
    return want.array(v, when.notBlank, want.UC);
  },
}, 'T<uc,array>');

const TV =
[
  'a string',
  () => true,
  {hello: 'World'},
];

const GV = 
[
  WHEN_1, // 0 - when rules
  WANT_1, // 1 - want options
  'is',   // 2 - test op for return value
  'is',   // 3 - test op for callback value
  null,   // 4 - callback assignment value

  'fnorstr',            // 5
  'isobj',              // 6
  ['FNORSTR'],          // 7
  ['ISOBJ','TRUTH!'],   // 8
  ['YES PLEASE!'],      // 9

  '"a string"||Yes Please!',        // 10
  '{"hello":"World"}||Yes Please!', // 11
  '() => true',                     // 12
];

function test(tv, wv, cv)
{
  const id = `${GV[0].$id}:${GV[1].$id}:${typeof tv}`;
  const rt = given(tv, GV[0], GV[1]);

  t[GV[2]](rt, wv, id+'.value');

  if (cv !== undefined)
  {
    t[GV[3]](GV[4], cv, id+'.run');
  }
}

test(TV[0], GV[5]);
test(TV[1], GV[5]);
test(TV[2], GV[6]);
test(null, '');

GV[1] = WANT_2;
GV[2] = 'isJSON';

test(TV[0], GV[7]);
test(TV[1], GV[7]);
test(TV[2], GV[8]);
test(null, []);

GV[0] = WHEN_2;

test(TV[0], GV[9], GV[10]);
test(TV[2], GV[9], GV[11]);
test(TV[1], [],    GV[12]);


t.done();
