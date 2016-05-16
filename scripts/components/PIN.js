var React = require('react');
var Instruction = require('./Instruction');

const PIN = React.createClass({
    getInitialState: function() {
        return {PIN: this.props.PIN, error: false};
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(nextProps);
    },

    render: function() {
        let error = this.state.error ? <span className='error-msg'>{this.state.error}</span> : false
        return(
            <Instruction error={this.state.error}>
                <div className='input-wrapper'>
                    <h2>PIN:</h2><input type="password" readOnly value={this.state.PIN}/>
                    {error || ''}
                </div>
            </Instruction>
        );
    }
});

module.exports = PIN;