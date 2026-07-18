function gmapLink(s){return "https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(s.a+", London");}
function numIcon(c,n){return L.divIcon({className:"",html:'<div class="ni" style="background:'+c+'"><span>'+n+'</span></div>',iconSize:[25,25],iconAnchor:[12,23],popupAnchor:[0,-23]});}
function sqIcon(c,l){return L.divIcon({className:"",html:'<div class="qi" style="background:'+c+'">'+l+'</div>',iconSize:[21,21],iconAnchor:[10,10],popupAnchor:[0,-10]});}
function bearingDeg(p1,p2){
  var lat1=p1[0]*Math.PI/180, lat2=p2[0]*Math.PI/180, dLon=(p2[1]-p1[1])*Math.PI/180;
  var y=Math.sin(dLon)*Math.cos(lat2);
  var x=Math.cos(lat1)*Math.sin(lat2)-Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
  return (Math.atan2(y,x)*180/Math.PI+360)%360;
}
function addArrows(pts,color,layer){
  for(var i=0;i<pts.length-1;i++){
    var a=pts[i], b=pts[i+1], mid=[(a[0]+b[0])/2,(a[1]+b[1])/2];
    var brg=bearingDeg(a,b);
    var icon=L.divIcon({className:"",html:'<div class="ar" style="color:'+color+';transform:rotate('+brg+'deg)">&#8593;</div>',iconSize:[16,16],iconAnchor:[8,8]});
    L.marker(mid,{icon:icon,interactive:false}).addTo(layer);
  }
}

function placeSlug(s){
  return (s.n+'|'+s.a).toLowerCase()
    .replace(/[.#$\[\]\/]/g,' ')
    .replace(/[^a-z0-9가-힣]+/g,'-')
    .replace(/^-+|-+$/g,'')
    .slice(0,80) || 'place';
}

function attachTagBtn(row,s){
  var pid=placeSlug(s);
  var btn=document.createElement('button');
  btn.className='tagbtn'; btn.dataset.pid=pid; btn.dataset.name=s.n;
  btn.innerHTML='🏷️ <span class="tagcnt">0</span>';
  btn.onclick=function(e){ e.stopPropagation(); if(window.openPlaceNotes) window.openPlaceNotes(pid, s.n); };
  row.querySelector('div:last-child').appendChild(btn);
}

var map=L.map('map',{zoomControl:true}).setView([51.52,-0.16],11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'OpenStreetMap'}).addTo(map);
var monLayer=L.layerGroup(), sunLayer=L.layerGroup();
var currentDay='all';
window.currentDay=currentDay;

function buildCore(stops,color,layer,elId){
  var el=document.getElementById(elId), pts=[];
  stops.forEach(function(s,i){
    var num=i+1, m=L.marker([s.y,s.x],{icon:numIcon(color,num)});
    m.bindPopup('<b>'+num+'. '+s.n+'</b>'+(s.t?'<div>'+s.t+'</div>':'')+'<div>'+s.o+'</div><a href="'+gmapLink(s)+'" target="_blank">Google Maps 길찾기</a>');
    m.addTo(layer); pts.push([s.y,s.x]);
    var row=document.createElement('div'); row.className='st';
    row.innerHTML='<div class="bd" style="background:'+color+'">'+num+'</div><div>'+(s.t?'<div class="tm">'+s.t+'</div>':'')+'<b>'+s.n+'</b><div class="nt">'+s.o+'</div><a href="'+gmapLink(s)+'" target="_blank">Google Maps 길찾기</a></div>';
    row.onclick=function(e){if(e.target.tagName==='A'||e.target.classList.contains('tagbtn'))return; map.setView([s.y,s.x],15); m.openPopup();};
    el.appendChild(row);
    attachTagBtn(row,s);
  });
  L.polyline(pts,{color:color,weight:3,opacity:.55,dashArray:'6,6'}).addTo(layer);
  addArrows(pts,color,layer);
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
    row.onclick=function(e){if(e.target.tagName==='A'||e.target.classList.contains('tagbtn'))return; map.setView([s.y,s.x],16); m.openPopup();};
    box.appendChild(row);
    attachTagBtn(row,s);
  });
  el.appendChild(box);
  return pts;
}

