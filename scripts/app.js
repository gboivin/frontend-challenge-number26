"use strict";

var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

var ATM = require('./components/ATM');

//Render React App to browser
ReactDOM.render(
    <ATM />,
    document.getElementById('atm')        
);