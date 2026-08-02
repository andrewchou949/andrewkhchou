import { useEffect } from 'react';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const mix = (a: number, b: number, amount: number) => a + (b - a) * amount;
const smooth = (value: number) => value * value * (3 - 2 * value);

const ticketSelector = [
  '.about-photo-bubble',
  '.about-content p',
  '.mystory-section',
  '.education-card',
  '.skills-section',
  '.job-card',
  '.project-card',
  '.contact-form'
].join(',');

const titleSelector = [
  '.about-content h1',
  '.mystory-title',
  '.section-title',
  '.project-title'
].join(',');

const clearMotionProperties = (element: HTMLElement) => {
  [
    '--motion-x',
    '--motion-y',
    '--motion-z',
    '--motion-rx',
    '--motion-ry',
    '--motion-rz',
    '--motion-scale',
    '--motion-opacity',
    '--motion-blur',
    '--motion-glow',
    '--title-x',
    '--title-y',
    '--title-skew',
    '--title-opacity',
    '--motion-index',
    '--wave-shift'
  ].forEach((property) => element.style.removeProperty(property));
  element.removeAttribute('data-motion-mode');
};

const getMotionMode = (ticket: HTMLElement) => {
  if (ticket.matches('.about-photo-bubble')) {
    return 'photo-bubble';
  }
  if (ticket.matches('.about-content p')) {
    return 'planet';
  }
  if (ticket.matches('.mystory-section')) {
    return 'vortex';
  }
  if (ticket.matches('.education-card')) {
    return 'wave';
  }
  if (ticket.matches('.skills-section')) {
    return 'bubble';
  }
  if (ticket.matches('.job-card')) {
    return 'orbit';
  }
  if (ticket.matches('.project-card')) {
    return 'vortex';
  }
  if (ticket.matches('.contact-form')) {
    return 'dock';
  }
  return 'signal';
};

