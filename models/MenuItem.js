const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      required: true,
      min: 0 // Prevents negative prices
   },
   taste: {
      type: String,
      enum: ['sweet', 'spicy', 'sour'],
      lowercase: true // Converts input to lowercase automatically
   },
   is_drink: { // More readable than 'id_drink'
      type: Boolean,
      default: false
   },
   ingredients: {
      type: [String],
      default: []
   },
   num_sales: {
      type: Number,
      default: 0,
      min: 0 // Prevents negative sales numbers
   }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
