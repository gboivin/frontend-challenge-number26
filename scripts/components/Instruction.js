var React = require('react');

const Instruction = React.createClass({
    getInitialState: function() {
        return {error : ''}
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(nextProps);
    },
    render: function() {
        return (
            <div className={"instruction " + (this.state.error ? 'error' : '')}>
                {this.props.children}
            </div>
        );
    }
});

module.exports = Instruction;