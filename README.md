# Course_api
A simple API for getting , creating , deleting,updating Courses and all routes are authorised so if a user is logged in or have signed up then he have a json web token which 
authorises his / her to access that courses routes. Every User has a role defined either user or admin so only admin can delete a course.

# Endpoints Available

- For User login   = api/v1/Users/login
- For User signup  = api/v1/users/signup
- For getting all Courses = api/v1/course
- For creating a course = api/v1/course
- For updating a course = api/v1/course/:id
- For deleting a course = api/v1/course/:id
- For getting a single course = api/v1/course/:id

## Technologies Used

- Node js as Backend
- Mongo DB as Database
- JSON Web Token for authorisation

## Setup
 All Project Dependencies are listed in package.jsn file under dependencies in discussion_folder and server folder of project
 
 To run this Project, Install it locally using npm
 ```
 $ npm install
 $ node server.js
 
 ```
