process.on('message', function(message, parent) {
  var meal = {};
  switch (message.cmd){
    case 'makeBreakfast':
      meal = ["ham", "eggs", "toast"];
      break;
    case 'makeLunch':
      meal = ["burger", "fries", "shake"];
      break;
    case 'makeDinner':
      meal = ["soup", "salad", "steak"];
      break;
  }
  process.send(meal);
});

var child_process = require("child_process");

var url = "http://127.0.0.1",
      port=8080,
      cmd = 'start';

switch (process.platform) {
    case 'wind32':
        cmd = 'start';
        break;

    case 'linux':
        cmd = 'xdg-open';
        break;

    case 'darwin':
        cmd = 'open';
        break;
}
console.log(cmd,url,port)
child_process.exec(cmd + ' ' + url + ':' + port);