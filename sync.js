/* ---------- 👨‍👩‍👧 Famille : synchronisation des profils entre plusieurs téléphones (Firebase Firestore, API REST) ----------
   Chaque téléphone publie SA PART dans families/{code}/devices/{uid} (un seul document JSON) et lit celles des autres.
   Fusion :
   - compteurs additifs (étoiles, temps et réponses du jour, achats, statistiques) : valeur locale = part de ce téléphone + somme des parts des autres ;
     la part de ce téléphone = valeur locale − parts des autres déjà appliquées (SY.peers) : aucune écriture de l'appli n'est à modifier ;
   - réglages d'un profil et réglages communs (boutique, code parent, mots d'allemand) : le plus récent gagne (horodatage posé quand le contenu change) ;
   - niveaux et records (*_lvl@, *_best@, meilleure série du jour) : maximum ;
   - achats à remettre : union, moins ceux marqués « Donné » sur un téléphone ; journal des achats : union ;
   - profil supprimé sur un téléphone : supprimé partout. */
(function(){
var FIREBASE={apiKey:"AIzaSyBIT5gqiABZW-uWwVX0GzvhXZN6Z-OSsuU",projectId:"mes-jeux-ecole"}; // à remplir avec la configuration du projet Firebase de la famille
function cfg(){var o=null;try{o=JSON.parse(localStorage.getItem("sync_cfg"))}catch(e){}return o&&o.apiKey?o:FIREBASE}
function urls(){var c=cfg(),t=localStorage.getItem("sync_test_base");
 if(t)return{auth:t+"/auth?key="+c.apiKey,tok:t+"/token?key="+c.apiKey,fs:t+"/fs/"};
 return{auth:"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="+c.apiKey,tok:"https://securetoken.googleapis.com/v1/token?key="+c.apiKey,
  fs:"https://firestore.googleapis.com/v1/projects/"+c.projectId+"/databases/(default)/documents/"}}
function L(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function S(k,v){localStorage.setItem(k,JSON.stringify(v))}
var SY={fam:localStorage.getItem("sync_fam")||"",peers:L("sync_peers",{}),mt:L("sync_mt",{}),h:L("sync_h",{}),last:+localStorage.getItem("sync_last")||0,err:"",busy:false,pushed:""};
window.SYNC=SY;
SY.ready=function(){var c=cfg();return !!(c.apiKey&&c.projectId)};

/* --- opérations sur les arbres de compteurs --- */
function isO(x){return x&&typeof x==="object"&&!Array.isArray(x)}
function add(a,b,sg){ // a + sg*b (nombres additionnés, textes : max, tableaux élément par élément, objets clé par clé)
 if(b==null)return a;if(a==null){if(sg>0)return clone(b);a=Array.isArray(b)?[]:isO(b)?{}:typeof b==="number"?0:"";}
 if(typeof b==="number")return (typeof a==="number"?a:0)+sg*b;
 if(typeof b==="string")return sg>0?(a>b?a:b):a;
 if(Array.isArray(b)){var r=Array.isArray(a)?a.slice():[];for(var i=0;i<b.length;i++)r[i]=add(r[i],b[i],sg);return r}
 if(isO(b)){var o=isO(a)?a:{};Object.keys(b).forEach(function(k){if(sg<0&&!(k in o))return;o[k]=add(o[k],b[k],sg)});return o}
 return a}
function clone(x){return x==null?x:JSON.parse(JSON.stringify(x))}
function hash(s){var h=5381;for(var i=0;i<s.length;i++)h=(h*33+s.charCodeAt(i))|0;return h+":"+s.length}
var ADDF=["st","ok","tot","sec","learn","play"];

/* --- part de ce téléphone --- */
var LOCALP=["stars","econ","shopBought","shopPend","shopLog","shopGiven"]; // la photo du profil est synchronisée (demande de l'utilisateur) // champs d'un profil qui ne sont pas des « réglages »
function settingsOf(p){var o={};Object.keys(p).forEach(function(k){if(LOCALP.indexOf(k)<0)o[k]=p[k]});if(o.path){o.path=clone(o.path);delete o.path.prog}return o}
function addPart(p){var E=p.econ||{},days={},best={};Object.keys(E.days||{}).forEach(function(d){var x=E.days[d],y={};ADDF.forEach(function(f){if(x[f])y[f]=x[f]});days[d]=y;if(x.best)best[d]=x.best});
 return{add:{stars:p.stars||0,days:days,bought:p.shopBought||{}},best:best}}
function gkeys(){var r=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k==="shop"||k==="rw_cfg"||k==="de_words"||/^de_off@/.test(k))r.push(k)}return r}
function lvkeys(){var r=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(/_(lvl|best)(_[a-z0-9]+)?@/.test(k))r.push(k)}return r}
function touch(){ // horodate ce qui a changé ici depuis la dernière fois
 var now=Date.now(),ch=false;PR.list.forEach(function(p){var h=hash(JSON.stringify(settingsOf(p)));if(SY.h[p.id]!==h){SY.h[p.id]=h;SY.mt[p.id]=now;ch=true}});
 gkeys().forEach(function(k){var h=hash(localStorage.getItem(k)||"");if(SY.h["g:"+k]!==h){SY.h["g:"+k]=h;SY.mt["g:"+k]=now;ch=true}});
 if(ch){S("sync_h",SY.h);S("sync_mt",SY.mt)}}
