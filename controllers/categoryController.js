import { Category } from "../models/category.model.js";

// Create a new category
const createCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        if (!name || !description) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const newCategory = new Category({ name, description });
        await newCategory.save();

        res.status(201).json({ success: true, message: "Category created successfully!", category: newCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error occurred." });
    }
};

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error occurred." });
    }
};

// Update a category
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const category = await Category.findByIdAndUpdate(id, { name, description }, { new: true });

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }

        res.status(200).json({ success: true, message: "Category updated successfully!", category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error occurred." });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }

        res.status(200).json({ success: true, message: "Category deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error occurred." });
    }
};

export { createCategory, getCategories, updateCategory, deleteCategory };
