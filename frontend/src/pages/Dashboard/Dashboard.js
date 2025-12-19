import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoalCard from '../../components/GoalCard/GoalCard';
import AddGoalForm from '../../components/AddGoalForm/AddGoalForm';
import { goalsAPI } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await goalsAPI.getAll();
      if (response.success) {
        setGoals(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des objectifs:', error);
      alert('Erreur lors du chargement des objectifs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (goalData) => {
    try {
      const response = await goalsAPI.create(goalData);
      if (response.success) {
        setGoals(prev => [response.data, ...prev]);
        setShowAddForm(false);
        alert('Objectif créé avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création de l\'objectif');
    }
  };

  const handleToggleStep = async (goalId, stepId) => {
    try {
      const response = await goalsAPI.toggleStep(goalId, stepId);
      if (response.success) {
        setGoals(prev => 
          prev.map(goal => 
            goal._id === goalId ? response.data : goal
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour de l\'étape');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      const response = await goalsAPI.delete(goalId);
      if (response.success) {
        setGoals(prev => prev.filter(goal => goal._id !== goalId));
        alert('Objectif supprimé avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'objectif');
    }
  };

  const filteredGoals = goals.filter(goal => {
    switch (filter) {
      case 'completed':
        return goal.isCompleted;
      case 'in-progress':
        return !goal.isCompleted;
      case 'health':
        return goal.category === 'sante';
      case 'learning':
        return goal.category === 'apprentissage';
      case 'work':
        return goal.category === 'travail';
      default:
        return true;
    }
  });

  const stats = {
    total: goals.length,
    completed: goals.filter(g => g.isCompleted).length,
    inProgress: goals.filter(g => !g.isCompleted).length
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de vos objectifs...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>🎯 Mes Objectifs</h1>
          <p>Suivez votre progression vers vos objectifs</p>
        </div>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.completed}</span>
            <span className="stat-label">Terminés</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.inProgress}</span>
            <span className="stat-label">En cours</span>
          </div>
        </div>
      </header>

      <div className="dashboard-controls">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tous
          </button>
          <button 
            className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setFilter('in-progress')}
          >
            En cours
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Terminés
          </button>
        </div>

        <button 
          className="add-goal-btn"
          onClick={() => setShowAddForm(true)}
        >
          + Nouvel Objectif
        </button>
      </div>

      <div className="goals-grid">
        {filteredGoals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h3>Aucun objectif trouvé</h3>
            <p>
              {filter === 'all' 
                ? 'Commencez par créer votre premier objectif !'
                : 'Aucun objectif ne correspond à ce filtre.'
              }
            </p>
            {filter === 'all' && (
              <button 
                className="add-goal-btn"
                onClick={() => setShowAddForm(true)}
              >
                Créer mon premier objectif
              </button>
            )}
          </div>
        ) : (
          filteredGoals.map(goal => (
            <GoalCard
              key={goal._id}
              goal={goal}
              onToggleStep={handleToggleStep}
              onDelete={handleDeleteGoal}
            />
          ))
        )}
      </div>

      {showAddForm && (
        <AddGoalForm
          onGoalAdded={handleAddGoal}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;