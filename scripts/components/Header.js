var React = require('react');

/** Header **/
const Header = React.createClass({
    render: function() {
        let title = "Europe's most modern bank";
        return(
            <header className={this.props.atm.state.currentStep.view != 'SelectAmount' ? 'center' : ''}>
                <img  className="svg-logo" src="images/logo.svg"/>
                <h1>{title}</h1>
            </header>
        );
    } 
});

module.exports = Header;