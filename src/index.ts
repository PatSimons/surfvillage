import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Flip } from 'gsap/Flip';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

import { convertDatesToDutchFormat } from '$utils/dutchdates';
import { reverseDomElms } from '$utils/helpers';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, Flip, InertiaPlugin, Draggable);

// const chromeAgent =
//   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
// if (navigator.userAgent === chromeAgent) {
//   console.log('me');
// }
// const isStaging = window.location.origin.includes('webflow.io');
// const script = document.createElement('script');
// script.src = isStaging
//   ? 'http://localhost:3000/index.js'
//   : 'https://cdn.jsdelivr.net/gh/PatSimons/surfvillage/dist/index.js';
// script.defer = true;
// document.currentScript?.insertAdjacentElement('afterend', script);

//// Functions
// Function - Draggable Slider
function initDraggable(el: any) {
  const draggable = el.querySelector('[cs-tr="draggable"]');
  const dragContent = el.querySelector('[cs-tr="drag-content"]');
  const dragItems = el.querySelectorAll('[cs-tr="draggable-item"]');
  const dragItemGap = 32; // 2rem set in WF
  const dragItemWidth = 240; // 15rem set in WF

  const dragVarsStretch = draggable.getAttribute('cs-draggable-stretch');
  const dragWidth = dragContent?.offsetWidth;
  const dragWrapWidth = draggable?.offsetWidth;
  const dragTotalItems = dragItems.length;
  const dragTotalGaps = dragTotalItems - 1;
  const dragSnap = (dragWidth - dragTotalGaps * dragItemGap) / dragTotalItems + dragItemGap;
  if (dragVarsStretch === 'stretch') {
    const isWider =
      dragWrapWidth >= dragTotalItems * dragItemWidth + dragTotalGaps * dragItemGap ? true : false;
    if (isWider) {
      dragItems.forEach((item: any) => {
        item.style.width = (dragWrapWidth - dragTotalGaps * dragItemGap) / dragTotalItems + 'px';
      });
    }
  }
  if (dragContent) {
    Draggable.create(dragContent, {
      type: 'x',
      bounds: draggable,
      inertia: true,
      onDragEnd: function () {},
      snap: {
        //        x: gsap.utils.snap(dragWidth / dragItemsLength - dragItemGap / 5),
        x: gsap.utils.snap(dragSnap),
      },
    });
  }
} // End: Function - Draggable Slider

//// End: Functions

