var React = require('react');

var Keypad = require('./Keypad');
var CardSlot = require('./CardSlot');

const Actions = React.createClass({
    getInitialState: function() {
        return {step: this.props.step};
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(nextProps);
    },
    render: function() {
        let view = false;
        if (this.state.step.showKeypad == true) {
            view = <Keypad atm={this.props.atm}/>;
        }

        if (this.state.step.showCardSlot == true) {
            view = <CardSlot atm={this.props.atm}/>;
        }

        if (!view) return false;

        return (
            <div className="controls">
                {view}
            </div>
        );
    }
});

module.exports = Actions;
