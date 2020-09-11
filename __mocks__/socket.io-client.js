'use strict';

let EVENTS = {};

function emit(event, ,..args){
    EVENTS[event] && EVENTS[event].forEach(func => function(...args));
}

function on(event, funct){
    if(EVENTS[event]){return EVENTS[event].push(func);}
}

const socket = {on, emit};

const io = {connect() {return socket;}}

module.exports = io;