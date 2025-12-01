// App: Stundenplan – Variante A (Tage vertikal, Zeiten horizontal)
// Robust initialisation: DOMContentLoaded wrapper and accessibility attributes

document.addEventListener('DOMContentLoaded', () => {
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
    {from: "07:45", to: "08:30"},
    {from: "08:35", to: "09:20"},
    {from: "09:40", to: "10:25"},
    {from: "10:25", to: "11:10"},
    {from: "11:30", to: "12:15"},
    {from: "12:15", to: "13:00"}
  ];

  function buildTable(container, plan) {
    const tbl = document.createElement("table");
    tbl.className = "table";
    tbl.setAttribute("role","table");
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headRow.innerHTML = `<th>Tag</th>` + times.map(t => `<th scope="col">${t.from}<br>${t.to}</th>`).join("");
    thead.appendChild(headRow);
    tbl.appendChild(thead);

    const tbody = document.createElement("tbody");
    days.forEach(day => {
      const row = document.createElement("tr");
      row.dataset.day = day;
      let html = `<th scope="row">${day}</th>`;
      plan[day].forEach((subject, i) => {
        html += `<td data-idx="${i}" data-from="${times[i].from}" data-to="${times[i].to}">${subject || ''}</td>`;
      });
      row.innerHTML = html;
      tbody.appendChild(row);
    });
    tbl.appendChild(tbody);
    container.innerHTML = "";
    container.appendChild(tbl);
  }

  function hmToMin(hm) {
    const [h,m] = hm.split(":").map(Number);
    return h*60 + m;
  }

  function updateNow() {
    const now = new Date();
    const minutes = now.getHours()*60 + now.getMinutes();
    const germanDays = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
    const today = germanDays[now.getDay()];

    // update date/time text
    const dateEl = document.getElementById("currentDate");
    const timeEl = document.getElementById("currentTime");
    const lessonEl = document.getElementById("currentLesson");
    dateEl.textContent = now.toLocaleDateString("de-DE", {weekday:"long", year:"numeric", month:"long", day:"numeric"});
    timeEl.textContent = now.toLocaleTimeString("de-DE", {hour:"2-digit", minute:"2-digit"});

    // clear previous highlights
    document.querySelectorAll(".row-current").forEach(el => el.classList.remove("row-current"));
    document.querySelectorAll(".cell-now").forEach(el => el.classList.remove("cell-now"));

    // highlight today's row (if present)
    const todaysRow = document.querySelector(`tr[data-day="${today}"]`);
    if (todaysRow) {
      todaysRow.classList.add("row-current");
    }

    // find current time slot index
    let currentIdx = -1;
    times.forEach((t, i) => {
      if (minutes >= hmToMin(t.from) && minutes < hmToMin(t.to)) currentIdx = i;
    });

    let foundText = null;
    if (currentIdx >= 0 && todaysRow) {
      const td = todaysRow.querySelector(`td[data-idx="${currentIdx}"]`);
      if (td) {
        td.classList.add("cell-now");
        const subj = td.textContent.trim() || "(kein Fach)";
        foundText = `${times[currentIdx].from} - ${times[currentIdx].to} · ${subj}`;
      }
    }

    lessonEl.textContent = foundText ? `Aktuell: ${foundText}` : "Aktuell: Keine laufende Stunde";
  }

  // build both tables
  buildTable(document.getElementById("simon"), schedules.simon);
  buildTable(document.getElementById("luisa"), schedules.luisa);

  // tabs
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(b => { b.classList.remove("active"); b.setAttribute("aria-pressed","false"); });
      btn.classList.add("active"); btn.setAttribute("aria-pressed","true");
      document.querySelectorAll(".plan").forEach(p => { p.classList.remove("active"); p.setAttribute("aria-hidden","true"); });
      const target = document.getElementById(btn.dataset.target);
      target.classList.add("active"); target.setAttribute("aria-hidden","false");
      updateNow();
    });
  });

  // initial highlight and periodic update
  updateNow();
  setInterval(updateNow, 30000);
  window.addEventListener('visibilitychange', () => { if (!document.hidden) updateNow(); });
});
