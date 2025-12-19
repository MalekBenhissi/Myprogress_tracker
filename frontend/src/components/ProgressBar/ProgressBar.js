import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress, color = '#3B82F6', size = 'medium' }) => {
  
  // Fonction pour générer un dégradé basé sur la couleur
  const getGradientStyle = (color) => {
    const gradients = {
      '#3B82F6': 'linear-gradient(90deg, #3B82F6, #60A5FA)',
      '#EF4444': 'linear-gradient(90deg, #EF4444, #FCA5A5)',
      '#10B981': 'linear-gradient(90deg, #10B981, #34D399)',
      '#F59E0B': 'linear-gradient(90deg, #F59E0B, #FBBF24)',
      '#8B5CF6': 'linear-gradient(90deg, #8B5CF6, #A78BFA)'
    };
    
    return gradients[color] || color;
  };

  return (
    <div className={`progress-bar-container ${size}`}>
      <div className="progress-bar-header">
        <span className="progress-label">Progression</span>
        <span className="progress-percentage">{progress}%</span>
      </div>
      <div className="progress-bar-background">
        <div 
          className="progress-bar-fill"
          style={{ 
            width: `${progress}%`,
            background: getGradientStyle(color)  
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;