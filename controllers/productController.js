import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";

// Create Product
const createProduct = async (req, res) => {
    const { name, description, price, brand, stock, category } = req.body;
    const imageUrlPath = req.files ? req.files.map(file => file.path.replace(/\\/g, "/")) : [];

    try {
        if (!name || !description || !price || !brand || !stock) {
            return res.status(400).json({ success: false, message: "All fields except category are required!" });
        }

        let categoryId = category;
        
        // If no category is provided, find and assign the first available category
        if (!categoryId) {
            const defaultCategory = await Category.findOne();
            if (!defaultCategory) {
                return res.status(400).json({ success: false, message: "No categories available. Please create one first!" });
            }
            categoryId = defaultCategory._id;
        }

        const newProduct = new Product({
            name,
            description,
            price,
            category: categoryId,
            brand,
            stock,
            image: imageUrlPath,
            rating: [],
        });

        await newProduct.save();
        res.status(201).json({ success: true, message: "Product created successfully!", product: newProduct });
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ success: false, message: "Internal server error occurred!" });
    }
};


// Delete Product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Product ID format!" });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "No product found!" });
        }

        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product deleted successfully!" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ success: false, message: "Internal server error occurred!" });
    }
};

// Edit Product
const editProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, brand, stock } = req.body;
    const imageUrlPath = req.files?.map(file => file.path.replace(/\\/g, "/")) || [];

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Product ID format!" });
        }

        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ success: false, message: "No product found!" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name: name || existingProduct.name,
                description: description || existingProduct.description,
                price: price || existingProduct.price,
                category: category || existingProduct.category,
                brand: brand || existingProduct.brand,
                stock: stock || existingProduct.stock,
                image: imageUrlPath.length > 0 ? imageUrlPath : existingProduct.image,
            },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Product updated successfully!", product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, message: "Internal server error occurred!" });
    }
};

// Get All Products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate("category", "name");
        res.status(200).json({ success: true, message: "Products retrieved successfully!", products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: "Internal server error occurred!" });
    }
};

// Get Product by ID
const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Product ID format!" });
        }

        const product = await Product.findById(id).populate("category", "name");
        if (!product) {
            return res.status(404).json({ success: false, message: "No product found!" });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        res.status(500).json({ success: false, message: "Internal server error occurred!" });
    }
};

export { createProduct, deleteProduct, editProduct, getProductById, getProducts };