window.Webflow ||= [];
window.Webflow.push(() => {
  // Setup Match Media
  const mm = gsap.matchMedia(),
    breakPoint = 800;

  mm.add(
    {
      isDesktop: `(min-width: ${breakPoint}px)`,
      isMobile: `(max-width: ${breakPoint - 1}px)`,
      reduceMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { isDesktop, isMobile, reduceMotion } = context.conditions;
      console.log(reduceMotion ? 'reducedMotion' : isMobile ? 'isMobile' : 'isDesktop');

      // Set ScrollSmoother
      const smoother = ScrollSmoother.create({
        smooth: 0.75, // how long (in seconds) it takes to "catch up" to the native scroll position
        effects: true, // looks for data-speed and data-lag attributes on elements
        smoothTouch: 0, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
      }); // End: Set ScrollSmoother

      // Dates to Dutch
      if (document.querySelector('[cs-el="date"]')) {
        convertDatesToDutchFormat('[cs-el="date"]');
      } // End: Dates to Dutch

      // Helpers
      const reverseDomOrders = document.querySelectorAll('[cs-reversedom="true"]');
      if (reverseDomElms) {
        reverseDomOrders.forEach((el: any) => {
          reverseDomElms(el);
        });
      } // End: Helpers

      // NAV
      const nav = document.querySelector('[cs-el="nav"]');
      if (nav) {
        const navType = nav.getAttribute('cs-nav-type');
        const openNav = nav.querySelector('[cs-el="open-nav"]');
        const navMenu = nav.querySelector('[cs-el="nav-menu"]');
        const navMainMenu = nav.querySelector('[cs-el="nav-main-menu"]');
        const showNav = gsap.timeline().pause();
        const navItems = gsap.utils.toArray('.nav_mainmenu-wrap .nav_link-block');

        let isOpen = false;
        if (navType === 'fade-in') {
          const windowHeight = window.innerHeight;
          gsap.set(nav, { opacity: 0 });
          gsap.to(nav, {
            opacity: 1,
            scrollTrigger: {
              markers: false,
              trigger: nav,
              start: 'top+=' + windowHeight + ' 35%',
              end: 'top+=' + windowHeight + ' 15%',
              scrub: true,
            },
          });
        }
        function closeNavOnClick() {
          showNav.timeScale(1.75).reverse();
          smoother.paused(false);
        }

        function openNavOnClick() {
          smoother.paused(true);
          showNav.timeScale(1).play();
        }

        function toggleNav() {
          console.log(isOpen);
          if (!isOpen) {
            closeNavOnClick();
          } else {
            openNavOnClick();
          }

          isOpen = !isOpen; // Toggle isOpen between true and false
          openNav?.removeEventListener('click', toggleNav);
          openNav?.addEventListener('click', toggleNav);
        }

        toggleNav();
        navMainMenu?.addEventListener('click', toggleNav);

        gsap.set(navItems, { x: '6rem', opacity: 0 });
        showNav.to(navMainMenu, { duration: 0, top: '0%', opacity: 0 });
        showNav.to(navMainMenu, { duration: 0.5, opacity: 1 });
        showNav.to(
          navItems,
          { x: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'back.out' },
          '<.1'
        );
      } // End: NAV
      // NAV Mobile FadeIn/Out
      if (isMobile) {
        const showAnim = gsap
          .from(nav, {
            yPercent: -100,
            paused: true,
            duration: 0.5,
            ease: 'Power1.out',
          })
          .progress(1);

        ScrollTrigger.create({
          start: 'top top',
          end: 99999,
          onUpdate: (self) => {
            self.direction === -1 ? showAnim.play() : showAnim.reverse();
          },
        });
      }
      // End: NAV Mobile FadeIn/Out

      // Page Transition
      const mainWrapper = document.querySelector<HTMLElement>('.main-wrapper');
      const exitDurationMS = 350;
      const excludedClass = 'no-transition';

      document.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', (e) => {
          const { hostname } = link;
          const href = link.getAttribute('href');
          const target = link.getAttribute('target');

          if (
            hostname === window.location.host &&
            href &&
            href.indexOf('#') === -1 &&
            !link.classList.contains(excludedClass) &&
            target !== '_blank'
            // && transitionTrigger.length > 0
          ) {
            e.preventDefault();
            document.body.classList.add('overflow-hidden');
            const transitionURL = href;
            // transitionTrigger.click();
            gsap.to(mainWrapper, { opacity: 0, duration: 0.35 });
            setTimeout(() => {
              window.location.href = transitionURL;
            }, exitDurationMS);
          }
        });
      });

      // On Back Button Tap
      window.onpageshow = (event) => {
        if (event.persisted) {
          window.location.reload();
        }
      };
      // End: Page Transition
      // Page - on Load
      const onLoadElms = document.querySelectorAll('[cs-tr="onload"]');
      if (onLoadElms.length > 0) {
        gsap.from(onLoadElms, {
          autoAlpha: 0,
          duration: 0.2,
          stagger: 0.3,
          y: '10px',
          ease: 'power1.out',
        });
      }
      // End: page - on Load

      // Draggable Sliders
      const draggables = document.querySelectorAll('[cs-tr="draggable"]');
      if (draggables.length > 0) {
        //draggables.forEach((draggable: any) => {
        const doc = document;
        initDraggable(doc);
        //});
      } // End: Draggable Sliders

      // Function SplitTexts
      const splitTexts = gsap.utils.toArray<HTMLElement>('[cs-el="splittext"]');
      if (splitTexts.length > 0) {
        splitTexts.forEach((el) => {
          gsap.set(el, { autoAlpha: 0.15 });

          const splitTextType = el.getAttribute('cs-splittext-type');
          if (splitTextType === 'words') {
            const SplitClient = new SplitText(el, { type: 'words' });
            const { words } = SplitClient; //an array of all the divs that wrap each character
            gsap.set(words, { opacity: 0, y: '3rem' });
            gsap.to(words, {
              duration: 0.8,
              opacity: 1,
              y: '0',
              ease: 'power3.out',
              stagger: 0.2,
              scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom 80%',
                scrub: true,
              }, // End: scrollTrigger
            }); // End: GSAP to
          } // End: if (splitTextType === 'chars')
          if (splitTextType === 'chars') {
            const SplitClient = new SplitText(el, {
              type: 'chars',
              charsClass: 'herochars',
            });
            const { chars } = SplitClient; //an array of all the divs that wrap each character
            gsap.set(chars, { opacity: 0, duration: 0, y: '0rem' });
            chars.forEach((char, i) => {
              smoother.effects(char, { speed: 1.2, lag: (i + 1) * 0.15 });
            });

            gsap.to(chars, {
              delay: 0.5,
              duration: 1,
              y: 0,
              opacity: 1,
              ease: 'power4.out',
              stagger: 0.1,
            }); // End: GSAP from
          } // End: if (splitTextType === 'chars')
        }); // End: forEach
      } // End: If (splitTexts)

      // Grids
      const grids = document.querySelectorAll<HTMLElement>('[cs-el="grid"]');
      if (grids.length > 0) {
        grids.forEach((el) => {
          const countChildren = el.children.length;
          if (countChildren === 1) {
            el.classList.add('is-one');
          }
          if (countChildren === 2) {
            el.classList.add('is-two');
          }
        });
      }
      // End: Grids

      // Teasers
      const teasers = gsap.utils.toArray('[cs-el="teaser"]');
      if (teasers.length > 0) {
        teasers.forEach((el: any) => {
          const teaserImg = el.querySelector('[cs-el="teaser-img"]');
          const teaserSummary = el.querySelector('[cs-el="teaser-summary"]');
          const teaserInfo = el.querySelector('[cs-el="teaser-info-wrap"]');
          const teaserIcon = el.querySelector('[cs-el="teaser-icon"]');
          const hover = gsap.timeline().pause();
          const teaserBG = el.querySelector('[cs-el="teaser-bg"]');

          if (teaserSummary) {
            const summaryHeight = teaserSummary.offsetHeight;
            gsap.set(teaserSummary, { opacity: 0 });
            gsap.set(teaserInfo, { top: summaryHeight });
          }

          hover.to(teaserImg, {
            duration: 0.5,
            ease: 'power1.out',
            scale: 1.05,
          });
          hover.to(teaserInfo, { duration: 0.75, top: 0, ease: 'back.out' }, '<');
          if (teaserBG) {
            hover.to(teaserBG, { opacity: 0.85, duration: 0.75 }, '<');
          }
          if (teaserSummary) {
            hover.to(teaserSummary, { opacity: 1, ease: 'power1.out' }, '<.25');
          }
          if (teaserIcon) {
            hover.from(
              teaserIcon,
              { x: '-3rem', opacity: 0, duration: 0.5, ease: 'back.out' },
              '<'
            );
          }
          el.addEventListener('mouseenter', () => hover.timeScale(1).play());
          el.addEventListener('mouseleave', () => hover.timeScale(1.75).reverse());
        });
      } // End: if (teasers)
      // End: Teasers

      // Hero Timeline
      const pageHeroBG = document.querySelector('[cs-el="hero"]');
      if (pageHeroBG) {
        //console.log('gherohere');
        const pageHeroImg = pageHeroBG?.querySelector('[cs-el="hero-img"]');
        gsap.to(pageHeroImg, {
          autoAlpha: 1,
          duration: 1,
        });
      }
      // End: hero Timeline

      // Marquees
      const marquees = document.querySelectorAll<HTMLElement>('[cs-el="marquee"]');
      if (marquees.length > 0) {
        marquees.forEach((marquee) => {
          const marqueeType = marquee?.getAttribute('cs-marquee-type');
          const marqueeDirection = marquee?.getAttribute('cs-marquee-direction');
          const marqueeDrag = marquee?.getAttribute('cs-marquee-nodrag');
          const duration = 100;
          const marqueeContent = marquee.querySelector('[cs-el="marquee-content"]');
          if (!marqueeContent) {
            console.log('No marquee content present!');
            return;
          }
          if (!marqueeDrag && isMobile) {
            console.log('drag');
            Draggable.create(marqueeContent, {
              type: 'x',
              bounds: marquee,
              inertia: true,
            });
            return;
          }
          const marqueeContentClone = marqueeContent.cloneNode(true);
          marquee.append(marqueeContentClone);

          let tween: any;
          const progress = tween ? tween.progress() : 0;
          tween && tween.progress(0).kill();
          const width = parseInt(getComputedStyle(marqueeContent).getPropertyValue('width'), 10);
          const distanceToTranslate = -width / (marqueeType === 'scroll' ? 8 : 1);

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
                  trigger: marqueeContent,
                  scrub: true,
                  start: 'top bottom',
                  end: 'bottom top',
                  invalidateOnRefresh: true,
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
      } // End: Marquees

      function setup() {} // End: setup()

      // Border Radius
      const elmsBorderRadius = gsap.utils.toArray('[cs-borderradius]');
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
              invalidateOnRefresh: true,
            },
          });
        });
      }
      // End: Border Radius
      // Blog Category Toggle Reset Button
      // const catFiltersWrap = document.querySelector('.blog-category-tags-wrap');
      // if (catFiltersWrap) {
      //   const catFilters = catFiltersWrap.querySelectorAll('.filter_checkbox');
      //   console.log('!!' + catFilters.length);
      // }
      // End: Blog Category Toggle Reset Button
      // Blog Category Filter String Replace
      const filterCatLink = document.querySelector(
        '[cs-el="filter-cat-link"]'
      ) as HTMLAnchorElement;
      if (filterCatLink) {
        const href = filterCatLink.getAttribute('href');
        if (href) {
          const newhref = href.replace(/&/g, '%26').replace(/ /g, '+');
          filterCatLink.setAttribute('href', newhref);
        }
      }
      // End: Blog Category Filter String Replace

      // Scrolltrigger - Batch Fade-In
      const batchElms: string[] = gsap.utils.toArray('[cs-st="batch-in"]');
      if (batchElms) {
        ScrollTrigger.batch(batchElms, {
          onEnter: (batch) => gsap.to(batch, { y: '0px', autoAlpha: 1, duration: 1, stagger: 0.1 }),
        });
      } // End: Scrolltrigger - Batch Fade-In
      // Scrolltrigger - On Enter
      if (document.querySelector('[cs-st="enter"]')) {
        const scrollInElms: string[] = gsap.utils.toArray('[cs-st="enter"]');
        scrollInElms.forEach((el: any) => {
          gsap.from(el, {
            opacity: 0,
            y: '50px',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom 90%',
              scrub: true,
              markers: false,
              invalidateOnRefresh: true,
            },
          });
        });
      } // End: Scrolltrigger - On Enter

      // Waves
      const waves = document.querySelectorAll('[cs-el="wave"]');
      if (waves) {
        waves.forEach((wave: any) => {
          let waveDirection = wave.getAttribute('cs-wave-direction');

          if (wave && wave.parentNode && wave.parentNode.parentNode) {
            const grandparentElement = wave.parentNode.parentNode;
            const directionOverrule = grandparentElement.getAttribute(
              'cs-child-direction-overrule'
            );

            if (directionOverrule) {
              waveDirection = directionOverrule;
            }
          }
          const waveType = wave.getAttribute('cs-wave-type');
          let speedDivider = 1;
          if (wave.classList.contains('is-small')) {
            speedDivider = 0.5;
          }
          if (wave.classList.contains('is-large')) {
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
                invalidateOnRefresh: true,
              },
            });
          }
          if (waveType === 'loop') {
            console.log(wave.firstChild.offsetWidth);
            tl.to(targetElement, {
              left: direction + '50%',
              duration: 5,
              ease: 'linear',
              yoyo: true,
              repeat: -1,
            });
          }
        });
      } // End if
      // End: Waves

      // FAQs
      const faqs = document.querySelectorAll<HTMLElement>('[cs-el="faq"]');
      if (faqs) {
        faqs.forEach((faq) => {
          const faqAnswer = faq.querySelector<HTMLElement>('[cs-el="faq-answer"]');
          const faqIcon = faq.querySelector<HTMLElement>('[cs-el="faq-icon"]');
          const hover = gsap.timeline({ paused: true });
          const close = gsap.timeline({ paused: true });
          const answerHeight = faqAnswer?.clientHeight ?? 0;
          console.log(answerHeight);
          gsap.set(faqAnswer, { height: 0 });
          hover.to(faqIcon, { rotate: '45' });
          hover.to(
            faqAnswer,
            {
              opacity: 1,
              height: answerHeight,
              ease: 'power1.out',
              marginBottom: '1rem',
              duration: 0.5,
            },
            '<'
          );
          close.to('.is-open', {
            opacity: 0,
            height: answerHeight,
            ease: 'power1.out',
            marginBottom: '0rem',
            duration: 0.1,
          });
          let isOpen = false;

          faq.addEventListener('click', () => {
            if (isOpen) {
              isOpen = false;
              hover.timeScale(1.5).reverse();
            } else {
              isOpen = true;
              close.play();
              hover.timeScale(1).play();
            }
          });
        });
      }
      // End: FAQs

      // Stamp
      const stamp = document.querySelector('[cs-el="stamp"]');
      if (stamp) {
        gsap.to(stamp, {
          scrollTrigger: {
            trigger: '#page-wrapper',
            scrub: 1,
            start: 'top bottom',
            end: '+=5000',
            invalidateOnRefresh: true,
          },
          rotation: 1440,
          duration: 3,
          ease: 'none',
        });
      }
      // Activity Testionials

      // Slider
      const sliders = document.querySelectorAll('[cs-el="slider"]');
      if (sliders) {
        sliders.forEach((slide: any) => {
          const slides = slide.querySelectorAll('[cs-el="slide"]');
          if (slides) {
            const slidesCount = slides.length;
            if (slidesCount > 1) {
              //console.log(slidesCount);
              let count = 0;
              const fadeTime = 1.5;
              const turnTime = 7;

              gsap.set(slides, { opacity: 0 });
              gsap.set(slides[0], { opacity: 1 });

              function fadeIt() {
                gsap.to(slides[count], { duration: fadeTime / 3, opacity: 0 });
                count = count < slides.length - 1 ? ++count : 0;
                gsap.fromTo(slides[count], { opacity: 0 }, { duration: fadeTime, opacity: 1 });
                gsap.to({}, { duration: turnTime, onComplete: fadeIt });
              }
              gsap.delayedCall(turnTime, () => fadeIt());
            }
          }
        });
      }
      // End: Slider
      // End: Activity Testionials

      // FS Img Test - Trigger
      const fsItems = gsap.utils.toArray('[cs-tr="fs-item"]');
      const fsWrap = document.querySelector('[cs-el="fs-wrap"]');
      let lastClickedItem: HTMLElement | null = null;

      if (fsItems.length === 0) return;
      if (!fsWrap) return;

      function putBack() {
        const fsContent = fsWrap.querySelector('[cs-tr="fs-content"]');
        const state = Flip.getState(fsContent);
        lastClickedItem?.appendChild(fsContent);

        Flip.from(state, {
          duration: 0.2,
          ease: 'sine.in',
          absolute: true,
          onComplete: () => {
            gsap.to(fsWrap, { autoAlpha: 0, duration: 0.2 });
          },
        });
        lastClickedItem = null;
      }

      function goFullScreen(e) {
        const fsContent = e.querySelector('[cs-tr="fs-content"]');
        gsap.to(fsWrap, { autoAlpha: 1, duration: 0.4 });
        const state = Flip.getState(fsContent);
        fsWrap.appendChild(fsContent);

        Flip.from(state, {
          duration: 0.4,
          ease: 'sine.out',
          absolute: true,
        });

        lastClickedItem = e;
      }

      fsItems.forEach((fsItem) => {
        fsItem.addEventListener('click', (e) => {
          const content = e.currentTarget as HTMLElement;
          if (lastClickedItem) {
            putBack();
            // Put back comes here
          }
          goFullScreen(content);
        });
      });

      fsWrap.addEventListener('click', () => {
        if (!lastClickedItem) return;
        putBack();
      });

      // End: FS Img test

      window.addEventListener('resize', () => {
        const doc = document;
        initDraggable(doc);
        setup();
      });
      window.addEventListener('load', () => {
        setup();
      });
      return () => {};
    } // End: MM Context
  ); // End: Setup Match Media
}); // End: WF Push
