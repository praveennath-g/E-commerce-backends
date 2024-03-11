const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/databsae');

dotenv.config({path:"config/config.env"});


connectDatabase();

const server = app.listen(process.env.PORT,()=>{
    console.log(`server listening to the port ${process.env.PORT} ${process.env.NODE_ENV}`)
})

process.on('unhandledRejection',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled rejection error');
    server.close(()=>{
        process.exit(1);
    })
})

process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to uncaught error');
    server.close(()=>{
        process.exit(1);
    })
})