(() => {
  // Configuración: copia aquí la URL HTTPS /exec de tu aplicación de Google Apps Script.
  const EMILY_RSVP_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbzssADhO71SkFdGVf2eymUXcgbyU4_Tx_sRwHFf9X6cVTW051gnna8_mHn0ZpE_-aqtfQ/exec';

  'use strict';
  const EVENT_DATE = new Date('2026-12-12T19:30:00-05:00');
  const intro = document.getElementById('intro');
  const invitation = document.getElementById('invitation');
  const open = document.getElementById('open-envelope');
  const skipIntro = document.getElementById('skip-intro');
  const movie = document.getElementById('movie-screen');
  const film = document.getElementById('intro-video');
  const filmSound = document.getElementById('movie-sound');
  const filmSkip = document.getElementById('movie-skip');
  const filmReplay = document.getElementById('movie-play');
  const filmError = document.getElementById('movie-error');
  const filmProgress = document.getElementById('movie-progress-bar');
  const clouds = document.getElementById('cloud-curtain');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const music = new EmilySoundtrack();
  let phase = 'welcome';
  let timers = [];
  let version = 0;
  const later = (fn,delay)=>{const t=window.setTimeout(fn,delay);timers.push(t);return t;};
  const cancelTimers = ()=>{timers.forEach(t=>window.clearTimeout(t));timers=[];};

  // Dejar el video reproduciéndose durante la apertura del sobre permite que
  // el mismo gesto del usuario autorice su sonido en iOS y navegadores móviles.
  function beginOpening(){
    if(phase!=='welcome')return;
    phase='opening';
    open.disabled=true;
    intro.classList.add('is-opening');
    music.prepareFromGesture();
    movie.hidden=false;
    movie.classList.remove('is-showing','is-hiding');
    film.muted=false;
    filmSound?.setAttribute('aria-pressed','true');
    if(filmSound) filmSound.lastElementChild.textContent='Silenciar';
    filmReplay.hidden=true;
    filmError.hidden=true;
    try{film.currentTime=0;}catch(_){}
    const current=++version;
    let play;
    try{play=film.play();}catch(error){play=Promise.reject(error);}
    Promise.resolve(play).catch(()=>{
      if(current!==version || !['opening','video'].includes(phase))return;
      film.muted=true;
      filmSound?.setAttribute('aria-pressed','false');
      if(filmSound)filmSound.lastElementChild.textContent='Activar audio';
      return Promise.resolve(film.play()).catch(()=>{
        if(current!==version || !['opening','video'].includes(phase))return;
        filmReplay.hidden=false;
        filmError.hidden=false;
        filmError.textContent='Toca reproducir para ver el video o elige saltarlo.';
      });
    });
    const short=reducedMotion.matches;
    later(()=>{
      if(phase!=='opening')return;
      movie.classList.add('is-showing');
      intro.classList.add('is-leaving');
    },short?90:840);
    later(()=>{
      if(phase!=='opening')return;
      intro.hidden=true;
      intro.setAttribute('aria-hidden','true');
      phase='video';
      filmSkip?.focus({preventScroll:true});
    },short?145:1510);
    // Evita pantallas bloqueadas si el evento ended se pierde.
    later(()=>{if(['opening','video'].includes(phase))startClouds(false);},20000);
  }

  function revealBehindClouds(){
    if(phase!=='clouds')return;
    invitation.hidden=false;
    intro.hidden=true;
    intro.setAttribute('aria-hidden','true');
    movie.hidden=true;
    film.pause();
    window.scrollTo({top:0,behavior:'instant'});
  }

  function finishClouds(){
    if(phase!=='clouds')return;
    cancelTimers();
    invitation.hidden=false;
    clouds.hidden=true;
    clouds.classList.remove('is-active','is-short');
    movie.hidden=true;
    intro.hidden=true;
    document.body.classList.remove('intro-locked');
    phase='inside';
    invitation.setAttribute('tabindex','-1');
    invitation.focus({preventScroll:true});
  }

  function startClouds(short=false){
    if(!['opening','video'].includes(phase))return;
    const fast=short || reducedMotion.matches;
    phase='clouds';
    cancelTimers();
    film.pause();
    music.revealAfterVideo();
    clouds.hidden=false;
    clouds.classList.remove('is-active','is-short');
    if(fast)clouds.classList.add('is-short');
    // Reiniciar keyframes si se vuelve a abrir la invitación.
    void clouds.offsetWidth;
    clouds.classList.add('is-active');
    const d=fast?1600:3800;
    later(revealBehindClouds,Math.round(d*.51));
    later(finishClouds,d+70);
  }

  function enterDirectly(){
    if(phase!=='welcome')return;
    music.prepareFromGesture();
    phase='inside';
    cancelTimers();
    intro.hidden=true;
    intro.setAttribute('aria-hidden','true');
    movie.hidden=true;
    clouds.hidden=true;
    invitation.hidden=false;
    document.body.classList.remove('intro-locked');
    music.revealAfterVideo();
    invitation.setAttribute('tabindex','-1');
    invitation.focus({preventScroll:true});
  }

  function resetToEnvelope(){
    version++;
    cancelTimers();
    music.stop();
    film.pause();
    try{film.currentTime=0;}catch(_){}
    film.muted=false;
    movie.hidden=true;
    movie.classList.remove('is-showing','is-hiding');
    clouds.hidden=true;
    clouds.classList.remove('is-active','is-short');
    invitation.hidden=true;
    intro.hidden=false;
    intro.classList.remove('is-opening','is-leaving');
    intro.setAttribute('aria-hidden','false');
    document.body.classList.add('intro-locked');
    open.disabled=false;
    phase='welcome';
    window.scrollTo({top:0,behavior:'instant'});
    open.focus({preventScroll:true});
  }

  document.body.classList.add('intro-locked');
  open?.addEventListener('click',beginOpening);
  skipIntro?.addEventListener('click',enterDirectly);
  filmSkip?.addEventListener('click',()=>startClouds(true));
  film.addEventListener('ended',()=>startClouds(false));
  film.addEventListener('timeupdate',()=>{
    if(!filmProgress || !Number.isFinite(film.duration) || !film.duration)return;
    filmProgress.style.width=`${Math.min(100,film.currentTime/film.duration*100).toFixed(2)}%`;
  });
  film.addEventListener('error',()=>{
    if(!['opening','video'].includes(phase))return;
    filmError.hidden=false;
    filmReplay.hidden=false;
  });
  filmSound?.addEventListener('click',()=>{
    film.muted=!film.muted;
    filmSound.setAttribute('aria-pressed',String(!film.muted));
    filmSound.lastElementChild.textContent=film.muted?'Activar audio':'Silenciar';
  });
  filmReplay?.addEventListener('click',()=>{
    if(!['opening','video'].includes(phase))return;
    film.muted=false;
    const attempt=film.play();
    Promise.resolve(attempt).then(()=>{
      filmReplay.hidden=true;filmError.hidden=true;
    }).catch(()=>{
      film.muted=true;
      return Promise.resolve(film.play()).then(()=>{
        filmReplay.hidden=true;filmError.hidden=true;
      });
    }).catch(()=>{filmError.hidden=false;});
  });
  movie?.addEventListener('keydown',e=>{
    if(e.key==='Escape' && phase==='video'){e.preventDefault();startClouds(true);}
    if(e.key==='Tab' && phase==='video'){
      const controls=[filmSound,filmSkip,!filmReplay.hidden?filmReplay:null].filter(Boolean);
      const index=controls.indexOf(document.activeElement);
      e.preventDefault();controls[(index+(e.shiftKey?controls.length-1:1))%controls.length].focus();
    }
  });
  document.getElementById('reopen')?.addEventListener('click',resetToEnvelope);

  // Calendar precisely marks Saturday, December 12, 2026.
  const calendarDays = document.getElementById('calendar-days');
  if (calendarDays) {
    const dayOne = new Date(Date.UTC(2026,11,1)).getUTCDay();
    const count = new Date(Date.UTC(2026,12,0)).getUTCDate();
    for(let i=0;i<dayOne;i++) {
      const blank=document.createElement('span');
      blank.className='empty';
      blank.setAttribute('aria-hidden','true');
      calendarDays.appendChild(blank);
    }
    for(let day=1;day<=count;day++){
      const cell=document.createElement('span');
      cell.textContent=String(day);
      if(day===12){
        cell.className='special-day';
        cell.setAttribute('aria-label','Sábado 12 de diciembre, los quince años de Emily');
      }
      calendarDays.appendChild(cell);
    }
  }

  // Exact countdown. When the event has started, display a celebration message.
  function updateCountdown() {
    const remaining=Math.max(0,EVENT_DATE.getTime()-Date.now());
    const d=Math.floor(remaining/86400000);
    const h=Math.floor(remaining/3600000)%24;
    const m=Math.floor(remaining/60000)%60;
    const s=Math.floor(remaining/1000)%60;
    const values={days:d,hours:h,minutes:m,seconds:s};
    for(const [id,value] of Object.entries(values)) {
      const el=document.getElementById(id);
      if(el)el.textContent=String(value).padStart(2,'0');
    }
    const title=document.getElementById('countdown-title');
    if(remaining===0 && title)title.textContent='¡Llegó el gran día!';
  }
  updateCountdown();
  const countdownTimer=window.setInterval(updateCountdown,1000);
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden)updateCountdown(); });

  // La canción enviada por la familia: comienza al terminar el video.
  // Queda preparada en silencio desde el clic inicial para mayor compatibilidad móvil.
  function EmilySoundtrack(){
    this.audio=document.getElementById('emily-soundtrack');
    this.button=document.getElementById('music-toggle');
    this.icon=document.getElementById('music-icon');
    this.status=document.getElementById('music-status');
    this.help=document.getElementById('music-hint');
    this.Context=window.AudioContext||window.webkitAudioContext;
    this.context=null;
    this.gain=null;
    this.active=false;
    this.armed=false;
    this.userPaused=false;
    this.request=0;
    this.audio.loop=true;
  }
  EmilySoundtrack.prototype.graph=function(){
    if(this.context || !this.Context)return;
    try{
      const context=new this.Context();
      const node=context.createMediaElementSource(this.audio);
      const gain=context.createGain();
      gain.gain.value=0;
      node.connect(gain).connect(context.destination);
      this.context=context;
      this.gain=gain;
      this.audio.volume=1;
    }catch(e){
      // Si no existe WebAudio, evitar reproducir la canción prematuramente.
      this.context=null;this.gain=null;
    }
  };
  EmilySoundtrack.prototype.level=function(volume,duration=.8){
    if(this.context && this.gain){
      const now=this.context.currentTime;
      const g=this.gain.gain;
      g.cancelScheduledValues(now);
      g.setValueAtTime(g.value,now);
      g.linearRampToValueAtTime(volume,now+Math.max(.005,duration));
    } else {this.audio.volume=volume;}
  };
  EmilySoundtrack.prototype.update=function(){
    const playing=this.active && !this.audio.paused;
    this.button?.setAttribute('aria-pressed',String(playing));
    this.button?.setAttribute('aria-label',playing?'Pausar canción de Emily':'Reproducir canción de Emily');
    if(this.icon)this.icon.textContent=playing?'Ⅱ':'▶';
    if(this.status)this.status.textContent=playing?'La canción está sonando':'Música pausada';
  };
  EmilySoundtrack.prototype.prepareFromGesture=function(){
    const request=++this.request;
    this.active=false;this.armed=false;this.userPaused=false;
    if(this.help)this.help.hidden=true;
    this.graph();
    if(!this.context){this.update();return;}
    this.level(0,.005);
    this.audio.muted=false;
    try{this.audio.currentTime=0;}catch(_){}
    if(this.context.state==='suspended')this.context.resume().catch(()=>{});
    // Play sin await dentro del clic: autorizado pero inaudible durante el video.
    let result;
    try{result=this.audio.play();}catch(e){result=Promise.reject(e);}
    Promise.resolve(result).then(()=>{
      if(this.request===request)this.armed=true;
    }).catch(()=>{
      if(this.request===request)this.armed=false;
    });
    this.update();
  };
  EmilySoundtrack.prototype.revealAfterVideo=function(){
    const request=++this.request;
    this.userPaused=false;
    if(this.help)this.help.hidden=true;
    if(this.context?.state==='suspended')this.context.resume().catch(()=>{});
    try{this.audio.currentTime=0;}catch(_){}
    const start=()=>{
      if(this.request!==request)return;
      this.active=true;
      this.level(.78,1.65);
      this.update();
    };
    if(!this.audio.paused){start();return;}
    let result;
    try{result=this.audio.play();}catch(e){result=Promise.reject(e);}
    Promise.resolve(result).then(start).catch(()=>{
      if(this.request!==request)return;
      this.active=false;this.update();
      if(this.help)this.help.hidden=false;
    });
  };
  EmilySoundtrack.prototype.pause=function(){
    this.request++;
    this.userPaused=true;
    this.active=false;
    this.level(0,.02);
    this.audio.pause();
    this.update();
  };
  EmilySoundtrack.prototype.play=function(){
    const request=++this.request;
    this.userPaused=false;
    this.graph();
    if(this.context?.state==='suspended')this.context.resume().catch(()=>{});
    let result;
    try{result=this.audio.play();}catch(e){result=Promise.reject(e);}
    Promise.resolve(result).then(()=>{
      if(this.request!==request)return;
      this.active=true;
      this.level(.78,.55);
      if(this.help)this.help.hidden=true;
      this.update();
    }).catch(()=>{
      if(this.request!==request)return;
      this.active=false;
      if(this.help)this.help.hidden=false;
      this.update();
    });
  };
  EmilySoundtrack.prototype.stop=function(){
    this.request++;
    this.level(0,.005);
    this.audio.pause();
    try{this.audio.currentTime=0;}catch(_){}
    this.active=false;
    this.armed=false;
    this.userPaused=false;
    if(this.help)this.help.hidden=true;
    this.update();
  };
  music.button?.addEventListener('click',()=>{
    if(music.active && !music.audio.paused)music.pause();else music.play();
  });
  document.getElementById('music-prev')?.addEventListener('click',()=>{
    try{music.audio.currentTime=0;}catch(_){}
    if(!music.active)music.play();
  });
  document.getElementById('music-next')?.addEventListener('click',()=>{
    try{music.audio.currentTime=Math.min((Number.isFinite(music.audio.duration)?music.audio.duration-1:9999),music.audio.currentTime+15);}catch(_){}
    if(!music.active)music.play();
  });
  window.addEventListener('pagehide',()=>{
    film.pause();music.pause();
  });
  music.update();

  // RSVP: modalidad individual (1-2) o familiar (1-6), con nombres por persona.
  // Google Apps Script configurado; confirmar recepción real antes de compartir.
  const modal=document.getElementById('rsvp-dialog');
  const form=document.getElementById('rsvp-form');
  const feedback=document.getElementById('rsvp-feedback');
  const sendButton=document.getElementById('rsvp-submit');
  const attendanceOptions=document.getElementById('rsvp-attendance-options');
  const countSelect=document.getElementById('guest-count');
  const countHint=document.getElementById('rsvp-count-hint');
  const attendeeFields=document.getElementById('attendee-fields');
  const attendeeCounter=document.getElementById('attendee-counter');
  const attendeeExplanation=document.getElementById('attendee-explanation');
  let sending=false;
  let pendingId='';
  let submissionTimeout=0;
  let sent=false;
  const apiReady=/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec(?:\?.*)?$/.test(EMILY_RSVP_WEBAPP_URL);
  const setFeedback=(message,kind='info')=>{
    if(!feedback)return;
    feedback.textContent=message;
    feedback.dataset.state=kind;
  };
  const finishSending=()=>{
    sending=false;
    clearTimeout(submissionTimeout);
    if(sendButton)sendButton.disabled=false;
  };

  // Crear campos de los otros cinco invitados sin aceptar HTML del visitante.
  for(let i=2;i<=6;i++){
    const card=document.createElement('div');
    card.className='attendee-card';
    card.dataset.person=String(i);
    card.hidden=true;
    card.innerHTML=`<h4>Persona ${i} <span class="attendee-role">(acompañante)</span></h4>
      <div class="attendee-name-grid">
        <div><label for="firstName${i}">Nombres</label><input type="text" id="firstName${i}" name="firstName${i}" placeholder="Nombres" minlength="2" maxlength="60" disabled></div>
        <div><label for="lastName${i}">Apellidos</label><input type="text" id="lastName${i}" name="lastName${i}" placeholder="Apellidos" minlength="2" maxlength="60" disabled></div>
      </div>`;
    attendeeFields.appendChild(card);
  }
  const readAttendance=()=>form.querySelector('input[name="attending"]:checked')?.value==='Sí';
  const readGroupType=()=>form.querySelector('input[name="groupType"]:checked')?.value||'Individual';
  const activeCount=()=>readAttendance()?Number(countSelect.value):0;

  function updateRsvpFields(){
    const attending=readAttendance();
    const type=readGroupType();
    const max=type==='Familiar'?6:2;
    const previous=Number(countSelect.value)||1;
    countSelect.replaceChildren();
    for(let i=1;i<=max;i++){
      const option=new Option(`${i} ${i===1?'persona':'personas'}`,String(i));
      countSelect.add(option);
    }
    countSelect.value=String(Math.min(Math.max(previous,1),max));
    countSelect.disabled=!attending;
    attendanceOptions.hidden=!attending;
    attendanceOptions.querySelectorAll('input[name="groupType"]').forEach(input=>input.disabled=!attending);
    countHint.textContent=type==='Familiar'
      ?'Familiar: máximo 6 asistentes en total, incluyéndote.'
      :'Individual: máximo 2 asistentes en total, incluyéndote.';
    const count=activeCount();
    attendeeCounter.textContent=attending?`${count} ${count===1?'persona':'personas'}`:'No asistiré';
    attendeeExplanation.textContent=attending
      ?'Completa los nombres y apellidos de todas las personas que asistirán.'
      :'Indica tus nombres y apellidos para registrar que no podrás asistir.';
    attendeeFields.querySelectorAll('.attendee-card').forEach(card=>{
      const index=Number(card.dataset.person);
      const visible=index===1 || (attending && index<=count);
      card.hidden=!visible;
      card.querySelectorAll('input').forEach(input=>{
        input.disabled=!visible;
        input.required=visible;
      });
    });
  }
  updateRsvpFields();
  form?.querySelectorAll('input[name="attending"], input[name="groupType"]').forEach(radio=>{
    radio.addEventListener('change',updateRsvpFields);
  });
  countSelect?.addEventListener('change',updateRsvpFields);

  document.getElementById('open-rsvp')?.addEventListener('click',()=>{
    setFeedback('');
    if(typeof modal.showModal==='function')modal.showModal();
    else modal.setAttribute('open','');
  });
  document.getElementById('close-rsvp')?.addEventListener('click',()=>modal.close());
  modal?.addEventListener('click',event=>{if(event.target===modal)modal.close();});
  const freshId=()=>{
    if(typeof crypto!=='undefined' && crypto.randomUUID)return crypto.randomUUID();
    return 'emily'+Date.now().toString(36)+Math.random().toString(36).slice(2,14);
  };
  const markEdited=event=>{
    // Si se modifica la confirmación tras enviarla, usar un ID nuevo.
    if(sent && event.target?.name!=='website'){
      sent=false;
      pendingId='';
      document.getElementById('registration-id').value='';
    }
  };
  form?.addEventListener('input',markEdited);
  form?.addEventListener('change',markEdited);

  form?.addEventListener('submit',event=>{
    event.preventDefault();
    if(sending)return;
    if(!form.reportValidity())return;
    if(!apiReady){
      setFeedback('El registro aún no está activado. La persona organizadora debe conectar su Google Sheets antes de recibir confirmaciones.','error');
      return;
    }
    if(document.getElementById('guest-website').value)return;
    const attending=readAttendance();
    const type=readGroupType();
    const total=activeCount();
    const limit=type==='Familiar'?6:2;
    if(attending && (!Number.isInteger(total)||total<1||total>limit)){
      setFeedback(`Esta modalidad admite un máximo de ${limit} personas, incluyéndote.`,'error');
      return;
    }
    const requiredPeople=attending?total:1;
    for(let i=1;i<=requiredPeople;i++){
      const first=document.getElementById(`firstName${i}`);
      const last=document.getElementById(`lastName${i}`);
      first.value=first.value.trim().replace(/\s+/g,' ');
      last.value=last.value.trim().replace(/\s+/g,' ');
      if(first.value.length<2||last.value.length<2){
        setFeedback(`Completa los nombres y apellidos de la persona ${i}.`,'error');
        first.value.length<2?first.focus():last.focus();
        return;
      }
    }
    pendingId=pendingId||freshId();
    document.getElementById('registration-id').value=pendingId;
    form.action=EMILY_RSVP_WEBAPP_URL;
    form.target='rsvp-transport';
    sending=true;
    sendButton.disabled=true;
    setFeedback('Enviando tu confirmación…');
    // POST hacia iframe: compatible con invitaciones abiertas desde un HTML local.
    HTMLFormElement.prototype.submit.call(form);
    submissionTimeout=setTimeout(()=>{
      if(!sending)return;
      finishSending();
      setFeedback('No pudimos comprobar si se guardó. Revisa tu conexión e inténtalo de nuevo o consulta con quien organiza la celebración.','error');
      // Reutilizar el ID en reintentos para evitar respuestas duplicadas.
    },25000);
  });
  window.addEventListener('message',event=>{
    if(!sending || !event.data || typeof event.data!=='object')return;
    const data=event.data;
    if(data.type!=='EMILY_XV_RSVP_RESULT' || data.requestId!==pendingId)return;
    const googleOrigin=/^https:\/\/(?:[a-z0-9-]+\.)?googleusercontent\.com$/i.test(event.origin)
      || /^https:\/\/script\.google\.com$/i.test(event.origin);
    if(!googleOrigin)return;
    finishSending();
    if(data.ok===true){
      sent=true;
      setFeedback('¡Gracias! Tu respuesta quedó registrada para los XV años de Emily. 💗','success');
    }else{
      setFeedback('No fue posible guardar tu respuesta. Inténtalo otra vez.','error');
    }
  });

})();
