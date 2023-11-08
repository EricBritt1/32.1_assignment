const express = require('express')
const ExpressError = require('./expressError')

const app = express();



app.use((req, res, next) => {
    console.log('Server received request!')
    next();
})

// This route calculates mean
app.get('/mean', function(req,res) {
    let nums = req.query.nums
    let sum = 0;
    let matches = nums.match(/\d+/g);

    try {
   matches.forEach((num) => {
        if(isNaN(num)) {
            throw new ExpressError("Only numbers allowed. Numbers are required!", 400);
        } else {
            sum += parseInt(num)
        }
   })
} catch (err) {
    return next(err);
}
    return res.json({operation: 'mean', 
        value: sum/matches.length})
})

// This route calculates median
app.get('/median', function(req, res){
    let nums = req.query.nums;
    let matches = nums.match(/\d+/g);
    let temp_array = [];
    
    try {
    matches.forEach((num) => {
        if(isNaN(num)) {
        throw new ExpressError("Only numbers allowed. Numbers are required!", 400);
        } else {
        temp_array.push(parseInt(num))
        }
    })
} catch (err) {
    return next(err)
}
    const sorted_array = temp_array.sort(function(a,b){return a-b})
    let median = (sorted_array.length-1)/2

    if(Number.isInteger(median)) {
    return res.json({operation: "Median",
value: sorted_array[median]})
    } else {
        let left_side_median = Math.trunc(median)
        let right_side_median = Math.ceil(median)
        return res.json({operation: "Median",
value: (sorted_array[left_side_median] + sorted_array[right_side_median])/2})
    }
})

//This route calculates mode
// Credit to Cole Rau for mode https://dev.to/colerau/how-to-find-the-mode-most-repeating-number-of-an-array-in-javascript-78p
app.get('/mode', function(req, res){
    let nums = req.query.nums;
    let matches = nums.match(/\d+/g);
    let mode_array = [];

    try { 
    matches.forEach((num) => {
        if(isNaN(num)) {
            throw new ExpressError("Only numbers allowed. Numbers are required!", 400);
            } else {
        mode_array.push(parseInt(num))
            }
    })
    } catch (err){
        return next(err)
    }
    let object = {}
    for (let i = 0; i < mode_array.length; i++) {
        if(object[mode_array[i]]) {
            object[mode_array[i]] += 1
        } else {
            object[mode_array[i]] = 1
        };
    }

    let biggestValue = -1;
    let biggestValuesKey = -1;

    Object.keys(object).forEach((key) => {

        let value = object[key]
        if (object[key] > biggestValue) {
            biggestValue = value
            biggestValuesKey = key
        }
    })

    return res.json({operation: "mode",
    value: biggestValuesKey})
    })

    app.use(function(err, req, res, next){
        let status = err.status || 500;
        let message = err.message

        return res.status(status).json({
            error: {message, status}
        });
    });

    app.listen(3000, () => {
        console.log('Server running on port 3000!')
        })
   
