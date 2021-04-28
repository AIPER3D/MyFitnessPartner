// const cv = require('opencv4nodejs');
// const mat = cv.imreadAsync(__dirname+'/1.png', (err:any, mat:any)
// {
//     cv.imshow('a window name', mat);
//     cv.waitKey();
// });
const { spawn } = require('child_process');
// const childPython = spawn('python', ['--version']);
// const childPython = spawn('python', ['./src/back/sum.py']);
const childPython = spawn('python', ['./src/back/sum.py', 4, 5]);

childPython.stdout.on('data', (data:any)=> {
	console.log('stdout: '+ data);
});

childPython.stderr.on('data', (data:any)=> {
	console.error('stdout: '+ data);
});

childPython.on('close', (code:any)=> {
	console.log('child process exited with code  '+ code);
});

