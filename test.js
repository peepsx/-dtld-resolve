var tape = require('tape');
var resolve = require('./');

// Test against two-level domain 
tape('Successfully resolve peepsx.dcom', function(t) {
    resolve('peepsx.dcom', function (err, dtld) {
        t.error(err);
        t.ok(/[0-9a-f]{64}/.test(dtld));
        
        resolve('peepsx.dcom').then(function (dtld2) {
            t.equal(dtld, dtld2);
            t.end();
        })
    })
})

// Test against three-level domain
tape('Successfully resolve test.peepsx.dcom', function(t) {
    resolve('test.peepsx.dcom', function (err, dtld) {
        t.error(err);
        t.ok(/[0-9a-f]{64}/.test(dtld));

        resolve('test.peepsx.dcom').then(function(dtld2) {
            t.equal(dtld, dtld2);
            t.end;
        })
    })
})