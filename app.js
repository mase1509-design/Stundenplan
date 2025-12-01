// App: Stundenplan
// Zeitzone: Europe/Berlin (verwendet die lokale Zeit des Geräts)

const schedules = {
  simon: {
    name: 'Simon',
    days: {
      Montag: [
        ['07:45','08:30','BSS'],
        ['08:35','09:20','Mathe'],
        ['09:40','10:25','Musik'],
        ['10:25','11:10','Deutsch'],
        ['11:30','12:15','Kunst'],
        ['12:15','13:00','Kunst']
      ],
      Dienstag: [
        ['07:45','08:30','Mathe'],
        ['08:35','09:20','Deutsch'],
        ['09:40','10:25','Deutsch'],
        ['10:25','11:10','Sachunterricht'],
        ['11:30','12:15','Religion'],
        ['12:15','13:00','Englisch']
      ],
      Mittwoch: [
        ['07:45','08:30',''],
        ['08:35','09:20','Deutsch'],
        ['09:40','10:25','Detusch'],
        ['10:25','11:10','Mathe'],
        ['11:30','12:15','Sachunterricht'],
        ['12:15','13:00','']
      ],
      Donnerstag: [
        ['07:45','08:30','Sport'],
        ['08:35','09:20','Religion'],
        ['09:40','10:25','Deutsch'],
        ['10:25','11:10','Englisch'],
        ['11:30','12:15','Mathe'],
        ['12:15','13:00','Musik']
      ],
      Freitag: [
        ['07:45','08:30','Schwimmen'],
        ['08:35','09:20','Schwimmen'],
        ['09:40','10:25','Deutsch'],
        ['10:25','11:10','Mathe'],
        ['11:30','12:15','Sachunterricht'],
        ['12:15','13:00','']
      ]
    }
  },
  luisa: {
    name: 'Luisa',
    days: {
      Montag: [
        ['07:45','08:30','Anfangsunterricht Bähr'],
        ['08:35','09:20','Anfangsunterricht Bähr'],
        ['09:40','10:25','Anfangsunterricht Bähr'],
        ['10:25','11:10','Sport'],
        ['11:30','12:15','Anfangsunterricht Schmälzle'],
        ['12:15','13:00','Musik']
      ],
      Dienstag: [
        ['07:45','08:30',''],
        ['08:35','09:20','Religion'],
        ['09:40','10:25','Kunst'],
        ['10:25','11:10','Musik'],
        ['11:30','12:15','Kunst'],
        ['12:15','13:00','']
      ],
      Mittwoch: [
        ['07:45','08:30','Anfangsunterricht Schmälzle'],
        ['08:35','09:20','Anfangsunterricht Schmälzle'],
        ['09:40','10:25','Sport'],
        ['10:25','11:10','Anfangsunterricht Schmälzle'],
        ['11:30','12:15','Anfangsunterricht Bähr'],
        ['12:15','13:00','Chor AG']
      ],
      Donnerstag: [
        ['07:45','08:30','Anfangsunterricht Bähr'],
        ['08:35','09:20','Anfangsunterricht Bähr'],
        ['09:40','10:25','Anfangsunterricht Schmälzle'],
        ['10:25','11:10','Anfangsunterricht Schmälzle'],
        ['11:30','12:15','Anfangsunterricht Schmälzle'],
        ['12:15','13:00','Anfangsunterricht Schmälzle']
      ],
      Freitag: [
        ['07:45','08:30','Anfangsunterricht Bähr'],
        ['08:35','09:20','Religion'],
        ['09:40','10:25','Anfangsunterricht Schmälzle'],
        ['10:25','11:10','Sport'],
        ['11:30','12:15','Anfangsunterricht Schmälzle'],
        ['12:15','13:00','']
      ]
    }
  }
}

const dayOrder = ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];