const MotionDirector = () => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const tickets = Array.from(document.querySelectorAll<HTMLElement>(ticketSelector));
    const titles = Array.from(document.querySelectorAll<HTMLElement>(titleSelector));
    let frameId = 0;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    tickets.forEach((ticket, index) => {
      ticket.style.setProperty('--motion-index', index.toString());
      ticket.dataset.motionMode = getMotionMode(ticket);
    });

    const update = () => {
      frameId = 0;

      if (prefersReducedMotion.matches) {
        tickets.forEach((ticket) => {
          ticket.style.setProperty('--motion-x', '0vw');
          ticket.style.setProperty('--motion-y', '0vh');
          ticket.style.setProperty('--motion-z', '0px');
          ticket.style.setProperty('--motion-rx', '0deg');
          ticket.style.setProperty('--motion-ry', '0deg');
          ticket.style.setProperty('--motion-rz', '0deg');
          ticket.style.setProperty('--motion-scale', '1');
          ticket.style.setProperty('--motion-opacity', '1');
          ticket.style.setProperty('--motion-blur', '0px');
          ticket.style.setProperty('--motion-glow', '0.18');
        });
        titles.forEach((title) => {
          title.style.setProperty('--title-x', '0vw');
          title.style.setProperty('--title-y', '0vh');
          title.style.setProperty('--title-skew', '0deg');
          title.style.setProperty('--title-opacity', '1');
        });
        return;
      }

      const viewportHeight = Math.max(window.innerHeight, 1);
      const isMobile = window.innerWidth < 760;
      const currentScrollY = window.scrollY;
      scrollVelocity = scrollVelocity * 0.72 + clamp(currentScrollY - lastScrollY, -90, 90) * 0.28;
      lastScrollY = currentScrollY;

      tickets.forEach((ticket, index) => {
        const mode = ticket.dataset.motionMode || 'signal';
        const rect = ticket.getBoundingClientRect();
        const center = rect.top + rect.height * 0.5;
        const distance = (center - viewportHeight * 0.52) / viewportHeight;
        const progress = clamp((viewportHeight * 1.08 - rect.top) / (viewportHeight * 1.18 + rect.height), 0, 1);
        const readableDistance = Math.max(0, Math.abs(distance) - 0.1);
        const focus = clamp(1 - readableDistance * 1.18, 0, 1);
        const far = smooth(1 - focus);
        const side = index % 2 === 0 ? 1 : -1;
        const phase = (progress + index * 0.137) * Math.PI * 2;
        let x = 0;
        let y = 0;
        let z = 0;
        let rx = 0;
        let ry = 0;
        let rz = 0;
        let opacity = clamp(0.36 + focus * 0.78, 0.36, 1);
        let scale = 0.95 + focus * 0.05;

        if (mode === 'photo-bubble') {
          const drift = Math.sin(phase * 0.58);
          const float = Math.cos(phase * 0.72);
          const speedPush = clamp(scrollVelocity, -90, 90);

          x = -far * (isMobile ? 7.2 : 22) - distance * (isMobile ? 2.2 : 7.2) + drift * (isMobile ? 1.3 : 3.8);
          y = -distance * (isMobile ? 4.6 : 9.2) + float * (isMobile ? 1 : 2.7) + speedPush * (isMobile ? 0.012 : 0.024);
          z = -far * (isMobile ? 14 : 82);
          rx = float * (isMobile ? 1.8 : 5.2) - distance * (isMobile ? 0.8 : 2.4);
          ry = -far * (isMobile ? 5 : 26) + drift * (isMobile ? 2.2 : 7.2);
          rz = drift * (isMobile ? 1.8 : 5.5) - distance * (isMobile ? 0.9 : 2.8);
          opacity = clamp(0.14 + focus * 0.96, 0.14, 1);
          scale = 0.84 + focus * 0.16;
        } else if (mode === 'planet') {
          const radius = isMobile ? 5.2 : 22;
          const lift = isMobile ? 6 : 15;
          const planetAngle = phase * 0.72 + side * 0.6;
          const frontBias = clamp((Math.cos(planetAngle) + 1) * 0.5, 0, 1);

          x = Math.sin(planetAngle) * radius * far - distance * side * (isMobile ? 1.2 : 4.2);
          y = -distance * lift - far * (isMobile ? 2.5 : 6.5) + Math.cos(planetAngle) * (isMobile ? 1 : 3);
          z = -far * (isMobile ? 24 : 156) + frontBias * (isMobile ? 8 : 38);
          rx = -distance * (isMobile ? 0.8 : 2.6) + far * (isMobile ? 1.6 : 4.8);
          ry = Math.sin(planetAngle) * (isMobile ? 6 : 30);
          rz = Math.cos(planetAngle) * (isMobile ? 1.6 : 5.2);
          opacity = clamp(0.32 + focus * 0.78 + frontBias * 0.08, 0.32, 1);
          scale = 0.93 + focus * 0.055 + frontBias * 0.02;
        } else if (mode === 'vortex') {
          const vortex = phase * 1.72 + side * 0.75;
          const radius = (far * (isMobile ? 7 : 34)) + (1 - focus) * (isMobile ? 2 : 8);
          const pull = isMobile ? 6.4 : 13.5;
          const frontBias = clamp((Math.cos(vortex) + 1) * 0.5, 0, 1);

          x = Math.sin(vortex) * radius - distance * side * (isMobile ? 1.1 : 4.8);
          y = -distance * pull + Math.cos(vortex) * (isMobile ? 2.1 : 6.4);
          z = -far * (isMobile ? 28 : 184) + Math.cos(vortex) * far * (isMobile ? 12 : 72);
          rx = Math.sin(vortex * 0.8) * (isMobile ? 2.2 : 7.5) - distance * (isMobile ? 0.7 : 2.2);
          ry = Math.sin(vortex) * (isMobile ? 8 : 38);
          rz = Math.cos(vortex * 0.58) * (isMobile ? 2.5 : 9.5);
          opacity = clamp(0.3 + focus * 0.72 + frontBias * 0.12, 0.3, 1);
          scale = 0.92 + focus * 0.065 + frontBias * 0.015;
        } else if (mode === 'wave' || mode === 'bubble') {
          const wave = Math.sin(phase * (mode === 'bubble' ? 1.35 : 0.9));
          const speedPush = clamp(scrollVelocity, -90, 90);
          const bubbleLift = mode === 'bubble' ? Math.cos(phase * 1.4) * (isMobile ? 1.2 : 4.5) : 0;

          x = side * far * (isMobile ? 2.8 : 12) + wave * (isMobile ? 2.4 : 8.4);
          y = -distance * (isMobile ? 4.4 : 8.8) + bubbleLift + speedPush * (isMobile ? 0.018 : 0.036);
          z = -far * (isMobile ? 18 : 102);
          rx = wave * (isMobile ? 2.4 : 7.2) + speedPush * 0.018;
          ry = side * far * (isMobile ? 4 : 20) + Math.cos(phase) * (isMobile ? 2 : 7);
          rz = wave * (isMobile ? 1.4 : 4.8) + speedPush * 0.012;
          opacity = clamp(0.42 + focus * 0.7, 0.42, 1);
          scale = 0.94 + focus * 0.052 + (mode === 'bubble' ? Math.abs(wave) * 0.01 : 0);
        } else if (mode === 'spine' || mode === 'orbit') {
          const radius = isMobile ? 5.6 : mode === 'orbit' ? 24 : 30;
          const verticalPull = isMobile ? 5.5 : mode === 'orbit' ? 10 : 13;
          const orbitX = Math.sin(phase) * radius;
          const orbitZ = Math.cos(phase) * (isMobile ? 24 : mode === 'orbit' ? 165 : 210);
          const frontBias = clamp((Math.cos(phase) + 1) * 0.5, 0, 1);

          x = orbitX * (0.35 + far * 0.65) - distance * side * (isMobile ? 1.2 : 4.6);
          y = -distance * verticalPull + Math.sin(phase * 0.5) * (isMobile ? 0.8 : 2.4);
          z = -far * (isMobile ? 16 : 88) + orbitZ * far * 0.22;
          rx = far * (isMobile ? 2 : 5) - distance * (isMobile ? 0.8 : 2.4);
          ry = -Math.sin(phase) * (isMobile ? 5 : 26) + side * distance * (isMobile ? 1.5 : 5);
          rz = Math.sin(phase * 0.7) * (isMobile ? 1.2 : 4.8);
          opacity = clamp(0.34 + focus * 0.62 + frontBias * 0.18, 0.34, 1);
          scale = 0.94 + focus * 0.05 + frontBias * 0.02;
        } else if (mode === 'hinge') {
          const hingeSide = index % 2 === 0 ? -1 : 1;
          x = hingeSide * far * (isMobile ? 3.4 : 18) + Math.sin(phase) * (isMobile ? 0.8 : 3.5);
          y = -distance * (isMobile ? 4.8 : 10.5);
          z = -far * (isMobile ? 18 : 96);
          rx = -distance * (isMobile ? 0.8 : 2.8);
          ry = hingeSide * far * (isMobile ? 8 : 36);
          rz = hingeSide * far * (isMobile ? 1.2 : 4);
        } else if (mode === 'matrix') {
          x = Math.sin(phase * 0.8) * (isMobile ? 2.2 : 8) - distance * side * (isMobile ? 0.8 : 3);
          y = -distance * (isMobile ? 3.5 : 8) + far * (isMobile ? -2 : -5);
          z = -far * (isMobile ? 14 : 78);
          rx = far * (isMobile ? -2 : -8);
          ry = Math.sin(phase) * (isMobile ? 3 : 12);
          rz = Math.cos(phase * 0.7) * (isMobile ? 0.8 : 2.5);
          opacity = clamp(0.42 + focus * 0.74, 0.42, 1);
        } else if (mode === 'reel') {
          const lane = ((index % 3) - 1) * (isMobile ? 0.8 : 3.4);
          const reelTurn = Math.sin(phase * 0.65);
          x = side * far * (isMobile ? 3.2 : 11) + lane + reelTurn * (isMobile ? 0.9 : 3.8);
          y = -distance * (isMobile ? 4.8 : 9.8) + Math.cos(phase) * (isMobile ? 0.8 : 2.6);
          z = -far * (isMobile ? 20 : 130);
          rx = far * (isMobile ? 2.4 : 7.5);
          ry = side * far * (isMobile ? -7 : -34) + reelTurn * (isMobile ? 2 : 10);
          rz = side * (Math.cos(phase * 0.5) * (isMobile ? 1.2 : 4.2) + far * (isMobile ? 1 : 3.8));
          opacity = clamp(0.38 + focus * 0.72, 0.38, 1);
          scale = 0.94 + focus * 0.055;
        } else if (mode === 'dock') {
          x = Math.sin(phase) * (isMobile ? 0.8 : 2.6);
          y = -distance * (isMobile ? 2.6 : 5.8);
          z = -far * (isMobile ? 10 : 44);
          rx = far * (isMobile ? 1 : 2.8);
          ry = Math.sin(phase * 0.45) * (isMobile ? 1 : 4);
          rz = 0;
          opacity = clamp(0.52 + focus * 0.58, 0.52, 1);
        } else {
          const lane = ((index % 3) - 1) * (isMobile ? 1.2 : 3);
          const wave = Math.sin(phase);
          x = side * far * (isMobile ? 4.2 : 18) + lane + wave * (isMobile ? 1 : 3.4) - distance * side * (isMobile ? 1.8 : 5.8);
          y = -distance * (isMobile ? 5.4 : 12.5) + Math.cos((progress + index * 0.07) * Math.PI * 2) * (isMobile ? 0.8 : 2);
          z = -far * (isMobile ? 22 : 112);
          rx = far * (isMobile ? 2.5 : 6.2) - distance * (isMobile ? 1 : 3);
          ry = side * far * (isMobile ? -5 : -22) + distance * side * (isMobile ? 2 : 6.6);
          rz = side * far * (isMobile ? 1.8 : 5.2) - distance * (isMobile ? 1 : 3.4);
        }

        const readingHold = smooth(clamp((focus - 0.72) / 0.28, 0, 1));
        const motionDamping = isMobile ? 0.82 : 0.72;
        x *= motionDamping;
        y *= motionDamping;
        z *= isMobile ? 0.82 : 0.68;
        rx *= isMobile ? 0.78 : 0.62;
        ry *= isMobile ? 0.78 : 0.62;
        rz *= isMobile ? 0.78 : 0.62;

        x = mix(x, 0, readingHold * 0.78);
        y = mix(y, 0, readingHold * 0.82);
        z = mix(z, 0, readingHold * 0.86);
        rx = mix(rx, 0, readingHold * 0.88);
        ry = mix(ry, 0, readingHold * 0.9);
        rz = mix(rz, 0, readingHold * 0.9);
        scale = mix(scale, 1, readingHold * 0.94);
        opacity = mix(opacity, 1, readingHold * 0.86);
        ticket.style.setProperty('--motion-x', `${x.toFixed(3)}vw`);
        ticket.style.setProperty('--motion-y', `${y.toFixed(3)}vh`);
        ticket.style.setProperty('--motion-z', `${z.toFixed(1)}px`);
        ticket.style.setProperty('--motion-rx', `${rx.toFixed(3)}deg`);
        ticket.style.setProperty('--motion-ry', `${ry.toFixed(3)}deg`);
        ticket.style.setProperty('--motion-rz', `${rz.toFixed(3)}deg`);
        ticket.style.setProperty('--motion-scale', scale.toFixed(3));
        ticket.style.setProperty('--motion-opacity', opacity.toFixed(3));
        ticket.style.setProperty('--wave-shift', `${scrollVelocity.toFixed(3)}px`);
      });

      titles.forEach((title, index) => {
        const rect = title.getBoundingClientRect();
        const center = rect.top + rect.height * 0.5;
        const distance = (center - viewportHeight * 0.48) / viewportHeight;
        const focus = clamp(1 - Math.abs(distance) * 1.05, 0, 1);
        const side = index % 2 === 0 ? -1 : 1;

        title.style.setProperty('--title-x', `${(side * (1 - focus) * 6 - distance * 3.8).toFixed(3)}vw`);
        title.style.setProperty('--title-y', `${(-distance * 5.4).toFixed(3)}vh`);
        title.style.setProperty('--title-skew', `${(side * (1 - focus) * 2.6).toFixed(3)}deg`);
        title.style.setProperty('--title-opacity', clamp(0.28 + focus * 0.82, 0.28, 1).toFixed(3));
      });
    };

    const requestUpdate = () => {
      if (frameId === 0) {
        frameId = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    prefersReducedMotion.addEventListener('change', requestUpdate);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      prefersReducedMotion.removeEventListener('change', requestUpdate);
      [...tickets, ...titles].forEach(clearMotionProperties);
    };
  }, []);

  return null;
};

export default MotionDirector;
