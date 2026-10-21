const assert=require('node:assert/strict'),M=require('./model.js');let count=0,seriesChecks=0;
for(const c of M.scenarios)for(const period of ['today','week','all'])for(const event of ['all','e1','e2','e3'])for(const compare of ['period','event']){
 const d=M.data(event,period,c.state,compare),t=d.totals;
 assert.equal(t.revenue,t.gross-t.refund);assert.equal(t.tickets,t.paid+t.free);assert(t.revenue>=0);assert(t.buyers<=t.paidOrders);assert(d.attendance.confirmed<=d.attendance.total);assert(d.attendance.paid+d.attendance.free===d.attendance.confirmed);
 assert.equal(d.sources.rows.reduce((n,r)=>n+r.orders,0)+d.sources.unknown,d.sources.total);assert(d.sources.rows.every(r=>r.clicks>=r.orders));assert(d.conversion.converted<=d.conversion.opens);assert.equal(d.audience.new+d.audience.returning,t.buyers);
 for(const key of ['percent'])for(const v of [d.trend[key],d.avgTrend[key]])assert(v===undefined||Number.isFinite(v));
 for(const grain of ['day','month'])for(const mode of ['calendar','before']){const valid=mode==='calendar'||d.chosen.length===1&&d.chosen[0].start;if(valid){const rows=M.series(d,period,grain,mode);assert.equal(rows.reduce((n,p)=>n+p.revenue,0),t.revenue,c.id+' revenue');assert.equal(rows.reduce((n,p)=>n+p.tickets,0),t.paid,c.id+' tickets');seriesChecks++}}
 count++;
}
const avg=M.data('all','all').lifetime.avg;for(const e of ['all','e1','e2'])for(const p of ['today','week','all'])assert.equal(M.data(e,p).lifetime.avg,avg);
assert.equal(M.data('e1','week','previous-zero').trend.status,'zero');assert.equal(M.data('all','all').trend.status,'all-time');assert(M.data('e1','week','trend-up').trend.percent>0);assert(M.data('e1','week','trend-down').trend.percent<0);assert.equal(M.data('e1','week','trend-equal').trend.percent,0);
assert.equal(M.data('e1','week','all-new').audience.returning,0);const returning=M.data('e1','week','all-returning').audience;assert.equal(returning.returning,returning.buyers);
assert.equal(M.data('e1','week','free').totals.avg,null);assert.equal(M.data('e1','week','free').totals.revenue,0);assert.equal(M.data('e1','week','unlimited').totals.paidCapacity,null);assert.equal(M.data('e3','week','unknown-capacity').totals.paidCapacity,undefined);
const part=M.data('e1','all','partial-refund'),full=M.data('e1','all','full-refund');assert(part.refunds.amount>0&&full.refunds.amount>part.refunds.amount);assert(full.eventLife.tickets<part.eventLife.tickets);const pending=M.data('e1','all','refund-pending');assert.equal(pending.refunds.count,0);assert.equal(pending.refunds.pending,1);
const entry=M.data('e2','week','pending-entry');assert.equal(entry.attendance.pending,3);assert.equal(entry.attendance.confirmed,M.data('e2','week').attendance.confirmed);
assert.equal(M.data('e1','week','not-on-sale').eventLife.tickets,0);assert.equal(M.data('e1','all','no-date','event').trend.status,'no-date');assert.equal(M.eventStatus(M.fixture().events[0]),'upcoming');assert.equal(M.eventStatus(M.fixture().events[1]),'live');assert.equal(M.eventStatus(M.fixture().events[2]),'ended');
console.log(JSON.stringify({scenarios:M.scenarios.length,filterAndComparisonCases:count,seriesReconciliations:seriesChecks,averagesIndependent:true,uniqueBuyerNotOrders:true,refundsAndAdmissionUnits:true,sourceSharesReconcile:true,comparisonZeroSafe:true,passed:true},null,2));
