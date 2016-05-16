var React = require('react');
var $ = require('jquery');

const Keypad = React.createClass({
    handleClick: function(e) {
        let key = $(e.target).text();
        switch (key) {
            case 'cancel':
                this.props.atm.abort();
                break;
            case 'validate':
                this.props.atm.validate();
                break;
            case 'clear':
                this.props.atm.clear();
                break;
            default:
                this.props.atm.input(key);
        }
    },
    render: function() {
        let numbers = [];
        let buttons =[];
        for (let i = 1; i < 10; i++) {
            buttons.push(i); 
        };
        buttons.push(0);

        let controlKeys = ['clear', 'cancel', 'validate'];

        let view = buttons.concat(controlKeys).map(function(text, i) {
            return <button className={!parseInt(text) ? text : ''} onClick={this.handleClick} key={i}>{text}</button>;
        }.bind(this));

        return (
            <div id="keypad">
                {view}
            </div>
        )
    }
});

module.exports = Keypad;