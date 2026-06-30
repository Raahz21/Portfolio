import { useEffect, useRef } from 'react';
import '../styles/loader.css';

export default function Loader() {
  const loaderRef = useRef(null);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    const loaderStartedAt = performance.now();
    const minimumLoaderTime = 1800;

    const handleLoad = () => {
      const elapsed = performance.now() - loaderStartedAt;
      const remaining = Math.max(0, minimumLoaderTime - elapsed);

      setTimeout(() => {
        loader.classList.add('collapsing');

        setTimeout(() => {
          document.body.classList.remove('is-loading');
          document.body.classList.add('loader-finished');
          loader.classList.add('hidden');

          setTimeout(() => {
            if (loader && loader.parentNode) {
              loader.remove();
            }
          }, 700);
        }, 1050);
      }, remaining);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <div className="site-loader" id="site-loader" ref={loaderRef} aria-label="Loading portfolio">
      <div className="loader-orbit">
        <span className="loader-line loader-line-one"></span>
        <span className="loader-line loader-line-two"></span>
        <span className="loader-line loader-line-three"></span>
        <div className="loader-mark">RZ</div>
      </div>
      <div className="loader-light-ball"></div>
    </div>
  );
}
