const project = require("../db/models/project");
const catchAsync = require("../utils/catchAsync");

const createProject = catchAsync(async (req, res, next) => {
  const body = req.body;
  const userId = req.user.id;

  const newProject = await project.create({
    title: body.title,
    productImage: body.productImage,
    price: body.price,
    shortDescription: body.shortDescription,
    description: body.description,
    productUrl: body.productUrl,
    category: body.category,
    tags: body.tags,
    createdBy: userId,
  });

  return res.status(201).json({
    status: "Success",
    data: newProject,
  });
});

const getAllProjects = catchAsync(async (req, res, next) => {
  const result = await project.findAll();

  return res.json({
    status: "success",
    data: result,
  });
});

module.exports = { createProject, getAllProjects };