var monCorePts = buildCore(monCore,MON,monLayer,'l-mc');
var monPts = monCorePts
  .concat(buildCat(monCatB,monLayer,'l-mb'))
  .concat(buildCat(monCatD,monLayer,'l-md'));

var sunCorePts = buildCore(sunCore,SUN,sunLayer,'l-nc');
var sunPts = sunCorePts
  .concat(buildCat(sunCatA,sunLayer,'l-na'))
  .concat(buildCat(sunCatB,sunLayer,'l-nb'));

monLayer.addTo(map); sunLayer.addTo(map);

function setDay(day){
  currentDay=day; window.currentDay=day;
  document.querySelectorAll('.tab').forEach(function(t){
    var on=t.dataset.d===day;
    t.classList.toggle('on',on);
    ['mon','sun','all'].forEach(function(c){t.classList.toggle(c, on && c===day);});
  });
  document.querySelectorAll('.db').forEach(function(b){b.classList.toggle('show',day==='all'||b.dataset.d===day);});
  map.removeLayer(monLayer); map.removeLayer(sunLayer);
  var bounds=[];
  if(day==='all'||day==='sun'){sunLayer.addTo(map); bounds=bounds.concat(sunPts);}
  if(day==='all'||day==='mon'){monLayer.addTo(map); bounds=bounds.concat(monPts);}
  if(bounds.length) map.fitBounds(bounds,{padding:[30,30]});
}
setDay('all');

/* ---- 모바일: 지도가 메인, '동선 목록 보기' 버튼을 누르면 현재 동선이 글래스 팝업 카드로 ---- */
function initMobileRoutePopup(){
  if(!window.matchMedia('(max-width:820px)').matches) return;
  var header=document.querySelector('header');
  var routeBackdrop=document.getElementById('routeBackdrop');
  var sb=document.getElementById('sb');
  if(!header||!routeBackdrop||!sb) return;

  var handle=document.createElement('div'); handle.className='sb-handle';
  handle.innerHTML='<span>📋 현재 동선 목록</span>';
  var closeBtn=document.createElement('button'); closeBtn.type='button'; closeBtn.setAttribute('aria-label','닫기'); closeBtn.textContent='✕';
  handle.appendChild(closeBtn);
  sb.insertBefore(handle, sb.firstChild);

  function setOpen(open){
    document.body.classList.toggle('route-open', open);
    if(open){
      ['notesPanel','notesBackdrop','placePanel','placeBackdrop'].forEach(function(id){
        var el=document.getElementById(id); if(el) el.classList.remove('open');
      });
    } else {
      setTimeout(function(){map.invalidateSize();},220);
    }
  }
  header.addEventListener('click', function(e){
    if(e.target.closest('.tab')) return;
    setOpen(!document.body.classList.contains('route-open'));
  });
  closeBtn.addEventListener('click', function(e){ e.stopPropagation(); setOpen(false); });
  routeBackdrop.addEventListener('click', function(){ setOpen(false); });
  setTimeout(function(){map.invalidateSize();},50);
}
initMobileRoutePopup();

/* ---- 월요일(7/20) 실제 당일 기준 현재 위치 하이라이트 ---- */
function highlightNow(){
  var rows=document.querySelectorAll('#l-mc .st');
  if(!rows.length) return;
  var now=new Date();
  function p(n){return (n<10?'0':'')+n;}
  var todayStr = now.getFullYear()+'-'+p(now.getMonth()+1)+'-'+p(now.getDate());
  if(todayStr!=='2026-07-20'){
    rows.forEach(function(r){r.classList.remove('now');});
    return;
  }
  var nowMin = now.getHours()*60+now.getMinutes();
  var best=-1;
  monCore.forEach(function(s,i){
    if(!s.t) return;
    var parts=s.t.split(':'); var m=parseInt(parts[0],10)*60+parseInt(parts[1],10);
    if(m<=nowMin) best=i;
  });
  rows.forEach(function(r,i){ r.classList.toggle('now', i===best); });
}
if(document.querySelector('#l-mc')){
  highlightNow();
  setInterval(highlightNow, 60000);
}
