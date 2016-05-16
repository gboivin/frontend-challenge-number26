var React = require('react');
var Instruction = require('./Instruction');

const Wait = React.createClass({
    render: function() {
        return (
            <Instruction>
                <h2>Please wait while we prepare your money!</h2>
            </Instruction>
        );
    }
});

module.exports = Wait;