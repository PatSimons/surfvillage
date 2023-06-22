import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

import { greetUser } from '$utils/greet';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

window.Webflow ||= [];
window.Webflow.push(() => {
  const name = 'Jens en Loes';
  greetUser(name);

  ScrollSmoother.create({
    smooth: 1.5, // how long (in seconds) it takes to "catch up" to the native scroll position
    effects: true, // looks for data-speed and data-lag attributes on elements
    smoothTouch: 0.1, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
  });

  function setupSplits() {
    const targets = gsap.utils.toArray('[data-splittext="words"]');
    targets.forEach((target) => {
      const SplitClient = new SplitText(target, { type: 'words' });
      const { words } = SplitClient; //an array of all the divs that wrap each character
      gsap.from(words, {
        duration: 0.8,
        opacity: 0,
        y: '4rem',
        ease: 'none',
        stagger: 0.2,
        scrollTrigger: {
          trigger: target,
          start: 'top 95%',
          end: 'bottom 75%',
          scrub: true,
        }, // End: scrollTrigger
      }); // End: GSAP from
    }); // End: forEach
    const targetsFadeUp = gsap.utils.toArray('[data-splittext="chars"]');
    targetsFadeUp.forEach((targetFadeUp) => {
      const SplitClient = new SplitText(targetFadeUp, { type: 'chars' });
      const { chars } = SplitClient; //an array of all the divs that wrap each character
      gsap.from(chars, {
        delay: 1,
        duration: 1,
        y: '200%',
        ease: 'power4.out',
        stagger: 0.1,
      }); // End: GSAP from
    }); // End: forEach
  } // End: setupSplitTexts

  gsap.from('.nav_component', {
    opacity: 0,
    scrollTrigger: {
      trigger: '.nav-trigger',
      start: 'top bottom',
      ease: 'expo.out',
      scrub: true,
    },
  });
  setupSplits();
  gsap.from('.introtemp', {
    opacity: 0,
    duration: 1,
    delay: 2,
  });
  gsap.from('[st-borderradius]', {
    width: '85%',
    borderRadius: '5rem',
    scrollTrigger: {
      trigger: '[st-borderradius]',
      start: 'top bottom',
      end: 'top 70%',
      ease: 'expo.in',
      scrub: true,
    },
  });
});
