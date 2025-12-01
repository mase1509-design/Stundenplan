document.addEventListener("DOMContentLoaded", () => {

  const schedules = {
    simon: {
      Montag:    ["BSS","Mathe","Musik","Deutsch","Kunst","Kunst"],
      Dienstag:  ["Mathe","Deutsch","Deutsch","Sachunterricht","Religion","Englisch"],
      Mittwoch:  ["","Deutsch","Deutsch","Mathe","Sachunterricht",""],
      Donnerstag:["Sport","Religion","Deutsch","Englisch","Mathe","Musik"],
      Freitag:   ["Schwimmen","Schwimmen","Deutsch","Mathe","Sachunterricht",""]
    },
    luisa: {
      Montag:    ["Anfangsunterricht Bähr","Anfangsunterricht Bähr","Anfangsunterricht Bähr","Sport","Anfangsunterricht Schmälzle","Musik"],
      Dienstag:  ["","Religion","Kunst","Musik","Kunst",""],
      Mittwoch:  ["Anfangsunterricht Schmälzle","Anfangsunterricht Schmälzle","Sport","Anfangsunterricht Schmälzle","Anfangsunterricht Bähr","Chor AG"],
      Donnerstag:["Anfangsunterricht Bähr","Anfangsunterricht Bähr","Anfangsunterricht Schmälzle","Anfangsunterricht Schmälzle","Anfangsunterricht Schmälzle","Anfangsunterricht Schmälzle"],
      Freitag:   ["Anfangsunterricht Bähr","Religion","Anfangsunterricht Schmälzle","Sport","Anfangsunterricht Schmälzle",""]
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
    let html = `<table class="table"><thead><tr><th>Uhrzeit</th>`;

    // Tage oben (horizontal)
    days.forEach(d => html += `<th data-day="${d}">${d}</th>`);
    html += `</tr></thead><tbody>`;

    // Stunden links (vertikal)
    times.forEach((t, idx) => {
      html += `<tr data-idx="${idx}">
        <th>${t.from}<br>${t.to}</th>`;

      days.forEach(day => {
        html += `<td>${plan[day][idx] || ""}</td>`;
      });

      html += `</tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  }

  // Tabellen aufbauen
  buildTable(document.getElementById("simon"), schedules.simon);
  buildTable(document.getElementById("luisa"), schedules.luisa);

  function updateHighlights(){
    const now = new Date();
    const minutes = now.getHours()*60 + now.getMinutes();

    const weekday = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"][now.getDay()];

    // Datum + Zeit
    document.getElementById("currentDate").textContent =
      now.toLocaleDateString("de-DE",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
    document.getElementById("currentTime").textContent =
      now.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"});

    // Clear old highlights
    document.querySelectorAll("th[data-day]").forEach(th => th.classList.remove("col-day-current"));
    document.querySelectorAll("tr[data-idx]").forEach(tr => tr.classList.remove("row-now"));

    // Highlight current day (column)
    const dayHeader = document.querySelector(`th[data-day="${weekday}"]`);
    if(dayHeader) dayHeader.classList.add("col-day-current");

    // Find current time slot
    let currentIdx = -1;
    times.forEach((t,i)=>{
      if(minutes >= hmToMinutes(t.from) && minutes < hmToMinutes(t.to)){
        currentIdx = i;
      }
    });

    // Highlight row of current lesson
    if(currentIdx >= 0){
      const row = document.querySelector(`tr[data-idx="${currentIdx}"]`);
      if(row) row.classList.add("row-now");

      const subjectCells = row.querySelectorAll("td");
      let info = "Aktuell: ";

      if(subjectCells.length > 0){
        info += `${times[currentIdx].from}-${times[currentIdx].to}`;
      }
      document.getElementById("currentLesson").textContent = info;
    } else {
      document.getElementById("currentLesson").textContent = "Aktuell: Keine laufende Stunde";
    }
  }

  updateHighlights();
  setInterval(updateHighlights, 30000);

  // Tabs
  document.querySelectorAll(".tab").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
      btn.classList.add("active");

      document.querySelectorAll(".plan").forEach(p=>p.classList.remove("active"));
      document.getElementById(btn.dataset.target).classList.add("active");

      updateHighlights();
    });
  });

});
