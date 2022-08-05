const Course = require('./../models/courseModel.js');
const APIFeatures = require('./../Utils/apiFeatures.js');
const catchAsync = require('./../Utils/catchAsync.js');
const AppError = require('./../Utils/appError.js');

exports.getAllCourse = catchAsync(async(req,res,next)=> {

    // EXECUTE QUERY
    const Features = new APIFeatures(Course.find(),req.query).filter().sort().LimitingFields().Paginate();
    const courses = await Features.query;

    // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: courses.length,
    data: {
      courses
    }
  });


});

exports.getCourse =  catchAsync(async (req, res,next) => {

    const course = await Course.findById(req.params.id);

    if(!course){
      return next(new AppError("No course Found with this ID",404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        course
      }
    });

});

exports.createCourse = catchAsync(async (req, res,next) => {
    const newCourse = await Course.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        course: newCourse
      }
    });
  
});

exports.updateCourse = catchAsync(async (req, res,next) => {

    const course = await Course.findByIdAndUpdate(req.params.id,req.body,{
      new: true,
      runValidators: true
    });

    if(!course){
      return next(new AppError("No course Found with this ID",404));
    }

    res.status(201).json({
      status: 'success',
      data: {
        course
      }
    });
 
});

exports.deleteCourse = catchAsync(async (req, res,next) => {

    const course = await Course.findByIdAndDelete(req.params.id);

    if(!course){
      return next(new AppError("No course Found with this ID",404));
    }
    
    res.status(204).json({
      status: 'success',
      data: {
        course: null
      }
    });
 
});