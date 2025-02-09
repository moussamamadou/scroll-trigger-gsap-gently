document.addEventListener('DOMContentLoaded', function () {

    gsap.registerPlugin(ScrollTrigger);
    const workSection = document.querySelector('[data-work="section"]');
    const workItems = document.querySelectorAll('[data-work="item"]');

    // Create ghost container and items for scroll tracking
    const ghostContainer = document.createElement('div');
    ghostContainer.className = 'ghost_work-container';
    workSection.appendChild(ghostContainer);

    const ghostItems = Array.from(workItems).map(() => {
      const ghostItem = document.createElement('div');
      ghostItem.className = 'ghost_work-item';
      ghostItem.style.cssText = 'width: 100%; height: 300vh;';
      ghostContainer.appendChild(ghostItem);
      return ghostItem;
    });

    // Initial setup for work items
    gsap.set(workItems, {
      position: 'fixed',
      top: '0',
      clipPath: 'inset(0 0% 0 100%)',
    });

    // Animation configurations
    const getBaseScrollTrigger = ghostItem => ({
      trigger: ghostItem,
      scrub: true,
      start: 'top bottom',
      end: '+200vh top',
    });

    const getImageInitialPosition = (index, imageIndex) => {
      const positions = {
        0: {
          scale: 0.8,
          y: index % 2 === 0 ? '175vh' : '-120vh',
          rotateZ: index % 2 === 0 ? '-5deg' : '5deg',
          zIndex: index % 2 === 0 ? '3' : '1',
        },
        1: {
          scale: 0.8,
          y: index % 2 === 0 ? '-225vh' : '300vh',
          zIndex: index % 2 === 0 ? '1' : '3',
          rotateZ: index % 2 === 0 ? '5deg' : '-5deg',
        },
        2: {
          scale: 0.8,
          y: index % 2 === 0 ? '300vh' : '-120vh',
          zIndex: index % 2 === 0 ? '3' : '3',
          rotateZ: index % 2 === 0 ? '5deg' : '5deg',
        },
        3: {
          scale: 0.8,
          y: index % 2 === 0 ? '-100vh' : '175vh',
          zIndex: index % 2 === 0 ? '1' : '1',
          rotateZ: index % 2 === 0 ? '-5deg' : '-5deg',
        },
      };
      return positions[imageIndex];
    };

    const getImageFinalPosition = (index, imageIndex) => ({
      scale: 1,
      y:
        index % 2 === 0
          ? imageIndex % 2 === 0
            ? '2vh'
            : '-2vh'
          : imageIndex % 2 === 0
            ? '-2vh'
            : '2vh',
      rotateZ:
        index % 2 === 0
          ? imageIndex % 2 === 0
            ? '2.5deg'
            : '-2.5deg'
          : imageIndex % 2 === 0
            ? '-2.5deg'
            : '2.5deg',
    });

    // Process each work item
    workItems.forEach((element, index) => {
      const lines = element.querySelectorAll('[data-line]');
      const itemBackground = element.querySelector('[data-work="item-background"]');
      const itemContainer = element.querySelector('[data-work="item-container"]');
      const itemOverlay = element.querySelectorAll('[data-work="item-overlay"]');
      const itemImages = gsap.utils.toArray(
        element.querySelectorAll('[data-work="item-image"]')
      );

      // Initial states
      gsap.set(itemBackground, { scale: 1.2 });
      gsap.set(itemContainer, { xPercent: 40 });

      // Base animations
      gsap.to(element, {
        clipPath: 'inset(0 0 0 0%)',
        scrollTrigger: getBaseScrollTrigger(ghostItems[index]),
      });
      gsap.to(itemContainer, {
        xPercent: 0,
        scrollTrigger: getBaseScrollTrigger(ghostItems[index]),
      });
      gsap.to(itemBackground, {
        scale: 1,
        scrollTrigger: getBaseScrollTrigger(ghostItems[index]),
      });
      
      // Text animations
      [0, 1].forEach(i => {
        gsap.set(lines[i], {
          zIndex: 2,
          opacity: 0.9,
        });
        gsap.from(lines[i], {
          opacity: i === 0 ? 0.95 : 0.5,
          yPercent: i === 0 ? 125 : -125,
          ease: 'power2.inOut',
          duration: 1.25,
          scrollTrigger: {
            trigger: ghostItems[index],
            scrub: true,
            start: '-25% top',
            end: '15% top',
            toggleActions: 'play reverse restart reverse',
          },
        });
      });

      // Image animations
      itemImages.forEach((image, imageIndex) => {
        gsap.set(image, getImageInitialPosition(index, imageIndex));
        gsap.to(image, {
          ...getImageFinalPosition(index, imageIndex),
          scrollTrigger: {
            trigger: ghostItems[index],
            scrub: true,
            start: '5% top',
            end: '50% top',
          },
        });
      });

      // Background and final animations
      gsap.to(itemBackground, {
        filter: 'brightness(0.2) blur(7.5px)',
        scrollTrigger: {
          trigger: ghostItems[index],
          scrub: true,
          start: '20% top',
          end: '55% top',
        },
      });

      gsap.to(element, {
        xPercent: index === workItems.length - 1 ? 0 : -40,
        yPercent: index === workItems.length - 1 ? -40 : 0,
        scrollTrigger: {
          trigger: ghostItems[index],
          scrub: true,
          start: '100% bottom',
          toggleActions: 'play reverse play reverse',
        },
      });

      gsap.to(itemOverlay, {
        opacity: 0.85,
        scrollTrigger: {
          trigger: ghostItems[index],
          scrub: true,
          start: '100% bottom',
          toggleActions: 'play reverse play reverse',
        },
      });
    });

    // Initialize smooth scrolling
    new Lenis({
      autoRaf: true,
      lerp: 0.05,
      wheelMultiplier: 0.7,
    });
  });