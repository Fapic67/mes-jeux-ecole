import fs from "fs";import {feature,merge} from "topojson-client";import {geoNaturalEarth1,geoPath,geoCentroid,geoArea} from "d3-geo";
const topo=JSON.parse(fs.readFileSync("world-atlas-2.0.2/package/countries-110m.json","utf8"));
const G=topo.objects.countries.geometries;
const ME=new Set(["Saudi Arabia","Yemen","Oman","United Arab Emirates","Qatar","Kuwait","Iraq","Jordan","Israel","Palestine","Lebanon","Syria","Iran","Turkey","Georgia","Armenia","Azerbaijan","Kazakhstan"]);
const EU=new Set("Albania Andorra Austria Belarus Belgium Bulgaria Croatia Cyprus Czechia Denmark Estonia Finland France Germany Greece Hungary Iceland Ireland Italy Kosovo Latvia Liechtenstein Lithuania Luxembourg Malta Moldova Monaco Montenegro Netherlands Macedonia Norway Poland Portugal Romania San_Marino Serbia Slovakia Slovenia Spain Sweden Switzerland Ukraine United_Kingdom Vatican Bosnia_and_Herz. N._Cyprus".split(" ").map(s=>s.replace(/_/g," ")));
function cont(g){const n=g.properties.name;if(n==="Antarctica")return"AN";if(n==="Russia")return"RU";if(EU.has(n))return"EU";if(ME.has(n))return"AS";
 const f=feature(topo,g),c=geoCentroid(f),lon=c[0],lat=c[1];
 if(n==="Indonesia"||n==="Timor-Leste"||n==="Philippines"||n==="Malaysia"||n==="Brunei")return"AS";
 if(n==="Fr. S. Antarctic Lands")return"AF";
 if(lon<-25)return lat>7.5?"NA":"SA";
 if(lon>=110&&lat<=0||lon>160||lon<-150)return"OC";
 if(lon>=-25&&lon<55&&lat<37.5)return"AF";
 return"AS"}
// la Guyane (France) est en Amérique du Sud
const fr=G.find(g=>g.properties.name==="France");if(fr&&fr.type==="MultiPolygon"){const keep=[],away=[];for(const a of fr.arcs){const c=geoCentroid(feature(topo,{type:"Polygon",arcs:a}));(c[0]<-30?away:keep).push(a)}fr.arcs=keep;if(away.length)G.push({type:"MultiPolygon",arcs:away,properties:{name:"Guyane"}})}
const groups={};const unk=[];for(const g of G){const k=cont(g);(groups[k]=groups[k]||[]).push(g)}
const W=1000,H=520;const proj=geoNaturalEarth1().fitExtent([[4,4],[W-4,H-4]],{type:"Sphere"});const path=geoPath(proj).digits(1);
const out={W,H,sphere:path({type:"Sphere"}),c:{}};
for(const k in groups){if(k==="RU")continue;out.c[k]=path(merge(topo,groups[k]))}
out.ru=path(feature(topo,groups.RU[0]));
// méridien 60°E (Oural, à peu près) : moitié Europe / moitié Asie de la Russie
function mer(lon){const m=[];for(let lat=89;lat>=-89;lat-=2){const p=proj([lon,lat]);m.push(p.map(v=>Math.round(v*10)/10).join(","))}return m}
const e=mer(60),w=mer(-30);
// Europe = entre 30°O et 60°E ; Asie = le reste (dont la Tchoukotka, de l'autre côté de 180°)
out.clipEU="M"+w.join("L")+"L"+e.slice().reverse().join("L")+"Z";
out.clipAS="M"+W+",0L"+e.join("L")+"L"+W+","+H+"Z M0,0L"+w.join("L")+"L0,"+H+"Z";
// centre de chaque continent pour l'étiquette
const LBL={EU:[15,52],AS:[90,45],AF:[20,5],NA:[-100,45],SA:[-60,-15],OC:[135,-25],AN:[0,-80]};out.l={};for(const k in LBL)out.l[k]=proj(LBL[k]).map(Math.round);

// ---- Océans (exercice « Trouve l'océan ») : zones simplifiées, la terre est dessinée par-dessus ----
function dens(pts){const o=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];const n=Math.max(1,Math.ceil(Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]))/2));for(let k=0;k<n;k++)o.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n])}o.push(o[0]);return o}
function poly(pts){let r=dens(pts);let g={type:"Polygon",coordinates:[r]};if(geoArea(g)>2*Math.PI){g={type:"Polygon",coordinates:[r.slice().reverse()]}}return g}
const ATL=[[-67,-60],[-67,-55],[-70,-50],[-70,-18],[-75,-5],[-79.5,9],[-84.5,11],[-85,13],[-90,15],[-94.5,17],[-100,25],[-100,66],[45,66],[45,47],[43,42],[37,37],[36.5,33],[32.3,31],[31.5,29],[30,0],[20,-35],[20,-60]];
const IND=[[20,-60],[20,-35],[30,0],[31.5,29],[32.6,30.2],[35,30],[44,31],[60,31],[90,28],[98,20],[99,10],[103,0],[104,-3],[105.8,-5.9],[106,-6.6],[111,-7.3],[114,-7.8],[116,-8.6],[119,-8.6],[122,-8.7],[125,-9.3],[131,-12.5],[135,-25],[145,-37],[147,-44],[147,-60]];
const PAC=[[147,-60],[293,-60],[293,-55],[290,-50],[290,-18],[285,-5],[280.5,9],[275.5,11],[275,13],[270,15],[265.5,17],[260,25],[260,66],[150,66],[140,62],[130,55],[118,42],[112,32],[105.5,20.5],[99,10],[103,0],[104,-3],[105.8,-5.9],[106,-6.6],[111,-7.3],[114,-7.8],[116,-8.6],[119,-8.6],[122,-8.7],[125,-9.3],[131,-12.5],[135,-25],[145,-37],[147,-44]];
const ring=(lat,pole)=>{const p=[];for(let l=-180;l<180;l+=2)p.push([l,lat]);for(let l=180;l>-180;l-=2)p.push([l,pole]);return p};
const ARC=ring(66,89.9),SOU=ring(-60,-89.9);
out.oc={};for(const [k,v] of Object.entries({ATL,IND,PAC,ARC,SOU}))out.oc[k]=path(poly(v));
out.land=path(merge(topo,G));
const OL={ATL:[-32,8],PAC:[-125,-22],IND:[78,-22],ARC:[10,77],SOU:[-20,-63]};out.ol={};for(const k in OL)out.ol[k]=proj(OL[k]).map(Math.round);
fs.writeFileSync("world.json",JSON.stringify(out));console.log(JSON.stringify(out).length);
for(const k in groups)console.log(k,groups[k].map(g=>g.properties.name).join(", "));