function buildTable(container, schedule){
  const tbl = document.createElement('table');
  tbl.className = 'table';
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Wochentag</th><th>Zeit</th><th>Fach</th></tr>';
  tbl.appendChild(thead);
  const tbody = document.createElement('tbody');

  dayOrder.slice(0,5).forEach(day => {
    const lessons = schedule.days[day] || [];
    if(lessons.length===0){
      const tr = document.createElement('tr');
      tr.dataset.day = day;
      tr.innerHTML = `<th>${day}</th><td colspan="2">keine Einträge</td>`;
      tbody.appendChild(tr);
      return;
    }

    lessons.forEach((ls, idx) => {
      const [from,to,subj] = ls;
      const tr = document.createElement('tr');
      tr.dataset.day = day;
      tr.dataset.from = from;
      tr.dataset.to = to;
      if(idx===0){
        tr.innerHTML = `<th rowspan="${lessons.length}">${day}</th><td>${from} - ${to}</td><td>${subj || ''}</td>`;
      } else {
        tr.innerHTML = `<td>${from} - ${to}</td><td>${subj || ''}</td>`;
      }
      tbody.appendChild(tr);
    })
  })

  tbl.appendChild(tbody);
  container.innerHTML = '';
  container.appendChild(tbl);
}

function parseTimeHM(hm){
  const [hh,mm] = hm.split(':').map(Number);
  return {hh,mm};
}

function timeToMinutes(hm){
  const p = parseTimeHM(hm);
  return p.hh*60 + p.mm;
}

function updateNowHighlights(){
  const now = new Date(); // uses device timezone; phones in Germany will use Europe/Berlin
  // Show date/time
  const dateEl = document.getElementById('currentDate');
  const timeEl = document.getElementById('currentTime');
  const lessonEl = document.getElementById('currentLesson');

  dateEl.textContent = now.toLocaleDateString('de-DE', {weekday:'long', year:'numeric', month:'long', day:'numeric'});
  timeEl.textContent = now.toLocaleTimeString('de-DE', {hour:'2-digit',minute:'2-digit'});

  // Find current weekday name in German matching our keys
  const weekdayIndex = now.getDay(); // 0=Sunday
  const germanDay = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'][weekdayIndex];

  // Highlight current day rows
  document.querySelectorAll('tr').forEach(tr=> tr.classList.remove('current','now'));
  document.querySelectorAll('tr[data-day]').forEach(tr=>{
    if(tr.dataset.day === germanDay) tr.classList.add('current');
  });

  // Compute minutes since midnight
  const minutesNow = now.getHours()*60 + now.getMinutes();

  // Find any lesson that contains current time
  let found = null;
  document.querySelectorAll('tr[data-day]').forEach(tr=>{
    if(tr.dataset.day !== germanDay) return;
    if(!tr.dataset.from || !tr.dataset.to) return;
    const from = timeToMinutes(tr.dataset.from);
    const to = timeToMinutes(tr.dataset.to);
    if(minutesNow >= from && minutesNow < to){
      tr.classList.add('now');
      const subj = tr.querySelector('td:last-child') ? tr.querySelector('td:last-child').textContent : '';
      found = `${tr.dataset.from} - ${tr.dataset.to} · ${subj}`;
    }
  });

  lessonEl.textContent = found ? `Aktuell: ${found}` : 'Aktuell: Keine laufende Stunde';
}

// Build both schedules
document.addEventListener('DOMContentLoaded', ()=>{
  buildTable(document.getElementById('simon'), schedules.simon);
  buildTable(document.getElementById('luisa'), schedules.luisa);

  // Tabs
  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.plan').forEach(p=>p.classList.remove('active'));
      document.getElementById(btn.dataset.target).classList.add('active');
      updateNowHighlights();
    })
  });

  // Initial update
  updateNowHighlights();
  // Update every 30s
  setInterval(updateNowHighlights, 30000);

  // Refresh when coming back into view
  window.addEventListener('visibilitychange', ()=>{ if(!document.hidden) updateNowHighlights(); });
});
