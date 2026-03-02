setTimeout(()=>document.getElementById("splash").style.display="none",2000);

function toggleMenu(){
let s=document.getElementById("sidebar");
s.style.left=s.style.left==="0px"?"-250px":"0px";
}

function showPage(id){
document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
document.getElementById(id).classList.add("active");
toggleMenu();
}

function toggleTheme(){
document.body.classList.toggle("dark");
}

function clean(t){return t.split(" ")[0];}

async function loadPrayer(){
const res=await fetch("https://api.aladhan.com/v1/timingsByCity?city=Kuala Lumpur&country=Malaysia&method=3");
const data=await res.json();
const t=data.data.timings;

fajr.innerText=clean(t.Fajr);
dhuhr.innerText=clean(t.Dhuhr);
asr.innerText=clean(t.Asr);
maghrib.innerText=clean(t.Maghrib);
isha.innerText=clean(t.Isha);

gregorianDate.innerText=data.data.date.gregorian.date;
hijriDate.innerText=data.data.date.hijri.date+" AH";

highlight(t);
countdownFunc(t);
loadCalendar();
getQibla();
}

function highlight(t){
document.querySelectorAll(".card").forEach(c=>c.classList.remove("activePrayer"));
let now=new Date();
let cur=now.getHours()*60+now.getMinutes();
Object.entries(t).forEach(([n,time])=>{
let [h,m]=clean(time).split(":");
if(cur>=h*60+ +m){
let c=document.getElementById(n+"Card");
if(c)c.classList.add("activePrayer");
}
});
}

function countdownFunc(t){
setInterval(()=>{
let now=new Date();
let cur=now.getHours()*60+now.getMinutes();
for(let [n,time] of Object.entries(t)){
let [h,m]=clean(time).split(":");
let mins=h*60+ +m;
if(mins>cur){
let d=mins-cur;
countdown.innerText=`Next: ${n} in ${Math.floor(d/60)}h ${d%60}m`;
break;
}
}
},1000);
}

async function loadCalendar(){
const today=new Date();
const month=today.getMonth()+1;
const year=today.getFullYear();
const res=await fetch(`https://api.aladhan.com/v1/calendarByCity?city=Kuala Lumpur&country=Malaysia&method=3&month=${month}&year=${year}`);
const data=await res.json();
let html="<table>";
data.data.forEach(d=>{
html+=`<tr><td>${d.date.gregorian.date}</td><td>${d.date.hijri.date}</td></tr>`;
});
html+="</table>";
calendarTable.innerHTML=html;
}

function getQibla(){
navigator.geolocation.getCurrentPosition(pos=>{
let lat=pos.coords.latitude*Math.PI/180;
let lon=pos.coords.longitude*Math.PI/180;
let kaabaLat=21.4225*Math.PI/180;
let kaabaLon=39.8262*Math.PI/180;
let angle=Math.atan2(
Math.sin(kaabaLon-lon),
Math.cos(lat)*Math.tan(kaabaLat)-Math.sin(lat)*Math.cos(kaabaLon-lon)
);
angle=angle*180/Math.PI;
compass.style.transform=`rotate(${angle}deg)`;
qiblaAngle.innerText="Direction "+angle.toFixed(2)+"°";
});
}

if("serviceWorker" in navigator){
navigator.serviceWorker.register("service-worker.js");
}

loadPrayer();
