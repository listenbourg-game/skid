 
const r = require("fastimportmoodule")
const mo=new r  
console.log("import")
mo.add("express").add("http").add("debug").add("morgan")
var debug = mo.module.debug('temp:server');
const http=mo.module.http
const app=mo.module.express.application
console.log("init")
console.log(mo.module.morgan)
app.use(mo.module.morgan("dev"))
app.use("/",mo.module.express.static("./src"))
const middle=(req,res,next)=>{
console.log(req)
return next()
}
//app.use("*",middle)
console.log("root")
const server=http.createServer(app)
console.log("server cree")
var port = normalizePort(process.env.PORT || '3000');
//app.set('port', port);
server.listen(port)
console.log("serveur démarrée")
function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }
  /**
   * Event listener for HTTP server "listening" event.
   */
  
  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    console.log('Listening on ' + bind);
  }
server.on('error', onError);
server.on('listening', onListening);
//console.log(app)