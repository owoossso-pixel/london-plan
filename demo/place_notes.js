// 장소별 메모/태그 — Firebase Realtime Database 기반 (데모: demo-place-notes 경로 사용)
(function(){
  var backdrop=document.getElementById('placeBackdrop');
  var panel=document.getElementById('placePanel');
  var titleEl=document.getElementById('placeTitle');
  var closeBtn=document.getElementById('placeClose');
  var nameInput=document.getElementById('placeName');
  var listEl=document.getElementById('placeList');
  var input=document.getElementById('placeInput');
  var sendBtn=document.getElementById('placeSend');
  var warnEl=document.getElementById('placeWarn');
  var chipsWrap=document.getElementById('placeTagChips');
  if(!panel) return;

  var NAME_KEY='ldn_name';
  var TAGS={visited:{label:'✅ 다녀옴',color:'#22c55e'},recommend:{label:'⭐ 추천',color:'#f59e0b'},check:{label:'❓ 확인필요',color:'#8b5cf6'}};
  var selectedTag=null;
  var currentPid=null, currentName=null;
  var allNotes={}; // pid -> [note,...]

  nameInput.value = localStorage.getItem(NAME_KEY) || '';
  nameInput.addEventListener('change', function(){ localStorage.setItem(NAME_KEY, nameInput.value.trim()); });

  Array.prototype.forEach.call(chipsWrap.querySelectorAll('button'), function(chip){
    chip.onclick=function(){
      var t=chip.dataset.tag;
      selectedTag = (selectedTag===t) ? null : t;
      Array.prototype.forEach.call(chipsWrap.querySelectorAll('button'), function(c){
        c.classList.toggle('sel', c.dataset.tag===selectedTag);
      });
    };
  });

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function fmtTime(ts){
    var d=new Date(ts);
    function p(n){ return (n<10?'0':'')+n; }
    return p(d.getMonth()+1)+'/'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes());
  }

  function updateBadges(){
    document.querySelectorAll('.tagbtn').forEach(function(btn){
      var pid=btn.dataset.pid;
      var n=(allNotes[pid]||[]).length;
      var cnt=btn.querySelector('.tagcnt');
      cnt.textContent=n;
      btn.classList.toggle('has', n>0);
    });
  }

  function renderList(){
    listEl.innerHTML='';
    var notes=allNotes[currentPid]||[];
    if(!notes.length){
      listEl.innerHTML='<div class="place-empty">아직 메모가 없어요. 첫 메모를 남겨보세요 🎀</div>';
      return;
    }
    var myName=(localStorage.getItem(NAME_KEY)||'').trim();
    notes.forEach(function(nte){
      var row=document.createElement('div');
      row.className='note-row'+(myName && nte.name===myName ? ' me':'');
      var tagInfo = nte.tag && TAGS[nte.tag];
      var tag = tagInfo ? '<span class="note-tag" style="background:'+tagInfo.color+'">'+tagInfo.label+'</span>' : '';
      var bubble=document.createElement('div'); bubble.className='note-bubble';
      bubble.innerHTML = tag+'<div class="note-meta"><b>'+escapeHtml(nte.name||'익명')+'</b><span>'+(nte.ts?fmtTime(nte.ts):'')+'</span></div><div class="note-text"></div>';
      var textEl=bubble.querySelector('.note-text');
      if(textEl) textEl.textContent = nte.text||'';
      if(myName && nte.name===myName){
        var del=document.createElement('span'); del.className='note-del'; del.textContent='삭제';
        del.onclick=function(){ if(confirm('메모를 삭제할까요?')) notesRef.child(currentPid).child(nte.key).remove(); };
        bubble.appendChild(del);
      }
      row.appendChild(bubble);
      listEl.appendChild(row);
    });
  }

  window.openPlaceNotes=function(pid, name){
    currentPid=pid; currentName=name;
    titleEl.textContent='📍 '+name;
    selectedTag=null;
    Array.prototype.forEach.call(chipsWrap.querySelectorAll('button'), function(c){ c.classList.remove('sel'); });
    renderList();
    panel.classList.add('open'); backdrop.classList.add('open');
    setTimeout(function(){ listEl.scrollTop = listEl.scrollHeight; }, 80);
  };
  function closePanel(){ panel.classList.remove('open'); backdrop.classList.remove('open'); }
  if(closeBtn) closeBtn.addEventListener('click', closePanel);
  if(backdrop) backdrop.addEventListener('click', closePanel);

  if(typeof firebase==='undefined' || typeof firebaseConfig==='undefined' || !window.FIREBASE_READY){
    if(warnEl){
      warnEl.hidden=false;
      warnEl.textContent='Firebase 설정이 아직 안 되어있어요. 장소 메모 기능을 쓰려면 firebase-config.js 설정이 필요해요.';
    }
    sendBtn.disabled=true;
    return;
  }

  if(!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  var notesRef = firebase.database().ref('demo-place-notes');

  notesRef.on('value', function(snap){
    var grouped={};
    snap.forEach(function(placeSnap){
      var pid=placeSnap.key;
      var arr=[];
      placeSnap.forEach(function(c){ var v=c.val()||{}; v.key=c.key; arr.push(v); });
      arr.sort(function(a,b){ return (a.ts||0)-(b.ts||0); });
      grouped[pid]=arr;
    });
    allNotes=grouped;
    updateBadges();
    if(currentPid && panel.classList.contains('open')) renderList();
  });

  function send(){
    var text=input.value.trim();
    var name=(nameInput.value||'').trim();
    if(!text || !currentPid) return;
    if(!name){
      nameInput.focus();
      nameInput.placeholder='먼저 이름을 입력해주세요';
      return;
    }
    localStorage.setItem(NAME_KEY, name);
    notesRef.child(currentPid).push({name:name, text:text, tag:selectedTag, ts: firebase.database.ServerValue.TIMESTAMP});
    input.value='';
    selectedTag=null;
    Array.prototype.forEach.call(chipsWrap.querySelectorAll('button'), function(c){ c.classList.remove('sel'); });
  }
  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', function(e){ if(e.key==='Enter'){ e.preventDefault(); send(); } });
})();
