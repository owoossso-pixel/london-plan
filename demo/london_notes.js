// 팀 실시간 메모 — Firebase Realtime Database 기반 (데모: demo-team-notes 경로 사용, 실서비스 데이터와 분리)
(function(){
  var panel=document.getElementById('notesPanel');
  var backdrop=document.getElementById('notesBackdrop');
  var fab=document.getElementById('notesFab');
  var badge=document.getElementById('notesBadge');
  var listEl=document.getElementById('notesList');
  var input=document.getElementById('noteInput');
  var sendBtn=document.getElementById('noteSend');
  var nameInput=document.getElementById('noteName');
  var warnEl=document.getElementById('notesWarn');
  var chipsWrap=document.getElementById('noteTagChips');
  if(!panel||!fab) return;

  var NAME_KEY='ldn_name', SEEN_KEY='ldn_lastSeen';
  var TAGS={visited:{label:'✅ 다녀옴',color:'#22c55e'},recommend:{label:'⭐ 추천',color:'#f59e0b'},check:{label:'❓ 확인필요',color:'#8b5cf6'}};
  var selectedTag=null;
  nameInput.value = localStorage.getItem(NAME_KEY) || '';
  nameInput.addEventListener('change', function(){
    localStorage.setItem(NAME_KEY, nameInput.value.trim());
  });
  if(chipsWrap){
    Array.prototype.forEach.call(chipsWrap.querySelectorAll('button'), function(chip){
      chip.onclick=function(){
        var t=chip.dataset.tag;
        selectedTag = (selectedTag===t) ? null : t;
        Array.prototype.forEach.call(chipsWrap.querySelectorAll('button'), function(c){
          c.classList.toggle('sel', c.dataset.tag===selectedTag);
        });
      };
    });
  }

  function openPanel(){
    panel.classList.add('open'); backdrop.classList.add('open');
    localStorage.setItem(SEEN_KEY, String(Date.now()));
    badge.hidden = true;
    setTimeout(function(){ listEl.scrollTop = listEl.scrollHeight; }, 80);
  }
  function closePanel(){ panel.classList.remove('open'); backdrop.classList.remove('open'); }
  fab.addEventListener('click', function(){ panel.classList.contains('open') ? closePanel() : openPanel(); });
  backdrop.addEventListener('click', closePanel);
  var closeBtn=document.getElementById('notesClose');
  if(closeBtn) closeBtn.addEventListener('click', closePanel);

  if(typeof firebase==='undefined' || typeof firebaseConfig==='undefined' || !window.FIREBASE_READY){
    warnEl.hidden=false;
    warnEl.textContent='Firebase 설정이 아직 안 되어있어요. firebase-config.js에 설정값을 넣으면 팀원들과 실시간으로 메모를 공유할 수 있어요.';
    sendBtn.disabled = true;
    return;
  }

  if(!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  var notesRef = firebase.database().ref('demo-team-notes');

  var dayColors={sun:'#e11d48', mon:'#0284c7', all:'#64748b'};
  var dayLabels={sun:'일요일', mon:'월요일', all:'공통'};

  function fmtTime(ts){
    var d=new Date(ts);
    function p(n){ return (n<10?'0':'')+n; }
    return p(d.getHours())+':'+p(d.getMinutes());
  }
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  var firstLoad=true;
  notesRef.orderByChild('ts').on('value', function(snap){
    var notes=[];
    snap.forEach(function(c){
      var v=c.val()||{};
      v.key=c.key;
      notes.push(v);
    });
    listEl.innerHTML='';
    var myName=(localStorage.getItem(NAME_KEY)||'').trim();
    notes.forEach(function(nte){
      var row=document.createElement('div');
      row.className='note-row'+(myName && nte.name===myName ? ' me':'');
      var dayTag = nte.day && dayLabels[nte.day] ? '<span class="note-tag" style="background:'+(dayColors[nte.day]||'#64748b')+'">'+dayLabels[nte.day]+'</span>' : '';
      var userTag = nte.tag && TAGS[nte.tag] ? '<span class="note-tag" style="background:'+TAGS[nte.tag].color+'">'+TAGS[nte.tag].label+'</span>' : '';
      var bubble=document.createElement('div'); bubble.className='note-bubble';
      bubble.innerHTML = dayTag+userTag+'<div class="note-meta"><b>'+escapeHtml(nte.name||'익명')+'</b><span>'+(nte.ts?fmtTime(nte.ts):'')+'</span></div><div class="note-text"></div>';
      bubble.querySelector('.note-text').textContent = nte.text||'';
      if(myName && nte.name===myName){
        var del=document.createElement('span'); del.className='note-del'; del.textContent='삭제';
        del.onclick=function(){ if(confirm('메모를 삭제할까요?')) notesRef.child(nte.key).remove(); };
        bubble.appendChild(del);
      }
      row.appendChild(bubble);
      listEl.appendChild(row);
    });
    if(panel.classList.contains('open')){
      listEl.scrollTop = listEl.scrollHeight;
    }
    var lastSeen = Number(localStorage.getItem(SEEN_KEY)||0);
    var unread = notes.filter(function(n){ return n.ts && n.ts>lastSeen; });
    if(!panel.classList.contains('open') && unread.length){
      badge.hidden=false; badge.textContent = unread.length>9 ? '9+' : String(unread.length);
    }
    firstLoad=false;
  });

  function send(){
    var text=input.value.trim();
    var name=(nameInput.value||'').trim();
    if(!text) return;
    if(!name){
      nameInput.focus();
      nameInput.placeholder='먼저 이름을 입력해주세요';
      return;
    }
    localStorage.setItem(NAME_KEY, name);
    var day = (typeof window.currentDay!=='undefined' && window.currentDay) || 'all';
    notesRef.push({name:name, text:text, day:day, tag:selectedTag, ts: firebase.database.ServerValue.TIMESTAMP});
    input.value='';
    selectedTag=null;
    if(chipsWrap) Array.prototype.forEach.call(chipsWrap.querySelectorAll('button'), function(c){ c.classList.remove('sel'); });
  }
  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', function(e){ if(e.key==='Enter'){ e.preventDefault(); send(); } });
})();
