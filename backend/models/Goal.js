const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  completed: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    required: true
  }
});

const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  steps: [stepSchema],
  startDate: {
    type: Date,
    default: Date.now
  },
  targetDate: Date,
  isCompleted: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['sante', 'apprentissage', 'travail', 'personnel', 'loisirs'],
    default: 'personnel'
  },
  color: {
    type: String,
    default: '#3B82F6' // Couleur par défaut (bleu)
  }
}, {
  timestamps: true
});

// Méthode pour calculer la progression
goalSchema.methods.calculateProgress = function() {
  if (this.steps.length === 0) return 0;
  const completedSteps = this.steps.filter(step => step.completed).length;
  return Math.round((completedSteps / this.steps.length) * 100);
};

// Middleware pour mettre à jour isCompleted
goalSchema.pre('save', function(next) {
  const progress = this.calculateProgress();
  this.isCompleted = progress === 100;
  next();
});

module.exports = mongoose.model('Goal', goalSchema);