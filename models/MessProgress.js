const mongoose = require("mongoose");

const progressSchema = mongoose.connect({
    messId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mess"
    },
    completedDays :[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "completedDays"
        }
    ]
})

module.exports = mongoose.model("MessProgess", progressSchema);