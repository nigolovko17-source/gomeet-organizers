const assert=require('node:assert/strict'),M=require('./model.js');let cases=0;
for(const c of M.scenarios)for(const period of ['today','week','month','all'])for(const event of ['all','e1'])for(const grain of ['day','month']){
 const d=M.data(event,period,c.state),rows=M.metricSeries(d,period,grain);
 assert.equal(rows.reduce((n,r)=>n+r.revenue,0),d.totals.revenue);
 assert.equal(rows.reduce((n,r)=>n+r.tickets,0),d.totals.paid);
 if(d.refunds.status==='ready')assert.equal(rows.reduce((n,r)=>n+r.refunds,0),d.refunds.count);else assert(rows.every(r=>r.refunds===null));
 assert(rows.every(r=>r.buyers>=0&&r.buyers<=d.totals.buyers));cases++;
}
assert.equal(M.range('month')[0],M.range('week')[0]-23*M.DAY);
const d=M.data('all','week');d.current=[];const rows=M.metricSeries(d,'week');assert.equal(rows.reduce((n,r)=>n+r.refunds,0),d.refunds.count);assert(rows.every(r=>r.revenue===0));
console.log(JSON.stringify({cases,refundOnlyDays:true,monthRange:true,passed:true},null,2));
