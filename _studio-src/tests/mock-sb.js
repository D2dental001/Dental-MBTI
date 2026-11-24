// Supabase mock for tests: in-memory table + storage served at /__store/
window.__DB = JSON.parse(localStorage.getItem('__mockdb')||'[]');
window.__ST = {};
const persist=()=>localStorage.setItem('__mockdb',JSON.stringify(__DB));
function q(rows){ const o={ _r:rows,
  select(){return o}, order(k,opt){ o._r=[...o._r].sort((a,b)=>a[k]>b[k]?1:a[k]<b[k]?-1:0); return o },
  eq(k,v){ o._r=o._r.filter(r=>r[k]===v); return o }, single(){ return Promise.resolve({data:o._r[0],error:null}) },
  then(res){ return Promise.resolve({data:o._r,error:null}).then(res) } }; return o; }
const sb={
  auth:{ getUser:async()=>({data:{user:{id:window.__USER||'admin1'}}}), signOut:async()=>{}, getSession:async()=>({data:{session:{user:{id:window.__USER||'admin1',email:(window.__USER||'admin1')+'@test.com'}}}}), refreshSession:async()=>({}), onAuthStateChange(){ return {data:{subscription:{unsubscribe(){}}}} } },
  from(t){
    if(t==='accounts') return q([{id:'admin1',role:'admin',is_active:true,email:'admin@test.com'}]);
    return { select(){return q(__DB)},
      async upsert(row){ if(window.__FAIL) return {error:{message:'mock fail'}}; const i=__DB.findIndex(r=>r.id===row.id); i<0?__DB.push(row):__DB[i]=row; persist(); return {error:null} },
      update(obj){ return { eq(k,v){ const run=()=>{ if((window.__USER||'admin1')!=='admin1') return {data:[],error:null}; if(window.__FAIL) return {error:{message:'mock fail'}}; const r=__DB.find(x=>x[k]===v); if(r) Object.assign(r,obj); persist(); return {data:r?[{id:r.id}]:[],error:null} };
          const pr={ select(){ return Promise.resolve(run()) }, then(a,b){ return Promise.resolve(run()).then(a,b) } }; return pr; } } },
      async insert(row){ if((window.__USER||'admin1')!=='admin1') return {error:{message:'new row violates row-level security policy for table "hp_portfolios"',code:'42501'}}; if(window.__FAIL) return {error:{message:'mock fail'}}; __DB.push(row); persist(); return {error:null} },
      delete(){ return { async eq(k,v){ __DB=__DB.filter(r=>r[k]!==v); window.__DB=__DB; persist(); return {error:null} } } } };
  },
  async rpc(fn,args){ if(fn==='hp_is_admin') return {data:(window.__USER||'admin1')==='admin1',error:null}; if(fn!=='hp_get_shared') return {error:{message:'no fn'}}; const db=JSON.parse(localStorage.getItem('__mockdb')||'[]'); const r=db.find(x=>x.share_on&&x.share_token&&x.share_token===args.p_token&&args.p_token.length>=16); return {data:r?[{title:r.title,theme:r.theme,content:r.content}]:[],error:null} },
  storage:{ from(){ return {
    async upload(path,blob){ const b=await blob.arrayBuffer(); await fetch('/__store/'+path,{method:'PUT',body:b,headers:{'content-type':blob.type}}); window.__ST[path]=1; return {error:null} },
    getPublicUrl(path){ return {data:{publicUrl:location.origin+'/__store/'+path}} },
    async list(prefix){ return {data:Object.keys(__ST).filter(p=>p.startsWith(prefix+'/')).map(p=>({name:p.split('/').pop()}))} },
    async remove(paths){ paths.forEach(p=>delete __ST[p]); return {error:null} } } } }
};
async function sbGetMyProfile(){ return {id:'admin1',role:'admin',is_active:true,email:'admin@test.com'} }
