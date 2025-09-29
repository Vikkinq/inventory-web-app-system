const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const utangSchema = Schema({
  person: {
    type: String,
    required: true,
  },
});
