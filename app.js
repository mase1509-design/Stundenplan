// App: Stundenplan – Variante A (Tage vertikal, Zeiten horizontal)
tbody.appendChild(row);
});


tbl.appendChild(tbody);
container.innerHTML = "";
container.appendChild(tbl);
}


// --- Zeitfunktionen ---------------------------------------------------------
function hmToMin(hm){
const [h,m] = hm.split(":").map(Number);
return h*60+m;
}


function updateHighlight(){
const now = new Date();
const minutes = now.getHours()*60 + now.getMinutes();
const germanDays = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
const today = germanDays[now.getDay()];


document.querySelectorAll("td, th").forEach(c => c.classList.remove("current","now"));


// Markiert heutigen Tag
document.querySelectorAll(`tr[data-day="${today}"] th`).forEach(th => th.classList.add("current"));


// Aktuelle Stunde markieren
times.forEach((t,i)=>{
const from = hmToMin(t.from);
const to = hmToMin(t.to);
if(minutes >= from && minutes < to){
document.querySelectorAll(`tr[data-day="${today}"] td[data-idx="${i}"]`).forEach(td => td.classList.add("now"));
}
});
}


// --- Initialisierung --------------------------------------------------------
buildTable(document.getElementById("simon"), schedules.simon);
buildTable(document.getElementById("luisa"), schedules.luisa);
updateHighlight();
setInterval(updateHighlight, 30000);


// Tabs
const tabButtons = document.querySelectorAll(".tab");
tabButtons.forEach(btn => {
btn.addEventListener("click", () => {
tabButtons.forEach(b => b.classList.remove("active"));
btn.classList.add("active");
document.querySelectorAll('.plan').forEach(p => p.classList.remove('active'));
document.getElementById(btn.dataset.target).classList.add('active');
updateHighlight();
});
});
