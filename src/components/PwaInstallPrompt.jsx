import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share2, PlusSquare } from 'lucide-react';
import './PwaInstallPrompt.css';

const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  useEffect(() => {
    // Check if dismissed before
    const isDismissed = localStorage.getItem('moviehub_pwa_dismissed');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

    if (isStandalone) {
      return; // Already running as installed app!
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Listen for beforeinstallprompt (Android / Chrome / Desktop)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If iOS and not dismissed and on mobile screen, show prompt after 3s
    if (isIosDevice && !isDismissed && window.innerWidth <= 768) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIosInstructions(false);
    localStorage.setItem('moviehub_pwa_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <aside className="pwa-install-banner animate-fade-in" aria-label="Install App Banner">
      <div className="pwa-banner-content">
        <div className="pwa-banner-icon">
          <Smartphone size={24} className="pwa-phone-icon" />
        </div>
        <div className="pwa-banner-text">
          <strong className="pwa-banner-title">Install MovieHub App</strong>
          <span className="pwa-banner-desc">Fast, offline-ready & fullscreen mobile experience</span>
        </div>
      </div>

      <div className="pwa-banner-actions">
        <button
          type="button"
          className="pwa-install-btn"
          onClick={handleInstallClick}
        >
          <Download size={15} />
          <span>Install</span>
        </button>
        <button
          type="button"
          className="pwa-close-btn"
          onClick={handleDismiss}
          aria-label="Dismiss install prompt"
        >
          <X size={18} />
        </button>
      </div>

      {showIosInstructions && (
        <div className="pwa-ios-modal" onClick={() => setShowIosInstructions(false)}>
          <div className="pwa-ios-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="pwa-ios-header">
              <h3>Install on iPhone / iPad</h3>
              <button
                type="button"
                className="pwa-close-btn"
                onClick={() => setShowIosInstructions(false)}
              >
                <X size={18} />
              </button>
            </div>
            <ol className="pwa-ios-steps">
              <li>
                <Share2 size={16} className="ios-step-icon" />
                <span>Tap the <strong>Share</strong> button at the bottom of Safari</span>
              </li>
              <li>
                <PlusSquare size={16} className="ios-step-icon" />
                <span>Scroll down and tap <strong>Add to Home Screen</strong></span>
              </li>
              <li>
                <span>Tap <strong>Add</strong> at top right to install MovieHub!</span>
              </li>
            </ol>
            <button
              type="button"
              className="pwa-ios-gotit-btn"
              onClick={() => {
                setShowIosInstructions(false);
                setShowPrompt(false);
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default PwaInstallPrompt;
