const scheduleData = {
  '': {
    'Monday': [
      { title: '1f AL t podst fr (int7)', start: '08:55', end: '09:40' },
      { title: '1f AL t podst fr (int7)', start: '09:50', end: '10:35' },
      { title: '1f AL t podst fr (int7)', start: '10:45', end: '11:30' },
      { title: '1f AL t podst fr (int7)', start: '11:40', end: '12:25' },
      { title: '1f KB p stylizacja (28)', start: '12:30', end: '13:15' },
      { title: '1f KB p stylizacja (28)', start: '13:45', end: '14:30' },
      { title: '1f KB p stylizacja (28)', start: '14:35', end: '15:20' },
      { title: '1f KB p stylizacja (28)', start: '15:30', end: '16:15' }
    ],

    'Tuesday': [
      { title: '1f KB p stylizacja (28)', start: '08:00', end: '08:45' },
      { title: '1f KB p stylizacja (28)', start: '08:55', end: '09:40' },
      { title: '1f KB p stylizacja (28)', start: '09:50', end: '10:35' },
      { title: '1f KB p stylizacja (28)', start: '10:45', end: '11:30' }
    ],

    'Wednesday': [
      { title: 'Wychowanie fizyczne (sg5)', start: '08:00', end: '08:45' },
      { title: 'Wychowanie fizyczne (sg5)', start: '08:55', end: '09:40' },
      { title: 'Język polski (M1)', start: '09:50', end: '10:35' },
      { title: 'Język angielski (115)', start: '10:45', end: '11:30' },
      { title: 'Język angielski (115)', start: '11:40', end: '12:25' },
      { title: 'Informatyka (112)', start: '12:30', end: '13:15' },
      { title: 'Biznes i zarządzanie (113)', start: '13:45', end: '14:30' }
    ],

    'Thursday': [
      { title: 'EDB (4)', start: '08:55', end: '09:40' },
      { title: 'Matematyka (113)', start: '09:50', end: '10:35' },
      { title: 'Matematyka (108)', start: '10:45', end: '11:30' },
      { title: 'Biologia (108)', start: '11:40', end: '12:25' }
    ],

    'Friday': [
      { title: 'Zajęcia z wychowawcą (113)', start: '08:00', end: '08:45' },
      { title: 'Biznes i zarządzanie (113)', start: '08:55', end: '09:40' },
      { title: 'Fizyka (120)', start: '09:50', end: '10:35' },
      { title: 'Język polski (14)', start: '10:45', end: '11:30' },
      { title: 'Historia (20)', start: '11:40', end: '12:25' },
      { title: 'Wychowanie fizyczne (sg2)', start: '12:30', end: '13:15' }

    ]
  }
};


  const daysUk = ['Неділя','Понеділок','Вівторок','Середа','Четвер','П`ятниця','Субота'];
  const daysEn = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  const startHour = Number(getComputedStyle(document.documentElement).getPropertyValue('--start-hour')) || 7;
  const endHour = Number(getComputedStyle(document.documentElement).getPropertyValue('--end-hour')) || 22;
  const hourHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hour-height')) || 60;

  let currentDate = new Date();
  let shownDayOffset = 0;

  function renderHours(){
    const hoursCol = document.getElementById('hoursColumn');
    hoursCol.innerHTML = '';
    for(let h = startHour; h <= endHour; h++){
      const div = document.createElement('div');
      div.className = 'hour-cell';
      div.textContent = String(h).padStart(2,'0') + ':00';
      hoursCol.appendChild(div);
    }
  }

  function getLessonsForDay(dayNameEn){
    const lessons = [];
    for(const [friend, weeks] of Object.entries(scheduleData)){
      const arr = weeks[dayNameEn] || [];
      arr.forEach(l => lessons.push({...l, friend}));
    }
    lessons.sort((a,b)=>timeToMinutes(a.start)-timeToMinutes(b.start));
    return lessons;
  }
  function timeToMinutes(t){const [hh,mm] = t.split(':').map(Number);return hh*60 + (mm||0);}  
  function minutesToTop(mins){return (mins - startHour*60) / 60 * hourHeight;}

  function renderDay(offsetDays=0){
    const date = new Date();
    date.setDate(currentDate.getDate() + offsetDays);
    const dayNameEn = daysEn[date.getDay()];
    const dayNameUk = daysUk[date.getDay()];

    document.getElementById('dayName').textContent = dayNameUk;
    document.getElementById('dateLabel').textContent = date.toLocaleDateString();
    document.getElementById('currentDayLabel').textContent = `${dayNameUk} — ${date.toLocaleDateString()}`;

    const lessons = getLessonsForDay(dayNameEn);
    const body = document.getElementById('dayBody');
    const hoursLine = document.getElementById('hoursLine');

    hoursLine.innerHTML = '';
    for(let h = startHour; h < endHour; h++){
      const r = document.createElement('div');
      r.className='hour-row';
      hoursLine.appendChild(r);
    }

    Array.from(body.querySelectorAll('.lesson')).forEach(n=>n.remove());

    lessons.forEach(l =>{
      const el = document.createElement('div');
      el.className = 'lesson';
      el.dataset.start = l.start;
      el.dataset.end = l.end;

      const top = minutesToTop(timeToMinutes(l.start));
      const bottom = minutesToTop(timeToMinutes(l.end));
      const height = Math.max(24, bottom - top);

      el.style.top = top + 'px';
      el.style.height = height + 'px';

      el.innerHTML = `<div class="title">${escapeHtml(l.title)}</div><div class="meta">${l.friend} • ${l.start} — ${l.end}</div>`;
      body.appendChild(el);
    });

    updateNowIndicator(date, offsetDays);
  }

  function escapeHtml(s){return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');}

  function updateNowIndicator(dateForDay){
    const now = new Date();
    const isToday = sameDate(new Date(), dateForDay);

    const nowLine = document.getElementById('nowLine');
    const nowDot = document.getElementById('nowDot');

    if(!isToday){
      nowLine.style.display='none';
      nowDot.style.display='none';
    } else{
      const minutes = now.getHours()*60 + now.getMinutes();
      const top = minutesToTop(minutes);
      nowLine.style.display='block';
      nowDot.style.display='block';
      nowLine.style.top = top + 'px';
      nowDot.style.top = top + 'px';
    }

    const lessons = Array.from(document.querySelectorAll('.lesson'));
    const nowM = now.getHours()*60 + now.getMinutes();

    lessons.forEach(el =>{
      const endM = timeToMinutes(el.dataset.end);
      if(endM <= nowM && isToday){el.classList.add('past');}
      else el.classList.remove('past');
    });
  }

  function sameDate(a,b){return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();}

  document.getElementById('prevDay').addEventListener('click', ()=>{shownDayOffset -= 1; renderDay(shownDayOffset);});
  document.getElementById('nextDay').addEventListener('click', ()=>{shownDayOffset += 1; renderDay(shownDayOffset);});
  document.getElementById('todayBtn').addEventListener('click', ()=>{shownDayOffset = 0; renderDay(0);});

  renderHours();
  renderDay(0);

  setInterval(()=>{
    const d = new Date();
    updateNowIndicator(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  }, 60000);
