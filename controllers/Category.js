const Mess = require("../models/Mess")

exports.foodCategory = async (req, res) =>{

    try{
        const {location} = req.query;
        const messes = await Mess.find({ location: location });
        

        if(!messes || messes.length === 0)
            {
                return res.status(404).json({
                    success:false,
                    message:`Not any Food Post at ${location}`
                })
            }

        return res.status(200).json({ success: true , data: messes, });

    }
    catch(error){
        return res.status(500).json({
			success: false,
			message: error.message,
		});
    }
        
}

exports.allFoodCategory = async (req, res) =>{

    try{
        const messes = await Mess.find();
        return res.status(200).json({ success: true , data: messes, });


    }
    catch(error){
        return res.status(500).json({
			success: false,
			message: error.message,
		});
    }
        
}