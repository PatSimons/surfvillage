import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

import { convertDatesToDutchFormat } from '$utils/dutchdates';
import { reverseDomElms } from '$utils/helpers';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

window.Webflow ||= [];
window.Webflow.push(() => {
  // Set ScrollSmoother
  const scroller = ScrollSmoother.create({
    smooth: 0.75, // how long (in seconds) it takes to "catch up" to the native scroll position
    effects: true, // looks for data-speed and data-lag attributes on elements
    smoothTouch: 0.1, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
  });
  // NAV
  const navMenu = document.getElementById('menu');
  const openNav = document.getElementById('open_nav');
  //const closeNav = document.getElementById('close_nav');
  const navMainMenu = document.querySelector('.nav_mainmenu-wrap');
  const navMainMenuLinkWrap = navMainMenu.querySelector('.nav-main-wrap');
  const showNav = gsap.timeline().pause();
  const navItems = gsap.utils.toArray('.nav_mainmenu-wrap .nav_link-block');
  let isOpen = false;

  gsap.set(navMainMenuLinkWrap, { width: navMenu?.offsetWidth + 64 });

  // Dates to Dutch
  if (document.querySelector('[ts-el="date"]')) {
    convertDatesToDutchFormat('[ts-el="date"]');
  }

  function toggleNav() {
    if (isOpen) {
      isOpen = false;
      openNav?.addEventListener('click', () => {
        showNav.timeScale(1.75).reverse();
      });
    } else {
      isOpen = true;
      openNav?.addEventListener('click', () => {
        showNav.timeScale(1).play();
      });
    }
  }
  toggleNav();
  openNav?.addEventListener('click', toggleNav);

  gsap.set(navItems, { x: '6rem', opacity: 0 });
  showNav.to(navMainMenu, { duration: 0, top: '0%', opacity: 0 });
  showNav.to(navMainMenu, { duration: 0.5, opacity: 1 });
  showNav.to(navItems, { x: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'back.out' }, '<.1');

  navMainMenu?.addEventListener('click', () => {
    isOpen = false;
    showNav.timeScale(1.75).reverse();
  });

  // Helpers
  const reverseDomOrders = document.querySelectorAll('[ts-reversedom="true"]');
  reverseDomOrders.forEach((el: any) => {
    reverseDomElms(el);
  });
  // Function SpltTexts
  function setupSplits() {
    const targets = gsap.utils.toArray('[data-splittext="words"]');
    targets.forEach((target) => {
      const SplitClient = new SplitText(target, { type: 'words' });
      const { words } = SplitClient; //an array of all the divs that wrap each character
      gsap.from(words, {
        duration: 0.8,
        opacity: 0,
        y: '3rem',
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: target,
          start: 'top bottom',
          end: 'bottom 80%',
          scrub: true,
        }, // End: scrollTrigger
      }); // End: GSAP from
    }); // End: forEach
    const targetsFadeUp = gsap.utils.toArray('[data-splittext="chars"]');
    targetsFadeUp.forEach((targetFadeUp: any) => {
      const SplitClient = new SplitText(targetFadeUp, {
        type: 'chars',
        charsClass: 'herochars',
      });
      const { chars } = SplitClient; //an array of all the divs that wrap each character

      gsap.from(chars, {
        delay: 0.5,
        duration: 1,
        y: '200%',
        opacity: 0,
        ease: 'power4.out',
        stagger: 0.1,
      }); // End: GSAP from
      gsap.set(chars, { y: '0%' });
      chars.forEach((char, i) => {
        scroller.effects(char, { speed: 1.2, lag: (i + 1) * 0.15 });
      });
    }); // End: forEach
  } // End: setupSplitTexts

  if (document.querySelector('[data-splittext]')) {
    setupSplits();
  }
  // gsap.from('.nav_component', {
  //   opacity: 0,
  //   scrollTrigger: {
  //     trigger: '.nav-trigger',
  //     start: 'top bottom',
  //     ease: 'expo.out',
  //     scrub: true,
  //   },
  // });

  // Hero Timeline
  const pageHeroBG = document.querySelector('.page-hero_bg');
  if (pageHeroBG) {
    const pageHeroImg = pageHeroBG?.querySelector('.img_wrap');
    const tl_hero = gsap.timeline();
    gsap.set(pageHeroImg, { opacity: 0 });
    tl_hero.to(pageHeroImg, {
      opacity: 1,
      duration: 1,
    });
  }
  // Border Radius
  const elmsBorderRadius = gsap.utils.toArray('[ts-borderradius]');
  if (elmsBorderRadius) {
    elmsBorderRadius.forEach((el: any) => {
      const targetElement = el;
      const triggerElement = targetElement;
      gsap.from(targetElement, {
        width: '85%',
        borderRadius: '5rem',
        scrollTrigger: {
          trigger: triggerElement,
          start: 'top bottom',
          end: 'top 70%',
          ease: 'expo.in',
          scrub: true,
        },
      });
    });
  }
  // End: Border Radius

  // Activity Details -> Activity Template Page
  if (document.querySelector('.activity_item')) {
    const activityDetails: string[] = gsap.utils.toArray('.activity_item');
    ScrollTrigger.batch(activityDetails, {
      onEnter: (batch) => gsap.from(batch, { y: '50px', opacity: 0, duration: 1, stagger: 0.1 }),
    });
  }
  if (document.querySelector('.activity-teaser_container')) {
    // Teasers
    const activityTeasers: string[] = gsap.utils.toArray('.activity-teaser_container');
    //gsap.set(activityTeasers, { opacity: 0, y: '50px' });
    ScrollTrigger.batch(activityTeasers, {
      onEnter: (batch) => gsap.from(batch, { y: '50px', opacity: 0, duration: 1, stagger: 0.1 }),
    });

    const teasers = gsap.utils.toArray('.teaser');
    if (teasers) {
      teasers.forEach((el: any) => {
        const blogImg = el.querySelector('.teaser_img');
        const blogSummary = el.querySelector('.blog-teaser_summary');
        const blogInfo = el.querySelector('.blog-teaser_info');
        const teaserIcon = el.querySelector('.teaser_icon-wrap');
        const hover = gsap.timeline().pause();

        if (blogSummary) {
          const summaryHeight = blogSummary.offsetHeight;
          gsap.set(blogSummary, { opacity: 0 });
          gsap.set(blogInfo, { top: summaryHeight });
        }

        hover.to(blogImg, {
          duration: 0.5,
          ease: 'power1.out',
          scale: 1.05,
        });
        hover.to(blogInfo, { duration: 0.75, top: 0, ease: 'back.out' }, '<');
        if (blogSummary) {
          hover.to(blogSummary, { opacity: 1, ease: 'power1.out' }, '<.25');
        }
        if (teaserIcon) {
          hover.from(teaserIcon, { x: '-3rem', opacity: 0, duration: 0.5, ease: 'back.out' }, '<');
        }
        el.addEventListener('mouseenter', () => hover.timeScale(1).play());
        el.addEventListener('mouseleave', () => hover.timeScale(1.75).reverse());
      });
    }
  } // End if
  // End: Teasers

  // Marquees
  if (document.querySelector('[ts-el="marquee"]')) {
    const marquees = document.querySelectorAll('[ts-el="marquee"]');
    marquees.forEach((marquee: any) => {
      const marqueeType = marquee?.getAttribute('ts-marquee-type');
      const marqueeDirection = marquee?.getAttribute('ts-marquee-direction');
      if (!marquee) {
        return;
      }
      const duration = 100;
      const marqueeContent = marquee.firstChild;
      if (!marqueeContent) {
        return;
      }
      const marqueeContentClone = marqueeContent.cloneNode(true);
      marquee.append(marqueeContentClone);
      let tween: any;
      const progress = tween ? tween.progress() : 0;
      tween && tween.progress(0).kill();
      const width = parseInt(getComputedStyle(marqueeContent).getPropertyValue('width'), 10);
      const distanceToTranslate = -width / (marqueeType === 'scroll' ? 8 : 1);

      console.log(distanceToTranslate);
      let startPoint = 0;
      let endPoint = distanceToTranslate;
      if (marqueeDirection === 'right') {
        startPoint = distanceToTranslate;
        endPoint = 0;
      }
      if (marqueeType === 'scroll') {
        tween = gsap.fromTo(
          marquee.children,
          { x: startPoint },
          {
            x: endPoint,
            duration,
            scrollTrigger: {
              trigger: marquee,
              scrub: true,
              start: 'top bottom',
              end: 'bottom top',
            },
          }
        );
      }
      if (marqueeType === 'loop') {
        tween = gsap.fromTo(
          marquee.children,
          { x: startPoint },
          {
            x: endPoint,
            duration,
            repeat: -1,
          }
        );
      }
      tween.progress(progress);
    });
  } // End if
  // End: Marquees

  // Waves
  if (document.querySelector('[ts-el="wave"]')) {
    const waves = gsap.utils.toArray('[ts-el="wave"]');
    if (waves) {
      waves.forEach((wave: any) => {
        let waveDirection = wave.getAttribute('ts-wave-direction');

        if (wave && wave.parentNode && wave.parentNode.parentNode) {
          const grandparentElement = wave.parentNode.parentNode;
          const directionOverrule = grandparentElement.getAttribute('ts-child-direction-overrule');

          if (directionOverrule) {
            waveDirection = directionOverrule;
          }
        }
        const waveType = wave.getAttribute('ts-wave-type');
        let speedDivider = 1;
        if (wave.classList.contains('is-xsmall')) {
          speedDivider = 0.25;
        }
        if (wave.classList.contains('is-small')) {
          speedDivider = 0.5;
        }
        if (wave.classList.contains('is-wide')) {
          speedDivider = 2;
        }

        const targetElement = wave.firstChild;
        //console.log(wave.offsetWidth);
        let direction = '+';
        if (waveDirection === 'left') {
          direction = '-';
        }
        if (waveDirection === 'right') {
          direction = '+';
        }
        const triggerElement = targetElement;
        const tl = gsap.timeline();
        if (waveType === 'scroll') {
          tl.to(targetElement, {
            left: direction + wave.offsetWidth / 2,
            scrollTrigger: {
              trigger: triggerElement,
              scrub: 2,
              start: 'top bottom',
              end: 'bottom top',
            },
          });
        }
        if (waveType === 'loop') {
          tl.to(targetElement, {
            left: direction + wave.offsetWidth / 2 / speedDivider,
            duration: 5,
            ease: 'linear',
            repeat: -1,
          });
        }
      });
    }
  } // End if
  // End: Waves

  // Wait for it! :)
  window.addEventListener('load', function () {
    const pagefade = document.getElementsByClassName('pagefade');
    gsap.to(pagefade, { opacity: 0, duration: 0.3 });
  });
}); // End: WF Push
