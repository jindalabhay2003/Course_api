const express = require('express');
const courseController = require('./../controllers/courseController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.get('/',authController.protect,courseController.getAllCourse);
router.post('/',authController.protect,courseController.createCourse);
router.patch('/',authController.protect,courseController.updateCourse);

router.get('/:id',authController.protect,courseController.getCourse);

router.delete('/:id',authController.protect,authController.restrictTo('admin'),courseController.deleteCourse);

module.exports = router;