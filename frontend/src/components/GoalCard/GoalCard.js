import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../ProgressBar/ProgressBar';
import './GoalCard.css';

const GoalCard = ({ goal, onToggleStep, onDelete }) => {
  const navigate = useNavigate();

  const handleStepToggle = (stepId) => {
    if (onToggleStep) {
      onToggleStep(goal._id, stepId);
    }
  };

  const handleCardClick = () => {
    navigate(`/goal/${goal._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
      onDelete(goal._id);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      sante: '💊',
      apprentissage: '📚',
      travail: '💼',
      personnel: '🎯',
      loisirs: '🎨'
    };
    return icons[category] || '🎯';
  };

  return (
    <div 
      className={`goal-card ${goal.isCompleted ? 'completed' : ''}`}
      onClick={handleCardClick}
      style={{ 
        borderLeftColor: goal.color || '#3B82F6'  // ← AJOUT IMPORTANT
      }}
    >
      <div className="goal-card-header">
        <div className="goal-category">
          <span className="category-icon">
            {getCategoryIcon(goal.category)}
          </span>
          <span className="category-name">{goal.category}</span>
        </div>
        <button 
          className="delete-btn"
          onClick={handleDelete}
          title="Supprimer l'objectif"
        >
          ×
        </button>
      </div>

      <div className="goal-card-content">
        <h3 className="goal-title">{goal.title}</h3>
        {goal.description && (
          <p className="goal-description">{goal.description}</p>
        )}
        
        {/* CORRECTION ICI - Ajout de goal.color */}
        <ProgressBar 
          progress={goal.progress} 
          color={goal.color || '#3B82F6'}  // ← AJOUT IMPORTANT
          size="small"
        />

        <div className="goal-steps">
          <h4>Étapes ({goal.steps.filter(s => s.completed).length}/{goal.steps.length})</h4>
          <div className="steps-list">
            {goal.steps.slice(0, 3).map((step) => (
              <div 
                key={step._id} 
                className={`step-item ${step.completed ? 'completed' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStepToggle(step._id);
                }}
              >
                <span className="step-checkbox">
                  {step.completed ? '✓' : '○'}
                </span>
                <span className="step-title">{step.title}</span>
              </div>
            ))}
            {goal.steps.length > 3 && (
              <div className="step-more">
                + {goal.steps.length - 3} autres étapes...
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="goal-card-footer">
        <span className="goal-date">
          Créé le {new Date(goal.createdAt).toLocaleDateString()}
        </span>
        {goal.isCompleted && (
          <span className="completed-badge">Terminé 🎉</span>
        )}
      </div>
    </div>
  );
};

export default GoalCard;