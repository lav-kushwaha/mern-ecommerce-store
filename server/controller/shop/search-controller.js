const Products = require('../../models/Product')

const searchProducts = async(req,res)=>{
    try{
        const {keywords} = req.params;
        if(!keywords || typeof keywords!=='string'){
           return res.status(400).json({
            success:false,
            message:"Keyword is required and must be in string format!"
           })
        }

        const regEx = new RegExp(keywords,'i');

        const createSearchQuery = {
            $or :[
                
                {title:regEx},
                {description:regEx},
                {category:regEx},
                {brand:regEx},
            ]
        }

        const searchResults = await Products.find(createSearchQuery);
         res.status(200).json({
            success:true,
            data:searchResults
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Error"
        })
        
    }
}

module.exports = {searchProducts}