import mongoose from 'mongoose';

const LLDHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: 'anonymous', // In case user auth is added later
    },
    diagramType: {
      type: String,
      required: true,
    },
    ast: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    evaluation: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    elements: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
    previewImage: {
      type: String,
      required: false,
    },
    chatHistory: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.LLDHistory || mongoose.model('LLDHistory', LLDHistorySchema);
