'use strict';
/*
ok, what is the expected input and output?
the input we are receiving should be a string that was encrypted with base-64 that is embedded in an object called request. The string should be located at request.headers.authorization

expect object request = {
    headers:{
        authorization: 'basic lskdl:lksdfl',
    }
}
*/
const base64 = require('base-64');
const User = [];

module.exports = async (request, response, next) =>{
    let errorObj = {
        status:401, 
        statusMessage:'Unauthorized', 
        message:'Invalid User ID/Password'
    }
    if(!request.headers.authorization){
        return next(errorObj);
    }

    let encodedPair = request.headers.authorization.split(' ').pop();

    let [user, pass] = base64.decode(encodedPair).split(':');
    try{
        const validUser = await User.authenticateBasic(user, pass);
        request.token = validUser.generateToken();
        request.user = user;
        next();
    } catch{ next(errorObj);}
    //end of module.exports
}