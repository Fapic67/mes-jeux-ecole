import fs from "fs";import {feature,merge} from "topojson-client";import {geoAzimuthalEqualArea,geoPath,geoContains} from "d3-geo";
const topo=JSON.parse(fs.readFileSync(process.argv[2],"utf8"));
// Frontières reconnues internationalement : la Crimée est rattachée à l'Ukraine
const G=topo.objects.countries.geometries,ru=G.find(g=>g.properties.name==="Russia"),ua=G.find(g=>g.properties.name==="Ukraine");
const ci=ru.arcs.findIndex(a=>geoContains(feature(topo,{type:"Polygon",arcs:a}),[34.1,44.95]));
if(ci>=0){const cr={type:"Polygon",arcs:ru.arcs[ci]};ru.arcs.splice(ci,1);const m=merge(topo,[ua,cr]);ua.type=m.type==="MultiPolygon"?"MultiPolygon":"MultiPolygon";ua.__geo=m;console.log("Crimée → Ukraine")}
const fc=feature(topo,topo.objects.countries);for(const f of fc.features)if(f.properties.name==="Ukraine")f.geometry=ua.__geo;
const W=1000,H=860;
// cadre : de l'Islande/Portugal à l'Oural, de la Méditerranée au Cap Nord
const frame={type:"Feature",geometry:{type:"MultiPoint",coordinates:[[-24,35],[45,35],[-10,71],[40,71],[-24,64],[50,56],[15,35]]}};
const proj=geoAzimuthalEqualArea().rotate([-12,-53]).fitExtent([[0,0],[W,H]],frame).clipExtent([[-5,-5],[W+5,H+5]]);
const path=geoPath(proj).digits(0);
const out=[];
for(const f of fc.features){const d=path(f);if(!d||d.length<10)continue;const c=path.centroid(f);const a=path.area(f);out.push({n:f.properties.name,d,c:[Math.round(c[0]),Math.round(c[1])],a:Math.round(a)})}
fs.writeFileSync(process.argv[3],JSON.stringify({W,H,f:out}));
console.log(out.length,"pays",JSON.stringify(out).length,"octets");console.log(out.map(x=>x.n).join("|"));
