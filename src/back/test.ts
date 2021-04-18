const cv = require('opencv4nodejs');

const mat = cv.imreadAsync(__dirname+'/1.png', (err:any, mat:any) => 
{
    cv.imshow('a window name', mat);
    cv.waitKey();
});

