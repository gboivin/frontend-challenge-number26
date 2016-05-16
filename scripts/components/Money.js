var React = require('react');
var Instruction = require('./Instruction');

const Money = React.createClass({
    render: function() {
        let text = "Ciao! Don't forget your card and money!";
        return (
            <Instruction>
                <h2>{text}</h2>
            </Instruction>
        );
    }
});

module.exports = Money;
