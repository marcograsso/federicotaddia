import "./styles/main.css";
import Alpine from "alpinejs";
import collapse from '@alpinejs/collapse'
import { gsap } from "gsap";
import Swup from 'swup';
const swup = new Swup();

window.Alpine = Alpine;
Alpine.plugin(collapse);
Alpine.start();

let images = [];
let root = null;
let incr = 0, oldIncr = 0, firstMove = true;
let resetDist = window.innerWidth / 17;
let indexImg = 0;

// === INIT FUNCTION TO RUN ON PAGE VIEW ===
function initMotionEffect() {
    images = [];
    root = document.querySelector('.mwg_effect021');

    if (!root) return;

    root.querySelectorAll('.medias img').forEach(image => {
        images.push(image.getAttribute('src'));
    });

    incr = 0;
    oldIncr = 0;
    firstMove = true;

    root.addEventListener("mousemove", e => {
        if (e.target.closest('.motion-button')) return;

        const val = e.clientX;

        if(firstMove) {
            firstMove = false;
            oldIncr = val;
            return;
        }

        incr += Math.abs(val - oldIncr);
        oldIncr = val;

        if(incr > resetDist) {
            incr = 0;
            createMedia(e.clientX, e.clientY - root.getBoundingClientRect().top);
        }
    });
}

function createMedia(x, y) {
    const image = document.createElement("img");
    image.setAttribute('src', images[indexImg]);

    root.appendChild(image);

    const tl = gsap.timeline({
        onComplete: () => {
            root.removeChild(image);
            tl && tl.kill();
        }
    });

    tl.fromTo(image, {
        x,
        y,
        yPercent:-50 + (Math.random() - 0.5) * 10,
        xPercent:-50 + (Math.random() - 0.5) * 80,
        rotation:(Math.random() - 0.5) * 20,
        scaleX: 1.3,
        scaleY: 1.3
    }, {
        scaleX:1,
        scaleY:1,
        ease: 'power4.out',
        duration: 0.6
    });
    tl.to(image, {
        duration: 0.8,
        scale: 0.5,
        delay: 0.3,
        ease:'back.in(1.7)'
    });

    indexImg = (indexImg + 1) % images.length;
}

function animateLetters(delay = 0) {
    gsap.to('.mwg_effect027 .letter', {
        delay,
        yPercent: 100,
        ease: 'power1.inOut',
        stagger: {
            each: 0.05,
            from: 'random'
        }
    });
}

function initCardRotationEffect() {
    const wrapper = document.getElementById('card-wrapper'); // area that tracks mouse
    const container = document.getElementById('card-rotation-container'); // parent that rotates

    if (!wrapper || !container) return;

    const cards = container.querySelectorAll('div[class*="card"]'); // adjust selector if needed

    // Apply CSS perspective
    wrapper.style.perspective = '1200px';
    container.style.transformStyle = 'preserve-3d';

    const rotX = gsap.quickTo(container, "rotationX", { duration: 0.5, ease: 'power2.out' });
    const rotY = gsap.quickTo(container, "rotationY", { duration: 0.5, ease: 'power2.out' });

    const cardTilt = Array.from(cards).map(card => ({
      el: card,
      rotX: gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" }),
      rotY: gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" })
    }));

    wrapper.addEventListener("mousemove", e => {
      const rect = wrapper.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      const percentX = (offsetX / rect.width - 0.5) * 1.5;
      const percentY = (offsetY / rect.height - 0.5) * 1.5;

      rotX(-percentY * 10);
      rotY(percentX * 20);

      cardTilt.forEach(({ rotX, rotY }) => {
        rotX(-percentY * 5);
        rotY(percentX * 5);
      });
    });

    wrapper.addEventListener("mouseleave", () => {
      rotX(0);
      rotY(0);
      cardTilt.forEach(({ rotX, rotY }) => {
        rotX(0);
        rotY(0);
      });
    });
  }

// FacetWP "load more" (replaces pagination on archive pages).
// Uses FacetWP's own load-more flags so results are appended instead of replaced.
// Listeners live on document, so they survive swup page swaps.
document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-load-more]');
    if (!btn || typeof FWP === 'undefined') return;

    btn.disabled = true;
    btn.classList.add('opacity-50');

    FWP.is_load_more = true;
    FWP.load_more_paged += 1;
    FWP.paged = FWP.load_more_paged;
    FWP.soft_refresh = true;
    FWP.refresh();
});

document.addEventListener('facetwp-loaded', () => {
    const wrap = document.querySelector('[data-load-more-wrap]');
    if (!wrap) return;

    const { page, total_pages } = FWP.settings.pager;
    wrap.hidden = page >= total_pages;

    const btn = wrap.querySelector('[data-load-more]');
    btn.disabled = false;
    btn.classList.remove('opacity-50');
});


window.addEventListener("DOMContentLoaded", () => {
    initMotionEffect();
    animateLetters();
    initCardRotationEffect();
});

swup.hooks.on('page:view', () => {
    initMotionEffect();
    animateLetters(2.2);
    initCardRotationEffect();

    // ✅ Reinitialize FWP
    if (typeof FWP !== 'undefined' && typeof FWP.init === 'function') {
        FWP.init();
    }
});
