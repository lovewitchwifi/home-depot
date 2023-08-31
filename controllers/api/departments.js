const Department = require('../../models/department')

exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find().populate({
            path: 'categories',
            populate: {
                path: 'items'
            }
        })
        res.status(200).json(departments)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.getCategoriesInDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params
        const department = await Department.findById(departmentId).populate('categories')
        
        if (!department) {
            return res.status(404).json({ error: 'Department not found' })
        }

        res.status(200).json(department.categories)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.getItemsInCategory = async (req, res) => {
    try {
        const { departmentId, categoryId } = req.params
        const department = await Department.findById(departmentId).populate({
            path: 'categories',
            match: { _id: categoryId },
            populate: {
                path: 'items'
            }
        })

        if (!department || !department.categories.length) {
            return res.status(404).json({ error: 'Department or category not found' })
        }

        res.status(200).json(department.categories[0].items)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.getSpecificItem = async (req, res) => {
    try {
        const { departmentId, categoryId, itemId } = req.params
        const department = await Department.findById(departmentId).populate({
            path: 'categories',
            match: { _id: categoryId },
            populate: {
                path: 'items',
                match: { _id: itemId }
            }
        })

        if (!department || !department.categories.length || !department.categories[0].items.length) {
            return res.status(404).json({ error: 'Department, category, or item not found' })
        }

        res.status(200).json(department.categories[0].items[0])
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