function peerSum(sel){var r;Object.keys(SY.peers).forEach(function(d){var v=sel(SY.peers[d]);if(v!=null)r=add(r,v,1)});return r}
function own(){touch();var o={v:1,p:{},st:{},g:{},lv:{},del:PR.del||{}};
 PR.list.forEach(function(p){ensureShop(p);var a=addPart(p),oth=peerSum(function(x){return x.p&&x.p[p.id]&&x.p[p.id].add});
  o.p[p.id]={s:settingsOf(p),mt:SY.mt[p.id]||0,add:oth?add(clone(a.add),oth,-1):a.add,best:a.best,
   pend:p.shopPend,given:p.shopGiven||[],log:p.shopLog,prog:p.path&&p.path.prog||null};
  var stt=clone(st(p.id)),so=peerSum(function(x){return x.st&&x.st[p.id]});o.st[p.id]=so?add(stt,so,-1):stt});
 gkeys().forEach(function(k){o.g[k]={v:localStorage.getItem(k),t:SY.mt["g:"+k]||0}});
 lvkeys().forEach(function(k){var n=parseInt(localStorage.getItem(k));if(!isNaN(n))o.lv[k]=n});
 return o}

/* --- appliquer les parts des autres téléphones --- */
function apply(N){touch();var P=SY.peers,devs=Object.keys(N);
 var del=clone(PR.del||{});devs.forEach(function(d){Object.keys(N[d].del||{}).forEach(function(id){del[id]=Math.max(del[id]||0,N[d].del[id])})});PR.del=del;
 var ids={};devs.forEach(function(d){Object.keys(N[d].p||{}).forEach(function(id){ids[id]=1})});
 Object.keys(ids).forEach(function(id){if(del[id])return;var p=PR.list.filter(function(x){return x.id===id})[0],nw=!p;
  if(nw){p={id:id,stars:0};PR.list.push(p)}ensureShop(p);ensureEcon(p);
  // réglages : le plus récent
  var bm=nw?-1:(SY.mt[id]||0),bs=null;devs.forEach(function(d){var x=N[d].p&&N[d].p[id];if(x&&x.mt>bm){bm=x.mt;bs=x.s}});
  if(bs){Object.keys(p).forEach(function(k){if(LOCALP.indexOf(k)<0&&k!=="id")delete p[k]});var prog=p.path&&p.path.prog;Object.keys(bs).forEach(function(k){p[k]=clone(bs[k])});if(prog&&p.path)p.path.prog=prog;SY.mt[id]=bm}
  // compteurs : + nouvelles parts − anciennes parts
  var sel=function(x){return x&&x.p&&x.p[id]&&x.p[id].add},nn=null,oo=null;devs.forEach(function(d){nn=add(nn,sel(N[d]),1)});Object.keys(P).forEach(function(d){oo=add(oo,sel(P[d]),1)});
  var cur={stars:p.stars||0,days:{},bought:p.shopBought};Object.keys(p.econ.days).forEach(function(d){var x=p.econ.days[d],y={};ADDF.forEach(function(f){y[f]=x[f]||0});cur.days[d]=y});
  cur=add(add(cur,nn,1),oo,-1);p.stars=Math.round(cur.stars*100)/100;p.shopBought=cur.bought||{};
  Object.keys(cur.days).forEach(function(d){var x=p.econ.days[d]||(p.econ.days[d]={st:0,ok:0,tot:0,sec:0,best:0});ADDF.forEach(function(f){x[f]=Math.max(0,cur.days[d][f]||0)})});
  devs.forEach(function(d){var x=N[d].p&&N[d].p[id];if(!x)return;Object.keys(x.best||{}).forEach(function(k){var y=p.econ.days[k];if(y)y.best=Math.max(y.best||0,x.best[k])});
   // achats à remettre, journal, parcours du jour
   var gv={};(p.shopGiven||[]).concat(x.given||[]).forEach(function(g){gv[g]=1});p.shopGiven=Object.keys(gv).slice(-300);
   var pend={};p.shopPend.concat(x.pend||[]).forEach(function(it){if(!gv[it.id])pend[it.id]=it});p.shopPend=Object.keys(pend).map(function(k){return pend[k]});
   var lg={};p.shopLog.concat(x.log||[]).forEach(function(it){lg[it.u||(it.d+"|"+it.t+"|"+it.price)]=it});p.shopLog=Object.keys(lg).map(function(k){return lg[k]}).sort(function(a,b){return a.d<b.d?1:-1}).slice(0,80);
   if(x.prog&&p.path){var a=p.path.prog||{},b=x.prog;if(b.d===dkey()&&(a.d!==b.d||b.i>a.i||(b.i===a.i&&(b.c>a.c||(b.c===a.c&&(b.q||0)>(a.q||0))))))p.path.prog=clone(b)}});
  // statistiques
  var sn=null,so=null;devs.forEach(function(d){sn=add(sn,N[d].st&&N[d].st[id],1)});Object.keys(P).forEach(function(d){so=add(so,P[d].st&&P[d].st[id],1)});
  if(sn||so){var t=add(add(clone(st(id)),sn,1),so,-1);STC[id]=t;stSave(id)}});
 PR.list=PR.list.filter(function(p){return !del[p.id]});if(!PR.list.length)return; // jamais sans profil
 if(!PR.list.some(function(p){return p.id===PR.active}))PR.active=PR.list[0].id;
 // réglages communs : le plus récent ; niveaux : maximum
 var gb={};devs.forEach(function(d){Object.keys(N[d].g||{}).forEach(function(k){var x=N[d].g[k];if(x.t>(SY.mt["g:"+k]||0)&&(!gb[k]||x.t>gb[k].t))gb[k]=x})});
 Object.keys(gb).forEach(function(k){if(gb[k].v==null)localStorage.removeItem(k);else localStorage.setItem(k,gb[k].v);SY.mt["g:"+k]=gb[k].t;SY.h["g:"+k]=hash(gb[k].v||"")});
 if(gb.rw_cfg){try{var c=JSON.parse(gb.rw_cfg.v);Object.keys(c).forEach(function(k){CFG[k]=c[k]})}catch(e){}}
 if(gb.shop&&typeof SHOP!=="undefined")SHOP=null;
 devs.forEach(function(d){Object.keys(N[d].lv||{}).forEach(function(k){var v=N[d].lv[k],m=parseInt(localStorage.getItem(k));if(isNaN(m)||v>m)localStorage.setItem(k,v)})});
 PR.list.forEach(function(p){SY.h[p.id]=hash(JSON.stringify(settingsOf(p)))});
 SY.peers=N;S("sync_peers",N);S("sync_mt",SY.mt);S("sync_h",SY.h);
 try{if(typeof deBuild==="function")deBuild()}catch(e){}
 saveP()}

