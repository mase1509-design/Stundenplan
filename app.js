document.addEventListener("DOMContentLoaded", () => {
  const schedules = {
    simon: {
      Montag: ["BSS","Mathe","Musik","Deutsch","Kunst","Kunst"],
      Dienstag: ["Mathe","Deutsch","Deutsch","Sachunterricht","Religion","Englisch"],
      Mittwoch: ["","Deutsch","Deutsch","Mathe","Sachunterricht",""],
      Donnerstag: ["Sport","Religion","Deutsch","Englisch","Mathe","Musik"],
      Freitag: ["Schwimmen","Schwimmen","Deutsch","Mathe","Sachunterricht",""]
    },
    luisa: {
      Montag: ["Anfangsunterricht Bähr","Anfangsunterricht Bähr","Anfangsunterricht Bähr","Sport","Anfangsunterricht Schmälzle","Musik"],
      Dienstag: ["","Religion","Kunst","Musik","Kunst",""],
      Mittwoch: ["Anfangsunterricht Schmälzle","Anfangsunterricht Schmälzle","Sport","Anfangsunterricht Schmälzle","Anfangsunterricht Bähr","Chor AG"],
      Donnerstag: ["Anfangsunterricht Bähr","Anfangsunterricht Bähr","Anfangsunterricht Schmälzle","Anfangsunterricht Schmälzle","Anfangsunterricht Schmälzle","Anfangsunterricht Schmälzle"],
      Freitag: ["Anfangsunterricht Bähr","Religion","Anfangsunterricht Schmälzle","Sport","Anfangsunterricht Schmälzle",""]
    }
  };

  const days = ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag"];
  const times = [
    { from:"07:45", to:"08:30" },
    { from:"08:35", to:"09:20" },
    { from:"09:40", to:"10:25" },
    { from:"10:25", to:"11:10" },
    { from:"11:30", to:"12:15" },
    { from:"12:15", to:"13:00" }
  ];

  function hmToMinutes(hm){
    const [h,m] = hm.split(":").map(Number);
    return h*60 + m;
  }

  function buildTable(container, plan){
    let html = `<table class="table"><thead><tr><th>Wochentag</th>`;
    times.forEach(t => html += `<th>${t.from}<br>${t.to}</th>`);
    html += `</tr></thead><tbody>`;

    days.forEach(day => {
      html += `<tr data-day="${day}"><th>${day}</th>`;
      plan[day].forEach(lesson => {
        html += `<td>${lesson || ''}</td>`;
      });
      html += `</tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  }

  buildTable(document.getElementById("simon"), schedules.simon);
  buildTable(document.getElementById("luisa"), schedules.luisa);

  function updateHighlights(){
    const now = new Date();
    const minutes = now.getHours()*60 + now.getMinutes();
    const weekday = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"][now.getDay()];

    document.getElementById("currentDate").textContent = now.toLocaleDateString("de-DE",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
    document.getElementById("currentTime").textContent = now.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"});

    // Remove old highlights
    document.querySelectorAll("tr[data-day] td").forEach(td=>td.classList.remove("row-now"));
    document.querySelectorAll("th.col-day-current").forEach(th=>th.classList.remove("col-day-current"));

    // Highlight current day
    document.querySelectorAll(`tr[data-day="${weekday}"]`).forEach(tr=>tr.querySelector("th").classList.add("col-day-current"));

    // Highlight current lesson
    const idx = times.findIndex(t => minutes >= hmToMinutes(t.from) && minutes < hmToMinutes(t.to));
    if(idx >= 0){
      document.querySelectorAll(`tr[data-day]`).forEach(tr=>{
        tr.querySelectorAll("td")[idx].classList.add("row-now");
      });
      document.getElementById("currentLesson").textContent = `Aktuell: ${times[idx].from}-${times[idx].to}`;
    } else {
      document.getElementById("currentLesson").textContent = "Aktuell: Keine laufende Stunde";
    }
  }

  updateHighlights();
  setInterval(updateHighlights,30000);

  // Tab switching
  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.plan').forEach(p=>p.classList.remove('active'));
      document.getElementById(btn.dataset.target).classList.add('active');
      updateHighlights();
    });
  });
});
