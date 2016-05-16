var React = require('react');
var $ = require('jquery');

const SelectAmount = React.createClass({
    getInitialState: function() {
        return {
            amount: '',
            error: ''
        }
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(nextProps);
    },
    handleClick: function(e) {
        let amount = $(e.target).text();
        this.props.atm.input(amount, true)
    },
    render: function() {
        return (
            <div className="select">
                <div className="choices left">
                    <span onClick={this.handleClick}>20</span>
                    <span onClick={this.handleClick}>50</span>
                    <span onClick={this.handleClick}>80</span>
                </div>
                <div className="choices right">
                    <span onClick={this.handleClick}>100</span>
                    <span onClick={this.handleClick}>200</span>
                    <span onClick={this.handleClick}>300</span>
                </div>
                <div className="input-wrapper">
                    <h2>Select or type an amount</h2>
                    <input type="number" readOnly value={this.state.amount} name="amount"/>
                    <span className="error-msg">{this.state.error}</span>
                </div>
            </div>
        );
    }
});

module.exports = SelectAmount;