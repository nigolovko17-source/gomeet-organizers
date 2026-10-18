module.exports=async function listBlockedStrict(){
  if(!t.supabase)throw new Error('Blocked service unavailable');
  const blocks=await t.supabase.from('blocks').select('blocked_id');
  if(blocks.error||!Array.isArray(blocks.data))throw new Error('Blocked read failed');
  const ids=blocks.data.map(row=>row.blocked_id);
  if(ids.some(id=>typeof id!=='string'||!id))throw new Error('Blocked response invalid');
  if(ids.length===0)return [];
  const profiles=await t.supabase.from('profiles').select('id, name, username, avatar_url').in('id',ids);
  if(profiles.error||!Array.isArray(profiles.data))throw new Error('Blocked profiles read failed');
  if(ids.some(id=>!profiles.data.some(row=>row.id===id)))throw new Error('Blocked profiles incomplete');
  return profiles.data.map(row=>({id:row.id,name:row.name?.trim()||'Без имени',username:row.username,avatarUrl:row.avatar_url}));
};
