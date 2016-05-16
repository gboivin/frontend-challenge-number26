var React = require('react');
var Instruction = require('./Instruction');

const Abort = React.createClass({
    render: function() {
        let text = "Ciao! Don't forget your"
        return (
            <Instruction>
                <h2>{text}</h2><span className="card"></span>
            </Instruction>
        )
    }
});

module.exports = Abort;