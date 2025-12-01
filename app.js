document.addEventListener("DOMContentLoaded", () => {
  const schedules = {
    simon: { /* wie vorher */ },
    luisa: { /* wie vorher */ }
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
    let html = `<table class="table"><thead><tr><th>Zeit</th>`;
    days.forEach(day => html += `<th>${day}</th>`);
    html += `</tr></thead><tbody>`;

    times.forEach((t, idx) => {
      html += `<tr data-time="${t.from}-${t.to}"><th>${t.from} - ${t.to}</th>`;
      days.forEach(day => {
        html += `<td data-day="${day}" data-time="${t.from}-${t.to}">${plan[day][idx] || ''}</td>`;
      });
      html += `</tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  }

  function updateHighlights(container){
    const now = new Date();
    const minutes = now.getHours()*60 + now.getMinutes();
    const weekday = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"][now.getDay()];

    document.getElementById("currentDate").textContent = now.toLocaleDateString("de-DE",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
    document.getElementById("currentTime").textContent = now.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"});

    // Alle Highlights entfernen
    container.querySelectorAll("td, th").forEach(el => el.classList.remove("row-now","col-day-current"));

    // Aktueller Tag = Spalte markieren
    const dayIndex = days.indexOf(weekday);
    if(dayIndex >= 0){
      container.querySelectorAll("tbody tr").forEach(tr => {
        tr.querySelectorAll("td")[dayIndex].classList.add("col-day-current");
      });
    }

    // Aktuelle Stunde = Zeile markieren
    const rowIndex = times.findIndex(t => minutes >= hmToMinutes(t.from) && minutes < hmToMinutes(t.to));
    if(rowIndex >= 0 && dayIndex >= 0){
      const tr = container.querySelectorAll("tbody tr")[rowIndex];
      tr.querySelectorAll("td")[dayIndex].classList.add("row-now");
      document.getElementById("currentLesson").textContent = `Aktuell: ${times[rowIndex].from}-${times[rowIndex].to}`;
    } else {
      document.getElementById("currentLesson").textContent = "Aktuell: Keine laufende Stunde";
    }
  }

  // Initial: nur Simon bauen
  buildTable(document.getElementById("simon"), schedules.simon);
  updateHighlights(document.getElementById("simon"));

  // Tabs
  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.plan').forEach(p=>p.classList.remove('active'));
      const target = document.getElementById(btn.dataset.target);
      target.classList.add('active');

      // Tabelle für den Tab bauen, falls leer (wichtig für iOS)
      if(!target.querySelector("table")){
        buildTable(target, schedules[btn.dataset.target]);
      }
      updateHighlights(target);
    });
  });

  // Aktualisierung alle 30 Sekunden für sichtbaren Tab
  setInterval(() => {
    const activePlan = document.querySelector(".plan.active");
    if(activePlan) updateHighlights(activePlan);
  },30000);
});