/* --- réseau --- */
function tok(){var t=L("sync_tok",null);if(t&&t.exp>Date.now()+60000)return Promise.resolve(t);var U=urls();
 if(t&&t.rt)return fetch(U.tok,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"grant_type=refresh_token&refresh_token="+encodeURIComponent(t.rt)}).then(function(r){if(!r.ok)throw new Error("auth "+r.status);return r.json()}).then(function(j){var n={id:j.id_token,rt:j.refresh_token,uid:j.user_id,exp:Date.now()+(+j.expires_in||3600)*1000};S("sync_tok",n);return n});
 return fetch(U.auth,{method:"POST",headers:{"Content-Type":"application/json"},body:'{"returnSecureToken":true}'}).then(function(r){if(!r.ok)throw new Error("auth "+r.status);return r.json()}).then(function(j){var n={id:j.idToken,rt:j.refreshToken,uid:j.localId,exp:Date.now()+(+j.expiresIn||3600)*1000};S("sync_tok",n);return n})}
function devPath(fam,uid){return "families/"+fam+"/devices"+(uid?"/"+uid:"")}
function pull(fam){return tok().then(function(t){return fetch(urls().fs+devPath(fam)+"?pageSize=50",{headers:{Authorization:"Bearer "+t.id}}).then(function(r){if(!r.ok)throw new Error("lecture "+r.status);return r.json()}).then(function(j){var N={};
 (j.documents||[]).forEach(function(doc){var uid=doc.name.split("/").pop();if(uid===t.uid)return;try{N[uid]=JSON.parse(doc.fields.data.stringValue)}catch(e){}});return{N:N,uid:t.uid,n:(j.documents||[]).length}})})}
