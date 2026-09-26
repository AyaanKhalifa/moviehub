import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, Search, Sparkles, Film, ArrowRight } from 'lucide-react';
import { ENTERTAINMENT_CATEGORIES } from '../utils/categories';
import './CategoriesModal.css';

const CategoriesModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectSubtype = (subtype, categoryTitle) => {
    onClose();
    navigate(`/search?q=${encodeURIComponent(subtype.query)}&category=${encodeURIComponent(subtype.name)}`);
  };

  const filteredCategories = ENTERTAINMENT_CATEGORIES.map((cat) => {
    const matchedSubtypes = cat.subtypes.filter(
      (sub) =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...cat, subtypes: matchedSubtypes };
  }).filter((cat) => cat.subtypes.length > 0);

  const modalContent = (
    <div className="cat-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cat-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cat-modal-header">
          <div className="cat-modal-title-wrap">
            <Sparkles size={20} className="cat-sparkle-icon" />
            <h2>Explore All Entertainment Categories</h2>
          </div>
          <button className="cat-close-btn" onClick={onClose} aria-label="Close categories">
            <X size={20} />
          </button>
        </div>

        {/* Search within Categories */}
        <div className="cat-search-bar-wrap">
          <Search size={18} className="cat-search-icon" />
          <input
            type="text"
            placeholder="Search categories & formats (e.g. Anime Movie, Stand-Up, Documentary...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cat-search-input"
            autoFocus
          />
          {searchTerm && (
            <button className="cat-search-clear" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Categories Grid */}
        <div className="cat-grid-scrollable">
          {filteredCategories.length === 0 ? (
            <div className="cat-no-results">
              <p>No categories found matching "{searchTerm}"</p>
            </div>
          ) : (
            <div className="cat-sections-grid">
              {filteredCategories.map((cat) => (
                <div key={cat.id} className="cat-card">
                  <div className="cat-card-header" style={{ borderLeftColor: cat.color }}>
                    <span className="cat-card-icon">{cat.icon}</span>
                    <h3 className="cat-card-title">{cat.title}</h3>
                    <span className="cat-subtypes-count">{cat.subtypes.length} formats</span>
                  </div>

                  <div className="cat-subtypes-pills">
                    {cat.subtypes.map((sub) => (
                      <button
                        key={sub.name}
                        className="cat-subtype-pill"
                        onClick={() => handleSelectSubtype(sub, cat.title)}
                        title={`Explore ${sub.name}`}
                      >
                        <span>{sub.name}</span>
                        <ArrowRight size={12} className="pill-arrow" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="cat-modal-footer">
          <span>Click any entertainment format to instantly load verified IMDb titles.</span>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CategoriesModal;
