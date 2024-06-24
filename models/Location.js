const mongoose = require("mongoose");

// Define the Tags schema
const locationSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},

	messes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Mess",
		},
	],
});

// Export the Tags model
module.exports = mongoose.model("Location", locationSchema);