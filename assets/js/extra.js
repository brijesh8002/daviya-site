(function(){"use strict";
var rv=document.querySelectorAll('.rv,.dv-svc,.dv-diff li,.dv-day li,.dv-steps li,.dv-stat');
rv.forEach(function(e,i){if(!e.classList.contains('rv'))e.classList.add('rv');e.style.transitionDelay=(i%4)*90+'ms'});
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});document.querySelectorAll('.rv').forEach(function(e){io.observe(e)})}else document.querySelectorAll('.rv').forEach(function(e){e.classList.add('in')});
document.querySelectorAll('.dv-stat b').forEach(function(b){var t=b.textContent;if(t.indexOf('–')>-1)return;var m=t.match(/^\d+/);if(!m)return;var n=+m[0],r=t.slice(m[0].length),v=0;var o=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;o.disconnect();var k=setInterval(function(){v=Math.min(n,v+Math.ceil(n/30));b.textContent=v+r;if(v>=n)clearInterval(k)},35)});o.observe(b)});
})();
