"use strict";

const ATM = React.createClass({
    getInitialState: function() {
        /*
         * These are the different steps in this app, each one has a view property 
         * which defines the react component used, functions used for validation or handling input,
         * and finally some booleans to define if the keypad or cardslot should be visible at this step 
        */

        var steps = [{
            view: 'InsertCard',
            showCardSlot: true,
        }, {
            view: 'PIN',
            validate: this.validatePIN,
            input: this.updatePIN,
            showKeypad: true,

        }, {
            view: 'SelectAmount',
            validate:this.validateAmount,
            input: this.updateAmount,
            showKeypad: true
        },
        {
            view: 'Wait',
            callback: this.wait
        },
        {
            view: 'Money',
            validate:this.validateMoney,
            showCardSlot: true
        },
        {
            view: 'Abort',
            showCardSlot: true
        }];

        var currentStep = this.getCurrentStep(steps);

        return {steps: steps, currentStep: currentStep, PIN: '', amount: ''};
    },

    componentDidMount: function() {
        $(window).on('hashchange', function(a) {
            this.setState({
                currentStep: this.getCurrentStep(this.state.steps)
            });
        }.bind(this));
    },

    getCurrentStep: function(steps) {
        var stepFromHash = $.grep(steps, function(step) { return step.view === window.location.hash.slice(1); });
        return stepFromHash.length ? stepFromHash[0] : steps[0];
    },
    next: function() {
        var currentIndex = this.getCurrentStepIndex();
        if(currentIndex < this.state.steps.length -1) {
            if (this.viewIs('SelectAmount')) {
                //Set timeout for end of wait
                setTimeout(this.next, 3000);
            }
            this.setCurrentView(currentIndex + 1);
        }
    },
    prev: function() {
        var newIndex = this.getCurrentStepIndex() -1;
        if (newIndex == 0) {
            this.clear();
        }
        this.setCurrentView(newIndex);
    },
    setCurrentView: function(index) {
        window.location.hash = '#' + this.state.steps[index].view
    },

    abort: function() {
        this.setState({
            currentStep: {
                view: 'Abort',
                showCardSlot: true
            }
        });
    },

    validate: function() {
         setTimeout(this.state.currentStep.validate, 3000);
    },

    wait: function() {

    },

    clear: function() {
        this.setState({
            amount: '',
            PIN: '',
        });
    },

    reset: function() {
        this.clear();
        this.setCurrentView(0);
    },

    input: function(key, reset) {
        this.setState({error: ''});
        this.state.currentStep.input(key, reset);
    },

    viewIs: function(view) {
        return this.state.currentStep.view === view;
    },

    updatePIN: function(value) {
        var newValue = value ? this.state.PIN + value : '';
        if (!this.validatePINFormat(newValue)) return;
        this.setState({
            PIN: newValue
        });
    },

    validatePIN: function() {
        //Simulate AJAX CALL TO CHECK PIN
        if (this.state.PIN != 1234) {
            this.setState({
                error: 'Oops wrong PIN! Try again',
                PIN: ''
            });
        } else {
            this.next();
        }
    },

    updateAmount: function(value, reset) {
        var newValue;
        if (reset) {
            newValue = value;
        } else {
            newValue = value ? this.state.amount + value : '';
        }
        this.setState({
            amount: newValue
        });
    },

    validateAmount: function() {
        var error;
        let amount = parseInt(this.state.amount);
        if (!amount) {
            error='Please enter an amount';
        }
        else if (amount > 10000){
            error = 'You cannot withdraw more than 10000€';
        } else if (amount % 10 !== 0) {
            error = 'The amount has to be a multiple of 10';
        }

        if (error) {
            this.setState({
                error: error,
                amount: ''
            });
        } else {
            this.next();
        }
    },

    validatePINFormat: function(PIN) {
        return !PIN || Number.isInteger(parseInt(PIN)) && PIN.length <= 4;
    },

    setAmount: function(value) {
        this.setState({
            amount: value
        });
    },

    getCurrentStepIndex: function() {
        return this.state.steps.map(function(step) { return step.view; }).indexOf(this.state.currentStep.view); 
    },

    handleCardAction: function () {
        if (!this.state.hasCard) {
            this.next();
        } else {
            this.reset();
        }

        this.setState({hasCard: !this.state.hasCard});
    },

    render: function() {
        let view = '';
        switch(this.state.currentStep.view) {
            case 'InsertCard':
                view = <InsertCard hasCard={this.state.hasCard}/>;
                break;
            case 'PIN':
                view = <PIN error={this.state.error} PIN={this.state.PIN}/>;
                break;
            case 'SelectAmount':
                view = <SelectAmount atm={this} error={this.state.error} amount={this.state.amount}/>;
                break;
            case 'Wait':
                view = <Wait />;
                break;
            case 'Money':
                view = <Money hasCard={this.state.hasCard}/>;
                break;
            case 'Abort':
                view= <Abort hasCard={this.state.hasCard}/>
                break;
        }
        return (
            <main>
                <Header atm={this}/>
                {view}
                <Actions atm={this} step={this.state.currentStep}/>
            </main>
        );
    }
});

const Header = React.createClass({
    render: function() {
        var title = "Europe's most modern bank";
        return(
            <header className={this.props.atm.state.currentStep.view != 'SelectAmount' ? 'center' : ''}>
                <img  className="svg-logo" src="../images/logo.svg"/>
                <h1>{title}</h1>
            </header>
        );
    } 
});

const InsertCard = React.createClass({
    render: function() {
        return(
            <Instruction>
                <h2>Please insert your card<span className="card"/></h2>
            </Instruction> 
        )
    }
});


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

const Abort = React.createClass({
    render: function() {
        var text = "Ciao! Don't forget your"
        return (
            <Instruction>
                <h2>{text}</h2><span className="card"></span>
            </Instruction>
        )
    }
});

const PIN = React.createClass({
    getInitialState: function() {
        return {PIN: this.props.PIN, error: false};
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(nextProps);
    },

    render: function() {
        var error = this.state.error ? <span className='error-msg'>{this.state.error}</span> : false
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
        var amount = $(e.target).text();
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

const Wait = React.createClass({
    render: function() {
        return (
            <Instruction>
                <h2>Please wait while we prepare your money!</h2>
            </Instruction>
        );
    }
})

const Money = React.createClass({
    render: function() {
        var text = "Ciao! Don't forget your card and money!";
        return (
            <Instruction>
                <h2>{text}</h2>
            </Instruction>
        );
    }
})

const Actions = React.createClass({
    getInitialState: function() {
        return {step: this.props.step};
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(nextProps);
    },
    render: function() {
        var view = false;
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

const Keypad = React.createClass({
    handleClick: function(e) {
        var key = $(e.target).text();
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
        var numbers = [];
        var buttons =[];
        for (var i = 1; i < 10; i++) {
            buttons.push(i); 
        };
        buttons.push(0);

        var controlKeys = ['clear', 'cancel', 'validate'];

        var view = buttons.concat(controlKeys).map(function(text, i) {
            return <button className={!parseInt(text) ? text : ''} onClick={this.handleClick} key={i}>{text}</button>;
        }.bind(this));

        return (
            <div id="keypad">
                {view}
            </div>
        )
    }
});

const CardSlot = React.createClass({
    render: function() {
        return (
            <button onClick={this.props.atm.handleCardAction} className="card-slot">
                {this.props.atm.state.hasCard ? 'Take back card' : 'Insert Card'}
            </button>
        )
    }
})

ReactDOM.render(
    <ATM />,
    document.getElementById('atm')        
);