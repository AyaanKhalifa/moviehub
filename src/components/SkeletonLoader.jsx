import React from 'react';
import './SkeletonLoader.css';

export const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-poster"></div>
      <div className="skeleton-card-body">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton-meta-row">
          <div className="skeleton skeleton-badge"></div>
          <div className="skeleton skeleton-year"></div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 8 }) => {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
};

export const SkeletonHero = () => {
  return (
    <div className="skeleton-hero">
      <div className="container skeleton-hero-container">
        <div className="skeleton-hero-left">
          <div className="skeleton skeleton-pill"></div>
          <div className="skeleton skeleton-hero-title"></div>
          <div className="skeleton skeleton-hero-title-sub"></div>
          <div className="skeleton-hero-meta-row">
            <div className="skeleton skeleton-chip"></div>
            <div className="skeleton skeleton-chip"></div>
            <div className="skeleton skeleton-chip"></div>
          </div>
          <div className="skeleton skeleton-hero-plot"></div>
          <div className="skeleton-hero-btn-row">
            <div className="skeleton skeleton-btn"></div>
            <div className="skeleton skeleton-btn"></div>
          </div>
        </div>
        <div className="skeleton-hero-right">
          <div className="skeleton skeleton-hero-poster"></div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonDetails = () => {
  return (
    <div className="container skeleton-details-container">
      <div className="skeleton skeleton-btn" style={{ width: 100, marginBottom: 24 }}></div>
      <div className="skeleton-details-grid">
        <div className="skeleton skeleton-detail-poster"></div>
        <div className="skeleton-details-info">
          <div className="skeleton skeleton-hero-title" style={{ width: '70%', height: 48 }}></div>
          <div className="skeleton-hero-meta-row" style={{ marginTop: 20 }}>
            <div className="skeleton skeleton-chip" style={{ width: 90, height: 36 }}></div>
            <div className="skeleton skeleton-chip" style={{ width: 90, height: 36 }}></div>
            <div className="skeleton skeleton-chip" style={{ width: 90, height: 36 }}></div>
          </div>
          <div className="skeleton skeleton-hero-plot" style={{ marginTop: 24, height: 90 }}></div>
          <div className="skeleton skeleton-hero-plot" style={{ marginTop: 20, height: 120 }}></div>
        </div>
      </div>
    </div>
  );
};
