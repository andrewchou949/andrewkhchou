import React, { useEffect, useState } from 'react';
import './BootLoader.css';

const BootLoader = () => {
  const [phase, setPhase] = useState<'visible' | 'leaving' | 'gone'>('visible');

  useEffect(() => {
    let exitTimer = 0;
    let goneTimer = 0;
    let fallbackTimer = 0;

    const finish = () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(fallbackTimer);
      setPhase('leaving');
      goneTimer = window.setTimeout(() => setPhase('gone'), 720);
    };

    const handleLoad = () => {
      exitTimer = window.setTimeout(finish, 520);
    };

    if (document.readyState === 'complete') {
      exitTimer = window.setTimeout(finish, 1250);
    } else {
      window.addEventListener('load', handleLoad, { once: true });
      fallbackTimer = window.setTimeout(finish, 2600);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
      window.clearTimeout(exitTimer);
      window.clearTimeout(goneTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  if (phase === 'gone') {
    return null;
  }

  return (
    <div className={`boot-loader ${phase === 'leaving' ? 'boot-loader-exit' : ''}`} role="status" aria-label="Loading portfolio">
      <div className="boot-loader-field" aria-hidden="true">
        <span className="boot-star boot-star-one"></span>
        <span className="boot-star boot-star-two"></span>
        <span className="boot-star boot-star-three"></span>
      </div>
      <div className="boot-loader-orbit" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span className="boot-loader-label">Andrew Chou</span>
    </div>
  );
};

export default BootLoader;
