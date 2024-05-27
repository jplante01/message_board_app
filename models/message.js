const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, maxLength: 60 },
  content: { type: String, required: true, maxLength: 240 },
  timestamp: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

MessageSchema.virtual('formatted_timestamp').get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_SHORT);
});

module.exports = mongoose.model('Message', MessageSchema);
