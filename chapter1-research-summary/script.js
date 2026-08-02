const body=document.body;
const sidebar=document.getElementById('sidebar');
const overlay=document.getElementById('overlay');
const menuBtn=document.getElementById('menuBtn');
const closeBtn=document.getElementById('closeBtn');
const themeBtn=document.getElementById('themeBtn');
const navLinks=[...document.querySelectorAll('#navLinks a')];
const sections=[...document.querySelectorAll('main section[id]')];
const progressBar=document.getElementById('progressBar');
const progressText=document.getElementById('progressText');

function toggleMenu(open){sidebar.classList.toggle('open',open);overlay.classList.toggle('show',open)}
menuBtn.addEventListener('click',()=>toggleMenu(true));closeBtn.addEventListener('click',()=>toggleMenu(false));overlay.addEventListener('click',()=>toggleMenu(false));navLinks.forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));

themeBtn.addEventListener('click',()=>{body.classList.toggle('dark');localStorage.setItem('chapterTheme',body.classList.contains('dark')?'dark':'light')});
if(localStorage.getItem('chapterTheme')==='dark')body.classList.add('dark');

const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id))}})},{rootMargin:'-25% 0px -65% 0px'});sections.forEach(s=>observer.observe(s));

window.addEventListener('scroll',()=>{const h=document.documentElement;const p=Math.round((h.scrollTop/(h.scrollHeight-h.clientHeight))*100)||0;progressBar.style.width=p+'%';progressText.textContent=p+'%'});

document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));btn.classList.add('active');document.getElementById(btn.dataset.tab).classList.add('active')}));

document.querySelectorAll('.flashcard').forEach(card=>card.addEventListener('click',()=>card.classList.toggle('open')));

const searchDialog=document.getElementById('searchDialog');const searchInput=document.getElementById('searchInput');const searchResults=document.getElementById('searchResults');
document.getElementById('openSearch').addEventListener('click',()=>{searchDialog.showModal();setTimeout(()=>searchInput.focus(),50)});
const searchable=sections.map(s=>({id:s.id,title:s.querySelector('h2')?.textContent||'نظرة عامة',text:s.innerText.replace(/\s+/g,' ')}));
searchInput.addEventListener('input',()=>{const q=searchInput.value.trim().toLowerCase();if(!q){searchResults.innerHTML='<p>ابدأ بالكتابة لعرض النتائج.</p>';return}const matches=searchable.filter(x=>x.text.toLowerCase().includes(q));searchResults.innerHTML=matches.length?matches.map(x=>`<a href="#${x.id}" onclick="document.getElementById('searchDialog').close()"><strong>${x.title}</strong><small>انتقل إلى هذا القسم</small></a>`).join(''):'<p>لا توجد نتائج مطابقة.</p>'});

const quizDialog=document.getElementById('quizDialog');const quizContainer=document.getElementById('quizContainer');
const questions=[
 {q:'أي نوع من البحث يعتمد على البيانات الرقمية؟',a:['Qualitative','Quantitative','Action Research'],c:1},
 {q:'ما معنى Reliability؟',a:['الحصول على نتائج متقاربة عند التكرار','إمكانية تعميم النتائج','وضوح الهدف'],c:0},
 {q:'أي نوع يبدأ من نظرية ثم يختبرها؟',a:['Inductive','Deductive','Exploratory'],c:1},
 {q:'ما المبدأ الذي يعني Do No Harm؟',a:['Justice','Beneficence','Objectivity'],c:1},
 {q:'أي مفهوم أوسع؟',a:['Research Methods','Research Methodology'],c:1}
];
function renderQuiz(){quizContainer.innerHTML=questions.map((x,i)=>`<div class="quiz-question"><strong>${i+1}. ${x.q}</strong>${x.a.map((a,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${a}</label>`).join('')}</div>`).join('')+'<button class="primary-btn" id="submitQuiz" style="margin-top:18px">عرض النتيجة</button>';document.getElementById('submitQuiz').onclick=()=>{let score=0;questions.forEach((x,i)=>{const v=document.querySelector(`input[name=q${i}]:checked`);if(v&&Number(v.value)===x.c)score++});quizContainer.insertAdjacentHTML('beforeend',`<div class="quiz-score">نتيجتك: ${score} من ${questions.length}</div>`);document.getElementById('submitQuiz').disabled=true}}
document.getElementById('quizBtn').addEventListener('click',()=>{renderQuiz();quizDialog.showModal()});
