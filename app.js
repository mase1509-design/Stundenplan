document.addEventListener("DOMContentLoaded", () => {
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
days.forEach(d => html += `<th data-day="${d}">${d}</th>`);
html += `</tr></thead><tbody>`;


times.forEach((t, idx) => {
html += `<tr data-idx="${idx}"><th>${t.from}<br>${t.to}</th>`;
days.forEach(day => {
html += `<td>${plan[day][idx] || ""}</td>`;
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


document.querySelectorAll("th[data-day]").forEach(th => th.classList.remove("col-day-current"));
document.querySelectorAll("tr[data-idx]").forEach(tr => tr.classList.remove("row-now"));


document.querySelectorAll(`th[data-day="${weekday}"]`).forEach(th => th.classList.add("col-day-current"));


let currentIdx = -1;
times.forEach((t,i)=>{ if(minutes >= hmToMinutes(t.from) && minutes < hmToMinutes(t.to)) currentIdx=i; });


if(currentIdx >= 0){
document.querySelectorAll(`tr[data-idx="${currentIdx}"]`).forEach(tr => tr.classList.add("row-now"));
document.getElementById("currentLesson").textContent = `Aktuell: ${times[currentIdx].from}-${times[currentIdx].to}`;
} else {
document.getElementById("currentLesson").textContent = "Aktuell: Keine laufende Stunde";
}
}


updateHighlights();
setInterval(updateHighlights, 30000);


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
