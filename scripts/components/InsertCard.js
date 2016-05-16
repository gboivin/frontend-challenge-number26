var React = require('react');
var Instruction = require('./Instruction');

const InsertCard = React.createClass({
    render: function() {
        return(
            <Instruction>
                <h2>Please insert your card<span className="card"/></h2>
            </Instruction> 
        )
    }
});

module.exports = InsertCard;