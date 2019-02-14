// const cluster = require('cluster');
// const http = require('http');
// const numCPUs = require('os').cpus().length;
// if (cluster.isMaster) {
// 	console.log(`Master ${process.pid} is running`);
// 	for (var i = 0; i < numCPUs; i++) {
// 		cluster.fork();
// 	}
// 	cluster.on('exit', (worker, code, signal) => {
// 	console.log(`worker ${worker.process.pid} died`);
// 	});
// } else {
// 	console.log("cur cluster worker id :" +cluster.worker.id);
// 	http.createServer((req, res) => {
// 		res.writeHead(200);
// 		res.end('hello world\n');
// 	}).listen(8888);
// }


// var childProcess = require('child_process');
// var options = {maxBuffer:100*1024, encoding:'utf8', timeout:5000};
// var child = childProcess.exec('dir /B', options, 
//                               function (error, stdout, stderr) {
//   if (error) {
//     console.log(error.stack);
//     console.log('Error Code: '+error.code);
//     console.log('Error Signal: '+error.signal);
//   }
//   console.log('Results: \n' + stdout);
//   if (stderr.length){
//     console.log('Errors: ' + stderr);
//   }
// });
// child.on('exit', function (code) {
//   console.log('Completed with code: '+code);
// });

// var childProcess = require('child_process');
// var options = {maxBuffer:100*1024, encoding:'UTF-16', timeout:5000};
// var child = childProcess.execFile('ping.exe', ['-n', '1', 'baidu.com'],
//                                   options, function (error, stdout, stderr) {
//   if (error) {
//     console.log(error.stack);
//     console.log('Error Code: '+error.code);
//     console.log('Error Signal: '+error.signal);
//   }
//   console.log('Results: \n' + stdout.toString());
//   if (stderr.length){
//     console.log('Errors: ' + stderr.toString());
//   }
// });
// child.on('exit', function (code) {
//   console.log('Child completed with code: '+code);
// });

// var spawn = require('child_process').spawn;
// var options = {
//     env: {user:'brad'},
//     detached:false,
//     stdio: ['pipe','pipe','pipe']
// };
// var child = spawn('netstat', ['-e']);
// child.stdout.on('data', function(data) {
//   console.log(data.toString());
// });
// child.stderr.on('data', function(data) {
//   console.log(data.toString());
// });
// child.on('exit', function(code) {
//   console.log('Child exited with code', code);
// });

// var child_process = require('child_process');
// var options = {
//     env:{user:'Brad'},
//     encoding:'utf8'
// };
// function makeChild(){
//   var child = child_process.fork('chef.js', [], options);
//   child.on('message', function(message) {
//     console.log('Served: ' + message);
//   });
//   return child;
// }
// function sendCommand(child, command){
//   console.log("Requesting: " + command);
//   child.send({cmd:command});
// }
// var child1 = makeChild();
// var child2 = makeChild();
// var child3 = makeChild();
// sendCommand(child1, "makeBreakfast");
// sendCommand(child2, "makeLunch");
// sendCommand(child3, "makeDinner");


var list = {}
list["a"] = {"name":"a","func":"do func"}
list["b"] = {"name":"b","func":"do func"}
'a' in list && delete list['a'];

console.log(list)