function push(fam,o){var body=JSON.stringify(o);return tok().then(function(t){return fetch(urls().fs+devPath(fam,t.uid),{method:"PATCH",headers:{Authorization:"Bearer "+t.id,"Content-Type":"application/json"},
 body:JSON.stringify({fields:{ts:{integerValue:String(Date.now())},data:{stringValue:body}}})}).then(function(r){if(!r.ok)throw new Error("écriture "+r.status);SY.pushed=hash(body)})})}

/* --- synchronisation : lire les autres, fusionner, publier sa part --- */
SY.now=function(){if(!SY.fam||!SY.ready()||SY.busy||window.NOSAVE)return Promise.resolve(false);SY.busy=true;
 return pull(SY.fam).then(function(r){
  if(SY.joining){if(!Object.keys(r.N).length)throw new Error("famille vide");PR.list=[];gkeys().forEach(function(k){SY.h["g:"+k]=hash(localStorage.getItem(k)||"");SY.mt["g:"+k]=0})} // téléphone qui rejoint : rien de local ne doit l'emporter
  apply(r.N);var o=own(),h=hash(JSON.stringify(o));return h===SY.pushed?null:push(SY.fam,o)}).then(function(){if(SY.joining){SY.joining=false;localStorage.removeItem("sync_join");setTimeout(function(){location.reload()},300)}SY.last=Date.now();localStorage.setItem("sync_last",SY.last);SY.err="";SY.busy=false;SY.after&&SY.after();return true})
 .catch(function(e){SY.err=String(e&&e.message||e);SY.busy=false;SY.after&&SY.after();return false})};
var AL="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function newCode(){var a=new Uint8Array(12),s="";crypto.getRandomValues(a);for(var i=0;i<12;i++)s+=AL[a[i]%32];return s}
SY.fmt=function(c){return c.replace(/(.{4})(?=.)/g,"$1-")};
SY.create=function(){var c=newCode();SY.fam=c;localStorage.setItem("sync_fam",c);SY.peers={};S("sync_peers",{});SY.pushed="";return SY.now().then(function(ok){if(!ok){SY.fam="";localStorage.removeItem("sync_fam")}return ok})};
// rejoindre : les profils de ce téléphone sont remplacés par ceux de la famille
SY.join=function(code){code=String(code||"").toUpperCase().replace(/[^A-Z0-9]/g,"");if(code.length!==12)return Promise.reject(new Error("code"));
 return pull(code).then(function(r){if(!Object.keys(r.N).length)throw new Error("inconnu");
  window.NOSAVE=true;["sync_peers","sync_mt","sync_h","sync_last"].forEach(function(k){localStorage.removeItem(k)});
  for(var i=localStorage.length-1;i>=0;i--){var k=localStorage.key(i);if(/^stats@|^de_off@|_(lvl|best)(_[a-z0-9]+)?@/.test(k))localStorage.removeItem(k)}
  localStorage.setItem("sync_fam",code);localStorage.setItem("sync_join","1");location.reload()})};
SY.leave=function(){["sync_fam","sync_peers","sync_mt","sync_h","sync_last"].forEach(function(k){localStorage.removeItem(k)});SY.fam="";SY.peers={};SY.last=0};
// juste après « Rejoindre » (page rechargée) : profils de la famille, sans rien ajouter de ce téléphone
if(localStorage.getItem("sync_join"))SY.joining=true;
setTimeout(function(){if(SY.fam)SY.now()},SY.joining?300:1500);
setInterval(function(){if(SY.fam&&!document.hidden)SY.now()},45000);
document.addEventListener("visibilitychange",function(){if(SY.fam)SY.now()});
})();
