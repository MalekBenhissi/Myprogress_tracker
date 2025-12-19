import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import { goalsAPI } from '../../services/api';
import './GoalDetail.css';

const GoalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoal();
  }, [id]);

  const loadGoal = async () => {
    try {
      const response = await goalsAPI.getById(id);
      if (response.success) {
        setGoal(response.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement de l\'objectif');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStep = async (stepId) => {
    try {
      const response = await goalsAPI.toggleStep(id, stepId);
      if (response.success) {
        setGoal(response.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
      try {
        await goalsAPI.delete(id);
        navigate('/dashboard');
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  if (loading) {
    return (
      <div className="goal-detail-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de l'objectif...</p>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="goal-detail-error">
        <h2>Objectif non trouvé</h2>
        <button onClick={() => navigate('/dashboard')}>
          Retour au tableau de bord
        </button>
      </div>
    );
  }

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
    <div className="goal-detail">
      <div className="goal-detail-header">
        <button 
          className="elegant-back-btn"
          onClick={() => navigate('/dashboard')}
        >
          <span className="btn-content">
            <span className="arrow">↩</span>
            Retour
          </span>
        </button>
        
        <div className="header-actions">
          <button 
            className="modern-delete-btn"
            onClick={handleDelete}
          >
            <span className="btn-icon">🗑️</span>
            <span className="btn-text">Supprimer</span>
          </button>
        </div>
        </div>


      <div className="goal-detail-content">
        <div className="goal-main-info">
          <div className="goal-category-badge">
            <span className="category-icon">
              {getCategoryIcon(goal.category)}
            </span>
            <span className="category-name">{goal.category}</span>
          </div>

          <h1 className="goal-title">{goal.title}</h1>
          
          {goal.description && (
            <p className="goal-description">{goal.description}</p>
          )}

          <div className="goal-meta">
            <div className="meta-item">
              <span className="meta-label">Début:</span>
              <span className="meta-value">
                {new Date(goal.startDate).toLocaleDateString()}
              </span>
            </div>
            {goal.targetDate && (
              <div className="meta-item">
                <span className="meta-label">Date cible:</span>
                <span className="meta-value">
                  {new Date(goal.targetDate).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="meta-item">
              <span className="meta-label">Statut:</span>
              <span className={`status-badge ${goal.isCompleted ? 'completed' : 'in-progress'}`}>
                {goal.isCompleted ? 'Terminé 🎉' : 'En cours'}
              </span>
            </div>
          </div>

          <ProgressBar 
            progress={goal.progress} 
            color={goal.color || '#3B82F6'}
            size="large"
          />
        </div>

        <div className="goal-steps-section">
          <h2>Étapes de progression</h2>
          <div className="steps-container">
            {goal.steps.map((step, index) => (
              <div 
                key={step._id} 
                className={`step-item ${step.completed ? 'completed' : ''}`}
                onClick={() => handleToggleStep(step._id)}
              >
                <div className="step-header">
                  <span className="step-number">Étape {index + 1}</span>
                  <span className="step-status">
                    {step.completed ? 'Terminée' : 'À faire'}
                  </span>
                </div>
                <div className="step-content">
                  <span className="step-checkbox">
                    {step.completed ? '✓' : '○'}
                  </span>
                  <span className="step-title">{step.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalDetail;