const DAYS = ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag"];
const DAY_SHORT = {Montag:"Mo",Dienstag:"Di",Mittwoch:"Mi",Donnerstag:"Do",Freitag:"Fr"};
const SUBJECT_COLORS = {
  E:"#4c7ff0", B:"#7b61d1", D:"#ef6a61", M:"#efad35", Mu:"#e36b9a",
  Reli:"#8a69b8", O:"#27a56b", BK:"#e08b35", S:"#16a39a", Geo:"#4b9b72", Info:"#5966d9"
};
let data = null;
let selectedDay = null;

const $ = id => document.getElementById(id);

function minutes(hm){ const [h,m]=hm.split(":").map(Number); return h*60+m; }
function nowMinutes(){ const d=new Date(); return d.getHours()*60+d.getMinutes()+d.getSeconds()/60; }
function germanDate(d){
  return new Intl.DateTimeFormat("de-DE",{weekday:"long",day:"2-digit",month:"long",year:"numeric"}).format(d);
}
function currentDayName(){
  const d = new Date(), n = d.getDay();
  return n>=1 && n<=5 ? DAYS[n-1] : null;
}
function activePeriod(day){
  if(!data || !data.times) return null;
  const t=nowMinutes();
  return data.times.find(x => t>=minutes(x.start) && t<minutes(x.end))?.period ?? null;
}
function dayLessons(day){
  return data.schedule[day] || [];
}
function isCurrentLesson(day, period){
  return day===currentDayName() && activePeriod(day)===period;
}
function renderTabs(){
  const today=currentDayName();
  $("dayTabs").innerHTML = DAYS.map(day => `
    <button class="day-tab ${day===selectedDay?"active":""} ${day===today?"today":""}" data-day="${day}">
      ${DAY_SHORT[day]}<span>${day}</span>
    </button>`).join("");
  document.querySelectorAll(".day-tab").forEach(b => b.addEventListener("click",()=>{
    selectedDay=b.dataset.day; render();
  }));
}
function renderLessons(){
  const lessons=dayLessons(selectedDay);
  if(!lessons.length){
    $("lessons").innerHTML='<div class="empty">Für diesen Tag sind keine Stunden eingetragen.</div>';
    return;
  }
  const byPeriod = Object.fromEntries(data.times.map(t=>[t.period,t]));
  $("lessons").innerHTML=lessons.map(l=>{
    const t=byPeriod[l.period];
    const active=isCurrentLesson(selectedDay,l.period);
    const color=SUBJECT_COLORS[l.subject]||"#0b7a4b";
    return `<article class="lesson ${active?"active":""}" style="--subject-color:${color}">
      <div class="period">${l.period}</div>
      <div>
        <div class="subject-line">
          <span class="subject">${l.subject}</span>
          ${l.room?`<span class="room">Raum ${l.room}</span>`:""}
        </div>
        <div class="lesson-bar"></div>
      </div>
      <div class="time">${t.start}–${t.end}</div>
    </article>`;
  }).join("");
}
function updateLive(){
  const d=new Date();
  $("clock").textContent=d.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"});
  $("date").textContent=germanDate(d);
  const today=currentDayName();
  const p=today?activePeriod(today):null;
  if(today && p){
    const lesson=dayLessons(today).find(x=>x.period===p);
    $("statusPill").textContent=lesson ? `Jetzt: ${lesson.subject}` : `Jetzt: ${p}. Stunde`;
    $("statusPill").classList.add("live");
  }else{
    $("statusPill").textContent = today ? "Gerade keine Stunde" : "Wochenende";
    $("statusPill").classList.remove("live");
  }
  if(today && selectedDay===today) renderLessons();
}
function render(){
  renderTabs();
  const lessons=dayLessons(selectedDay);
  $("dayTitle").textContent=selectedDay;
  $("dayCount").textContent=`${lessons.length} ${lessons.length===1?"Stunde":"Stunden"}`;
  $("dayProgress").style.width=`${Math.min(100,lessons.length/6*100)}%`;
  renderLessons();
}
$("todayBtn").addEventListener("click",()=>{
  selectedDay=currentDayName()||"Montag"; render();
  window.scrollTo({top:0,behavior:"smooth"});
});
async function start(){
  data=await fetch("schedule.json").then(r=>r.json());
  selectedDay=currentDayName()||"Montag";
  render(); updateLive(); setInterval(updateLive,1000);
  if("serviceWorker" in navigator) navigator.serviceWorker.register("service-worker.js").catch(()=>{});
}
start().catch(err=>{
  $("lessons").innerHTML='<div class="empty">Der Stundenplan konnte nicht geladen werden.</div>';
  console.error(err);
});
