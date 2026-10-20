(function(g){
const events=[
{id:'e1',title:'Новый круг знакомств',date:'22 октября',revenue:83200,tickets:78,capacity:140,paid:65,arrivedPaid:0,arrivedFree:0,orders:70},
{id:'e2',title:'Музыка после заката',date:'18 октября',revenue:215000,tickets:162,capacity:200,paid:120,arrivedPaid:82,arrivedFree:31,orders:140},
{id:'e3',title:'Встреча без повода',date:'11 октября',revenue:176400,tickets:143,capacity:180,paid:100,arrivedPaid:76,arrivedFree:29,orders:123},
{id:'e4',title:'Вечер в кругу своих',date:'4 октября',revenue:164800,tickets:126,capacity:160,paid:90,arrivedPaid:68,arrivedFree:26,orders:110},
{id:'e5',title:'Знакомые лица',date:'27 сентября',revenue:153000,tickets:121,capacity:150,paid:85,arrivedPaid:65,arrivedFree:25,orders:105},
{id:'e6',title:'Открытый микрофон',date:'20 сентября',revenue:142000,tickets:116,capacity:160,paid:80,arrivedPaid:65,arrivedFree:24,orders:101},
{id:'e7',title:'Летний вечер',date:'30 августа',revenue:124000,tickets:114,capacity:140,paid:80,arrivedPaid:66,arrivedFree:24,orders:100}];
function split(total,weights){let last=0,sum=weights.reduce((a,b)=>a+b,0),acc=0;return weights.map(w=>{acc+=w;const next=Math.round(total*acc/sum),n=next-last;last=next;return n})}
function data(id,period,state){const chosen=events.filter(e=>id==='all'||e.id===id);const factor=period==='today'?.08:period==='week'?.36:1;const zero=state==='no-sales'||state==='empty';const rows=chosen.map(e=>({...e,revenue:zero?0:Math.round(e.revenue*factor),tickets:zero?0:Math.round(e.tickets*factor),paid:zero?0:Math.round(e.paid*factor),orders:zero?0:Math.round(e.orders*factor),arrivedPaid:zero?0:Math.round(e.arrivedPaid*factor),arrivedFree:zero?0:Math.round(e.arrivedFree*factor)}));const totals=rows.reduce((a,e)=>{for(const k of ['revenue','tickets','capacity','paid','orders','arrivedPaid','arrivedFree'])a[k]+=e[k];return a},{revenue:0,tickets:0,capacity:0,paid:0,orders:0,arrivedPaid:0,arrivedFree:0});totals.free=totals.tickets-totals.paid;totals.arrived=totals.arrivedPaid+totals.arrivedFree;totals.fee=Math.round(totals.revenue*.08);totals.paidTotal=totals.revenue+totals.fee;return {rows,totals}}
function series(totals,period,grain){const labels=grain==='month'?['Авг','Сен','Окт']:period==='today'?['08:00','10:00','12:00','14:00','16:00','18:00','20:00']:['14 окт.','15 окт.','16 окт.','17 окт.','18 окт.','19 окт.','20 окт.'];const weights=grain==='month'?[12,28,60]:[8,12,10,16,14,22,18];const r=split(totals.revenue,weights),t=split(totals.tickets,weights);return labels.map((label,i)=>({label,revenue:r[i],tickets:t[i]}))}
const api={events,split,data,series};if(typeof module!=='undefined')module.exports=api;else g.SummaryModel=api;
})(typeof window==='undefined'?{}:window);
