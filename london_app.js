function gmapLink(s){return "https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(s.a+", London");}
function numIcon(c,n){return L.divIcon({className:"",html:'<div class="ni" style="background:'+c+'"><span>'+n+'</span></div>',iconSize:[25,25],iconAnchor:[12,23],popupAnchor:[0,-23]});}
function sqIcon(c,l){return L.divIcon({className:"",html:'<div class="qi" style="background:'+c+'">'+l+'</div>',iconSize:[21,21],iconAnchor:[10,10],popupAnchor:[0,-10]});}

var map=L.map('map',{zoomControl:true}).setView([51.52,-0.16],11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'OpenStreetMap'}).addTo(map);
var satLayer=L.layerGroup(), sunLayer=L.layerGroup();

function buildCore(stops,color,layer,elId){
  var el=document.getElementById(elId), pts=[];
  stops.forEach(function(s,i){
    var num=i+1, m=L.marker([s.y,s.x],{icon:numIcon(color,num)});
    m.bindPopup('<b>'+num+'. '+s.n+'</b>'+(s.t?'<div>'+s.t+'</div>':'')+'<div>'+s.o+'</div><a href="'+gmapLink(s)+'" target="_blank">Google Maps 길찾기</a>');
    m.addTo(layer); pts.push([s.y,s.x]);
    var row=document.createElement('div'); row.className='st';
    row.innerHTML='<div class="bd" style="background:'+color+'">'+num+'</div><div>'+(s.t?'<div class="tm">'+s.t+'</div>':'')+'<b>'+s.n+'</b><div class="nt">'+s.o+'</div><a href="'+gmapLink(s)+'" target="_blank">Google Maps 길찾기</a></div>';
    row.onclick=function(e){if(e.target.tagName==='A')return; map.setView([s.y,s.x],15); m.openPopup();};
    el.appendChild(row);
  });
  L.polyline(pts,{color:color,weight:3,opacity:.55,dashArray:'6,6'}).addTo(layer);
  return pts;
}

function buildCat(cat,layer,elId){
  var el=document.getElementById(elId);
  var box=document.createElement('div'); box.className='cb';
  box.innerHTML='<div class="ct" style="color:'+cat.color+'">'+cat.title+'</div><div class="ch">'+cat.hint+'</div>';
  var pts=[];
  cat.items.forEach(function(s,i){
    var label=cat.code+(i+1), m=L.marker([s.y,s.x],{icon:sqIcon(cat.color,label)});
    m.bindPopup('<b>'+label+'. '+s.n+'</b><div>'+s.o+'</div><a href="'+gmapLink(s)+'" target="_blank">Google Maps 길찾기</a>');
    m.addTo(layer); pts.push([s.y,s.x]);
    var row=document.createElement('div'); row.className='st';
    row.innerHTML='<div class="bd sq" style="background:'+cat.color+'">'+label+'</div><div><b>'+s.n+'</b><div class="nt">'+s.o+'</div><a href="'+gmapLink(s)+'" target="_blank">Google Maps 길찾기</a></div>';
    row.onclick=function(e){if(e.target.tagName==='A')return; map.setView([s.y,s.x],16); m.openPopup();};
    box.appendChild(row);
  });
  el.appendChild(box);
  return pts;
}

var satPts = buildCore(satCore,SAT,satLayer,'l-sc')
  .concat(buildCat(satCatA,satLayer,'l-sa'))
  .concat(buildCat(satCatB,satLayer,'l-sb'))
  .concat(buildCat(satCatD,satLayer,'l-sd'));

var sunPts = buildCore(sunCore,SUN,sunLayer,'l-nc')
  .concat(buildCat(sunCatA,sunLayer,'l-na'))
  .concat(buildCat(sunCatB,sunLayer,'l-nb'));

satLayer.addTo(map); sunLayer.addTo(map);

function setDay(day){
  document.querySelectorAll('.tab').forEach(function(t){
    var on=t.dataset.d===day;
    t.classList.toggle('on',on);
    ['sat','sun','all'].forEach(function(c){t.classList.toggle(c, on && c===day);});
  });
  document.querySelectorAll('.db').forEach(function(b){b.classList.toggle('show',day==='all'||b.dataset.d===day);});
  map.removeLayer(satLayer); map.removeLayer(sunLayer);
  var bounds=[];
  if(day==='all'||day==='sat'){satLayer.addTo(map); bounds=bounds.concat(satPts);}
  if(day==='all'||day==='sun'){sunLayer.addTo(map); bounds=bounds.concat(sunPts);}
  if(bounds.length) map.fitBounds(bounds,{padding:[30,30]});
}
setDay('all');
