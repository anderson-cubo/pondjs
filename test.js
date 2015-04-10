var vm = require('vm');

function a() {
  val = 1;
  b();
}
function b() {
  console.log(val);
}
//a();
vm.runInNewContext('b();', {val: 1, console: console, b: b});
