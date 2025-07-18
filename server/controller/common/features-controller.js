const Feature = require('../../models/Features');

const addFeaturesImage = async(req,res)=>{
    try{
        const {image} = req.body;
        const featuresImages = new Feature({
            images:image
        })

        await featuresImages.save();

        res.status(201).json({
            success:true,
            data:featuresImages
        })
    }
    catch(e){
        res.status(500).json({
            success:false,
            message:"Some error occured!"
        })
    }
}


const getFeaturesImages = async(req,res)=>{
    try{

        const images = await Feature.find({});
        res.status(200).json({
            success:true,
            data:images
        })

    }
    catch(e){
        res.status(500).json({
            success:false,
            message:"Some error occured!"
        })
    }
}

module.exports = {addFeaturesImage,getFeaturesImages}