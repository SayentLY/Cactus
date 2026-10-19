"use strict";
const menuData = {
  coffee: {label:"НАПОЇ / 01",title:"Кавова класика",subtitle:"Досконалі маленькі ритуали на щодень.",items:[["Еспресо","55"],["Допіо","70"],["Американо","55 / 70"],["Фільтр","65 / 75 / 90"],["Капучино","75 / 85 / 105"],["Лате","90 / 115"],["Флет вайт","90"],["Раф","95 / 110"],["Капуоранж","115 / 145"]]},
  other: {label:"НАПОЇ / 02",title:"Не кава",subtitle:"Коли хочеться чогось особливого.",items:[["Фреш","120"],["Какао","75 / 85"],["Флет Пуер","90"],["Матча лате","120"],["Матча оранж","150"],["Масала","120"]]},
  tea: {label:"НАПОЇ / 03",title:"Чай",subtitle:"Теплий момент у кожній чашці.",items:[["Пуер, габа, білий, червоний","80"],["Чорний, зелений, трав'яний","50"],["Фруктовий","70"]]},
  seasonal: {label:"НАПОЇ / 04",title:"Сезонне",subtitle:"Для настрою, який не хочеться відпускати.",items:[["Еспресо-тонік","105"],["Матча-тонік","135"],["Айс лате","105"],["Айс какао","105"],["Лимонад","85"],["Піна колада","110"],["Колд брю","100"]]},
  extras: {label:"ДОДАТКИ / 05",title:"Додай своє",subtitle:"Зроби улюблений напій ще більш своїм.",items:[["Молоко / безлактозне / рослинне",""],["Вершки",""],["Солона карамель / Сироп",""],["Кава без кофеїну",""]]}
};
function renderMenu(key){
 const menu=menuData[key];if(!menu)return;
 const panel=document.getElementById("menu-panel");
 document.querySelector(".tiny-label").textContent=menu.label;
 document.getElementById("menu-heading").textContent=menu.title;
 document.getElementById("menu-subtitle").textContent=menu.subtitle;
 const items=document.getElementById("menu-items");items.replaceChildren();
 menu.items.forEach(([name,price])=>{const row=document.createElement("div");row.className="menu-item";const n=document.createElement("span");n.textContent=name;const p=document.createElement("span");p.textContent=price?price+" ₴":"Уточнюйте ціну";row.append(n,p);items.append(row);});
 document.querySelectorAll(".menu-tab").forEach(tab=>{const active=tab.dataset.menu===key;tab.classList.toggle("active",active);tab.setAttribute("aria-selected",String(active));tab.tabIndex=active?0:-1;if(active){panel.setAttribute("aria-labelledby",tab.id)}});
 const note=document.querySelector(".menu-footnote");note.textContent=key==="extras"?"Додатки та їхню вартість уточнюйте у бариста.": "* Ціни в гривнях. Кілька значень — різні об'єми. Склад та актуальність уточнюйте у бариста.";
}
const tabs=[...document.querySelectorAll(".menu-tab")];tabs.forEach((tab,i)=>{tab.addEventListener("click",()=>renderMenu(tab.dataset.menu));tab.addEventListener("keydown",e=>{let next=i;if(e.key==="ArrowRight"||e.key==="ArrowDown")next=(i+1)%tabs.length;else if(e.key==="ArrowLeft"||e.key==="ArrowUp")next=(i+tabs.length-1)%tabs.length;else if(e.key==="Home")next=0;else if(e.key==="End")next=tabs.length-1;else return;e.preventDefault();tabs[next].focus();renderMenu(tabs[next].dataset.menu)})});
const menuToggle=document.querySelector(".menu-toggle");const mobileNav=document.getElementById("mobile-nav");
function closeMobile(){menuToggle.setAttribute("aria-expanded","false");menuToggle.setAttribute("aria-label","Відкрити меню");mobileNav.classList.remove("is-open");mobileNav.inert=true}
menuToggle.addEventListener("click",()=>{const opening=menuToggle.getAttribute("aria-expanded")!=="true";menuToggle.setAttribute("aria-expanded",String(opening));menuToggle.setAttribute("aria-label",opening?"Закрити меню":"Відкрити меню");mobileNav.classList.toggle("is-open",opening);mobileNav.inert=!opening});
mobileNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMobile));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMobile()});
document.addEventListener("click",e=>{if(!e.target.closest(".site-header")&&menuToggle.getAttribute("aria-expanded")==="true")closeMobile()});
document.documentElement.classList.add("js");
if("IntersectionObserver" in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}})},{threshold:.07,rootMargin:"0px 0px 40px 0px"});document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));}else{document.querySelectorAll(".reveal").forEach(el=>el.classList.add("is-visible"))}
document.getElementById("year").textContent=String(new Date().getFullYear());
function updateOpenStatus(){const el=document.getElementById("open-status");if(!el)return;try{const parts=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Kyiv",weekday:"short",hour:"2-digit",hourCycle:"h23",minute:"2-digit"}).formatToParts(new Date());const get=k=>parts.find(x=>x.type===k)?.value;const weekend=["Sat","Sun"].includes(get("weekday"));const hour=Number(get("hour"));const minute=Number(get("minute"));const open=weekend?9:8;const t=hour*60+minute;el.textContent=t>=open*60&&t<21*60?"● Зараз відкрито — до 21:00":t<open*60?"○ Зараз зачинено — відкриємось о "+String(open).padStart(2,"0")+":00":"○ Зараз зачинено — до зустрічі завтра";}catch{el.textContent=""}}
updateOpenStatus();setInterval(updateOpenStatus,60000);