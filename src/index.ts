import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

window.Webflow ||= [];
window.Webflow.push(() => {
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

  gsap.set(navItems, { opacity: 0 });
  showNav.to(navMainMenu, { duration: 0, top: '0%', opacity: 0 });
  showNav.to(navMainMenu, { duration: 1, opacity: 1 });
  showNav.to(navItems, { opacity: 1, stagger: 0.05, duration: 0.3 }, '<.1');

  navMainMenu?.addEventListener('click', () => {
    isOpen = false;
    showNav.timeScale(1.75).reverse();
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

  // Set ScrollSmoother
  const scroller = ScrollSmoother.create({
    smooth: 0.75, // how long (in seconds) it takes to "catch up" to the native scroll position
    effects: true, // looks for data-speed and data-lag attributes on elements
    smoothTouch: 0.1, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
  });

  setupSplits();

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
  const pageHeroIntro = document.querySelector('.page-hero_intro') !== null;
  if (pageHeroIntro) {
    const tl_hero = gsap.timeline();
    tl_hero.from(pageHeroIntro, {
      opacity: 0,
      duration: 1.5,
    });
    tl_hero.from(
      '.page-hero_bg > .img_wrap',
      {
        opacity: 0,
        duration: 1,
      },
      '<0.5'
    );
  }
  // // Global Animations by Data Attributes
  // const elmsFadeTop = gsap.utils.toArray('[st-fade="top"]');
  // if (elmsFadeTop) {
  //   elmsFadeTop.forEach((el: any) => {
  //     const targetElement = el;
  //     const triggerElement = targetElement;
  //     gsap.to(targetElement, {
  //       opacity: 0.25,
  //       scrollTrigger: {
  //         trigger: triggerElement,
  //         scrub: true,
  //         start: 'top 10%',
  //         end: 'top top',
  //       },
  //     });
  //   });
  // }
  const elmsBorderRadius = gsap.utils.toArray('[st-borderradius]');
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
  // BLOG

  const teasers = gsap.utils.toArray('.teaser');
  if (teasers) {
    scroller.effects('.teaser_img', { lag: 0.05 });

    teasers.forEach((el: any) => {
      const blogImg = el.querySelector('.teaser_img');
      const blogSummary = el.querySelector('.blog-teaser_summary');
      const blogInfo = el.querySelector('.blog-teaser_info');
      if (blogSummary) {
        const summaryHeight = blogSummary.offsetHeight;
        gsap.set(blogSummary, { opacity: 0 });
        gsap.set(blogInfo, { top: summaryHeight });
      }

      const hover = gsap.timeline().pause();
      hover.to(blogImg, {
        duration: 0.5,
        ease: 'power1.out',
        scale: 1.2,
      });
      hover.to(blogInfo, { duration: 0.75, top: 0, ease: 'back.out' }, '<');
      if (blogSummary) {
        hover.to(blogSummary, { opacity: 1, ease: 'power1.out' }, '<.25');
      }
      el.addEventListener('mouseenter', () => hover.timeScale(1).play());
      el.addEventListener('mouseleave', () => hover.timeScale(1.75).reverse());
    });
  }

  // End: BLOG

  // Wait for it! :)
  window.addEventListener('load', function () {
    //setupSplits();
  });
}); // End: WF Push
