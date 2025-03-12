import {Product} from "../models/product.model.js"
import {Category} from "../models/category.model.js"
import mongoose from "mongoose";

const createProduct = async(req, res)=>{
    const {name, description, price , category, brand, stock, rating } = req.body;
    const imageUrlPath =req.files ? req.files.map(file => file.path.replace(/\\/g, "/")) : [];
   
    try{
     if(!name || !description ||!price||! brand ||!stock ||!rating)
     {
       return res.status(400).json({success: false, message: "All fields are required! "})
     }
     let categoryId = category;
     if (!categoryId) {
         const defaultCategory = await Category.findOne();
         categoryId = defaultCategory ? defaultCategory._id : null;
     }
     const newProducts = new Product({
        name,
        description,
        price,
        category:categoryId,
        brand,
        stock,
        image:imageUrlPath,
        rating:[],

     })
     await newProducts.save();
     res.status(201).json({success: true, message:"Product created Successfully! ",newProducts})
    }catch(error)
    {
        return res.status(500).json({success: false, message:"Internal  error occured !"})
    }
}

const deteleProduct = async(req, res) =>{
    const {id} = req.params;
    try {
        const products = await Product.findById(id)
        if(!products)
        {
            return res.status(404).json({success: false, message: "NO products found !"})
        }
        await Product.findByIdAndDelete(id)
        res.status(200).json({success: true, message:"Product deleted successfully!"}) 
    } catch (error) {
        res.status(500).json({success:false, message:"Internal error occured ! "})
    }
}
const editProducts = async(req, res)=>{
    const {id} = req.params;
    const updateDate = req.body;
    try {
        const updateProduct = await Product.findById(id)
        if(!updateProduct)
        {
            return res.status(404).json({success:false, message: "No product found "})
        }
        const newUPdate = await Product.findByIdAndUpdate(updateProduct,updateDate,{
           new:true 
        } )
        res.status(200).json({success:true, message:"Product updated successfully!", newUPdate})
    } catch (error) {
        res.status(500).json({success: false, message:"Interanl error occured !"})
    }
}

const getProducts = async(req, res) =>{
    try {
        const products =  await Product.find({})
        if(!products)
        {
            return res.status(404).json({success: false, message:"No products  found ."})
        }
        res.status(200).json({success:true, message: "Products", product: products})
        
    } catch (error) {
        res.status(500).json({success: false, message:"Internal  error occured ."})
    }
}
const  getProductById = async(req, res) =>{
    const {id} = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(id))
        {
            return res.status(400).json({success:false, message:"Invalid  Id format " })
        }
        const productId = await Product.findById(id);
        if(!productId)
        {
            return res.status(404).json({success: false, message: "NO Product found"})
        }
       res.status(200).json({success: true, data: productId})
        
    } catch (error) {
        res.status(500).json({success:false, message:"Internal error occured ."})
    }
}










export{createProduct, deteleProduct, editProducts, getProductById, getProducts}

