import React, { useState } from 'react';
import './AddGoalForm.css';

const AddGoalForm = ({ onGoalAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personnel',
    color: '#3B82F6',
    targetDate: '',
    steps: [{ title: '', completed: false }]
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur quand l'utilisateur tape
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps];
    newSteps[index].title = value;
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, { title: '', completed: false }]
    }));
  };

  const removeStep = (index) => {
    if (formData.steps.length > 1) {
      const newSteps = formData.steps.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, steps: newSteps }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    }

    formData.steps.forEach((step, index) => {
      if (!step.title.trim()) {
        newErrors[`step-${index}`] = 'Le titre de l\'étape est obligatoire';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Filtrer les étapes vides
    const filteredSteps = formData.steps
      .filter(step => step.title.trim())
      .map((step, index) => ({
        ...step,
        order: index
      }));

    const goalToSubmit = {
      ...formData,
      steps: filteredSteps
    };

    onGoalAdded(goalToSubmit);
    
    // Réinitialiser le formulaire
    setFormData({
      title: '',
      description: '',
      category: 'personnel',
      color: '#3B82F6',
      targetDate: '',
      steps: [{ title: '', completed: false }]
    });
  };

  const categoryOptions = [
    { value: 'sante', label: 'Santé', emoji: '💊' },
    { value: 'apprentissage', label: 'Apprentissage', emoji: '📚' },
    { value: 'travail', label: 'Travail', emoji: '💼' },
    { value: 'personnel', label: 'Personnel', emoji: '🎯' },
    { value: 'loisirs', label: 'Loisirs', emoji: '🎨' }
  ];

  const colorOptions = [
    { value: '#3B82F6', label: 'Bleu' },
    { value: '#EF4444', label: 'Rouge' },
    { value: '#10B981', label: 'Vert' },
    { value: '#F59E0B', label: 'Jaune' },
    { value: '#8B5CF6', label: 'Violet' }
  ];

  return (
    <div className="add-goal-form-overlay">
      <div className="add-goal-form-container">
        <h2>🎯 Nouvel Objectif</h2>
        
        <form onSubmit={handleSubmit} className="add-goal-form">
          <div className="form-group">
            <label htmlFor="title">Titre de l'objectif *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ex: Apprendre à jouer de la guitare"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Décrivez votre objectif..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Catégorie</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.emoji} {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="color">Couleur</label>
              <select
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
              >
                {colorOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="targetDate">Date cible (optionnelle)</label>
            <input
              type="date"
              id="targetDate"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Étapes vers l'objectif *</label>
            <div className="steps-container">
              {formData.steps.map((step, index) => (
                <div key={index} className="step-input-group">
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    placeholder={`Étape ${index + 1}...`}
                    className={errors[`step-${index}`] ? 'error' : ''}
                  />
                  {formData.steps.length > 1 && (
                    <button
                      type="button"
                      className="remove-step-btn"
                      onClick={() => removeStep(index)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add-step-btn"
                onClick={addStep}
              >
                + Ajouter une étape
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Annuler
            </button>
            <button type="submit" className="submit-btn">
              Créer l'objectif
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalForm;