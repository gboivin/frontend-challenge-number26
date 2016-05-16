var React = require('react');

const CardSlot = React.createClass({
    render: function() {
        return (
            <button onClick={this.props.atm.handleCardAction} className="card-slot">
                {this.props.atm.state.hasCard ? 'Take back card' : 'Insert Card'}
            </button>
        )
    }
})

module.exports = CardSlot;