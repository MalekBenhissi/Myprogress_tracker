const express = require('express');
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/goals - Récupérer tous les objectifs de l'utilisateur
router.get('/', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    
    // Calculer la progression pour chaque objectif
    const goalsWithProgress = goals.map(goal => ({
      ...goal.toObject(),
      progress: goal.calculateProgress()
    }));

    res.json({
      success: true,
      data: goalsWithProgress,
      count: goals.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des objectifs',
      error: error.message
    });
  }
});

// GET /api/goals/:id - Récupérer un objectif spécifique
router.get('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Objectif non trouvé'
      });
    }

    res.json({
      success: true,
      data: {
        ...goal.toObject(),
        progress: goal.calculateProgress()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'objectif',
      error: error.message
    });
  }
});

// POST /api/goals - Créer un nouvel objectif
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, steps, targetDate, category, color } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Le titre est obligatoire'
      });
    }

    // Formater les étapes avec l'ordre
    const formattedSteps = steps ? steps.map((step, index) => ({
      title: step.title,
      completed: step.completed || false,
      order: index
    })) : [];

    const goal = new Goal({
      title,
      description,
      steps: formattedSteps,
      targetDate,
      category,
      color,
      createdBy: req.user._id
    });

    await goal.save();

    res.status(201).json({
      success: true,
      message: 'Objectif créé avec succès',
      data: {
        ...goal.toObject(),
        progress: goal.calculateProgress()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'objectif',
      error: error.message
    });
  }
});

// PUT /api/goals/:id - Modifier un objectif
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, targetDate, category, color } = req.body;

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { title, description, targetDate, category, color },
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Objectif non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Objectif modifié avec succès',
      data: {
        ...goal.toObject(),
        progress: goal.calculateProgress()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification de l\'objectif',
      error: error.message
    });
  }
});

// PUT /api/goals/:id/step/:stepId - Basculer l'état d'une étape
router.put('/:id/step/:stepId', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Objectif non trouvé'
      });
    }

    // Trouver l'étape
    const step = goal.steps.id(req.params.stepId);
    if (!step) {
      return res.status(404).json({
        success: false,
        message: 'Étape non trouvée'
      });
    }

    // Basculer l'état completed
    step.completed = !step.completed;
    
    await goal.save();

    res.json({
      success: true,
      message: 'État de l\'étape mis à jour',
      data: {
        ...goal.toObject(),
        progress: goal.calculateProgress()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'étape',
      error: error.message
    });
  }
});

// DELETE /api/goals/:id - Supprimer un objectif
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Objectif non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Objectif supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'objectif',
      error: error.message
    });
  }
});

module.exports = router;