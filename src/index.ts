import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

import { convertDatesToDutchFormat } from '$utils/dutchdates';
import { reverseDomElms } from '$utils/helpers';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, Flip, InertiaPlugin);

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
import { Draggable } from 'gsap/Draggable';
gsap.registerPlugin(Draggable);

window.Webflow ||= [];
window.Webflow.push(() => {
  const drag = document.querySelector('[cs-el="draggable"]');
  const dragWrap = document.querySelector('[cs-el="draggable-wrap"]');
  const dragItems = gsap.utils.toArray('[cs-el="draggable-item"]');

  const dragWidth = drag?.clientWidth;
  const dragItemsLength = dragItems.length;

  console.log(dragWidth);
  console.log(dragItemsLength);

  if (drag) {
    Draggable.create(drag, {
      type: 'x',
      bounds: dragWrap,
      inertia: true,
      onDragEnd: function () {},
      snap: {
        x: gsap.utils.snap(dragWidth / dragItemsLength),
      },
    });
  }
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
      });
      // Dates to Dutch
      if (document.querySelector('[cs-el="date"]')) {
        convertDatesToDutchFormat('[cs-el="date"]');
      }
      // NAV
      const nav = document.querySelector('[cs-el="nav"]');
      if (nav) {
        const navType = nav.getAttribute('cs-nav-type');
        const openNav = nav.querySelector('[cs-el="open-nav"]');
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
              start: 'top+=' + windowHeight + ' 10%',
              end: 'top+=' + windowHeight + ' top',
              scrub: true,
            },
          });
        }
        function toggleNav() {
          if (isOpen) {
            isOpen = false;
            openNav?.addEventListener('click', () => {
              showNav.timeScale(1.75).reverse();
              smoother.paused(false);
            });
          } else {
            isOpen = true;
            openNav?.addEventListener('click', () => {
              smoother.paused(true);
              showNav.timeScale(1).play();
            });
          }
        }
        toggleNav();
        openNav?.addEventListener('click', toggleNav);

        gsap.set(navItems, { x: '6rem', opacity: 0 });
        showNav.to(navMainMenu, { duration: 0, top: '0dvh', opacity: 0 });
        showNav.to(navMainMenu, { duration: 0.5, opacity: 1 });
        showNav.to(
          navItems,
          { x: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'back.out' },
          '<.1'
        );

        navMainMenu?.addEventListener('click', () => {
          isOpen = false;
          showNav.timeScale(2.15).reverse();
        });
      }
      // End: NAV

      // Page Transition
      const mainWrapper = document.querySelector('.main-wrapper');
      const exitDurationMS = 350;
      const excludedClass = 'no-transition';
      $('a').on('click', function (e) {
        if (
          $(this).prop('hostname') == window.location.host &&
          $(this).attr('href').indexOf('#') === -1 &&
          !$(this).hasClass(excludedClass) &&
          $(this).attr('target') !== '_blank'
          // && transitionTrigger.length > 0
        ) {
          e.preventDefault();
          $('body').addClass('overflow-hidden');
          const transitionURL = $(this).attr('href');
          //transitionTrigger.click();
          gsap.to(mainWrapper, { opacity: 0, duration: 0.35 });
          setTimeout(function () {
            window.location = transitionURL;
          }, exitDurationMS);
        }
      });
      // On Back Button Tap
      window.onpageshow = function (event) {
        if (event.persisted) {
          window.location.reload();
        }
      };
      // End: Page Transition

      // End: On load triggers

      // Helpers
      const reverseDomOrders = document.querySelectorAll('[cs-reversedom="true"]');
      if (reverseDomElms) {
        reverseDomOrders.forEach((el: any) => {
          reverseDomElms(el);
        });
      }
      // Function SplitTexts
      const splitTexts = gsap.utils.toArray<HTMLElement>('[cs-el="splittext"]');
      if (splitTexts) {
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
      if (grids) {
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
      // End: grids

      // Teasers
      const teasers = gsap.utils.toArray('[cs-el="teaser"]');
      if (teasers) {
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

      function setup() {
        // On load triggers
        const onLoadTriggers = gsap.utils.toArray('[cs-t="onload"]');
        if (onLoadTriggers) {
          onLoadTriggers.forEach((el: any) => {
            gsap.from(el, { autoAlpha: 0, y: '1rem', duration: 0.75 });
          });
        }
        // Marquees
        const marquees = document.querySelectorAll<HTMLElement>('[cs-el="marquee"]');
        if (marquees) {
          marquees.forEach((marquee) => {
            const marqueeType = marquee?.getAttribute('cs-marquee-type');
            const marqueeDirection = marquee?.getAttribute('cs-marquee-direction');
            const duration = 100;
            const marqueeContent = marquee.querySelector('[cs-el="marquee-content"]');
            if (!marqueeContent) {
              console.log('No marquee content present!');
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
      } // End: setup()

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

      // Batch Fade-In
      const batchElms: string[] = gsap.utils.toArray('[cs-tr="batch-in"]');
      if (batchElms) {
        ScrollTrigger.batch(batchElms, {
          onEnter: (batch) => gsap.to(batch, { y: '0px', autoAlpha: 1, duration: 1, stagger: 0.1 }),
        });
      } // End: Batch Fade-In

      if (document.querySelector('[cs-tr="scroll-in"]')) {
        const scrollInElms: string[] = gsap.utils.toArray('[cs-tr="scroll-in"]');
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
      }

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
      // const faqs = document.querySelectorAll<HTMLElement>('[cs-el="faq"]');
      // if (faqs) {
      //   faqs.forEach((faq: any) => {
      //     const faqAnswer = faq.querySelector('[cs-el="faq-answer"]');
      //     const hover = gsap.timeline().pause();
      //     const answerHeight = faqAnswer.offsetHeight;
      //     gsap.set(faqAnswer, { opacity: 0 });
      //     hover.to(faq, { duration: 1 });
      //     hover.to(
      //       faqAnswer,
      //       {
      //         opacity: 1,
      //         ease: 'power1.out',
      //         duration: 1,
      //       },
      //       '<'
      //     );
      //     faq.addEventListener('mouseenter', () => hover.timeScale(1).play());
      //     faq.addEventListener('mouseleave', () => hover.timeScale(1.75).reverse());
      //   });
      // }
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

      // FS Img Test
      const fsItems = gsap.utils.toArray('[cs-el="fs-item"]');
      const fsWrap = document.querySelector('[cs-el="fs-wrap"]');
      let lastClickedItem: HTMLElement | null = null;

      if (!fsItems) return;
      if (!fsWrap) return;

      function putBack() {
        const fsContent = fsWrap.querySelector('[cs-el="fs-content"]');
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
        const fsContent = e.querySelector('[cs-el="fs-content"]');
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
        setup();
      });
      window.addEventListener('load', () => {
        setup();
      });
      return () => {};
    } // End: MM Context
  ); // End: Setup Match Media
}); // End: WF Push
