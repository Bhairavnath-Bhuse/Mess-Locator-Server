const mongoose = require("mongoose");

// Define the user schema using the Mongoose Schema constructor
const userSchema = new mongoose.Schema(
	{
		// Define the name field with type String, required, and trimmed
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		// Define the email field with type String, required, and trimmed
		email: {
			type: String,
			required: true,
			trim: true,
		},

		// Define the password field with type String and required
		password: {
			type: String,
			required: true,
		},
		// Define the role field with type String and enum values of, "Messowner", or "Client"
		accountType: {
			type: String,
			enum: ["MessOwner", "Client"],
			required: true,
		},
		

		additionalDetails: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Profile",
		},
		messes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Mess",
			},
		],
		resetPasswordExpires: {
			type: Date,
		},
		approved: {
			type: Boolean,
			default: true,
		},

		token: {
			type: String,
		},
		

		image: {
			type: String,
			required: true,
		},
		// messProgress: [
		// 	{
		// 		type: mongoose.Schema.Types.ObjectId,
		// 		ref: "MessProgress",
		// 	},
		// ],

		// Add timestamps for when the document is created and last modified
	},
);

// Export the Mongoose model for the user schema, using the name "user"
module.exports = mongoose.model("User", userSchema);