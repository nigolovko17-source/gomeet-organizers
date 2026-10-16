const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname,'../..');
const parser = createRequire(path.resolve(root,'../../app/package.json'))('@babel/parser');
const build = require('./BUILD.json');
const code = fs.readFileSync(path.join(root,build.bundle),'utf8');
const call = parser.parse(code).program.body.find(n=>n.expression?.callee?.name==='__d' && n.expression.arguments[1].value===1477).expression;
const fmt = {
  CATEGORY_LABEL: {},
  mskParts(s) { const d = new Date(new Date(s).getTime()+3*3600000);return {y:d.getUTCFullYear(),mon:d.getUTCMonth()+1,date:d.getUTCDate(),dow:d.getUTCDay()}; },
  nowMsk() { return this.mskParts(new Date().toISOString()); },
};
// These production functions call nowMsk without a receiver.
fmt.nowMsk = () => fmt.mskParts(new Date().toISOString());
const out = {};
vm.runInNewContext('('+code.slice(call.arguments[0].start,call.arguments[0].end)+')')({},()=>fmt,null,null,{},out,[1322]);
const filters = value => ({...out.DEFAULT_FILTERS,maxPrice:value});
const event = priceMin => ({priceMin});
test('inclusive ruble maximum converts to kopecks and caps at 20000',()=>{
  assert.equal(out.matchesFilters(event(2000000),filters(20000)),true);
  assert.equal(out.matchesFilters(event(2000001),filters(20000)),false);
  assert.equal(out.matchesFilters(event(2500000),filters(25000)),false);
  assert.equal(out.matchesFilters(event(137500),filters(1375)),true);
  assert.equal(out.matchesFilters(event(137501),filters(1375)),false);
});
test('zero maximum keeps only free known-price events',()=>{
  assert.equal(out.matchesFilters(event(0),filters(0)),true);
  assert.equal(out.matchesFilters(event(1),filters(0)),false);
  assert.equal(out.matchesFilters(event(null),filters(0)),true); // preserves existing unknown-price semantics
});
test('default/filter-active and invalid values are bounded',()=>{
  assert.equal(out.normalizePrice(-1),0);
  assert.equal(out.normalizePrice(20001),20000);
  assert.equal(out.normalizePrice(undefined),20000);
  assert.equal(out.normalizePrice(NaN),20000);
  assert.equal(out.isActive(out.DEFAULT_FILTERS),false);
  assert.equal(out.isActive(filters(19999)),true);
  assert.equal(out.isActive({...out.DEFAULT_FILTERS,date:'today'}),true);
});
test('removed category does not remain a hidden constraint',()=>{
  assert.equal(out.matchesFilters({priceMin:10000,categoryId:'music'},{...filters(20000),categories:['food'],price:'free'}),true);
});
test('date choices retain Moscow calendar and weekend behavior',()=>{
  const today = {...filters(20000),date:'today'};
  assert.equal(out.matchesFilters({priceMin:0,startsAt:new Date().toISOString()},today),true);
  assert.equal(out.matchesFilters({priceMin:0,startsAt:new Date(Date.now()-2*86400000).toISOString()},today),false);
  assert.equal(out.matchesFilters({priceMin:0,startsAt:'2026-10-17T12:00:00Z'},{...filters(20000),date:'weekend'}),true);
  assert.equal(out.matchesFilters({priceMin:0,startsAt:'2026-10-19T12:00:00Z'},{...filters(20000),date:'weekend'}),false);
});
