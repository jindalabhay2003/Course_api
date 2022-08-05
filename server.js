const dotenv = require('dotenv');

process.on('uncaughtException', err=>{
  console.log(err.name,err.message);
  console.log("UNCAUGHT EXCEPTION! Shutting down.....");
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');


const DB = process.env.DATABASE.replace('<password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=> console.log("Database Connected Succesfully"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err=>{
  console.log(err.name,err.message);
  console.log("UNHANDLED REJECTION! Shutting down.....");

  server.close(()=>{
    process.exit(1);
  });
});