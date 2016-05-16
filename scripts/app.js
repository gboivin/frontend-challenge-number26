"use strict";

const ATM = React.createClass({
    getInitialState: function() {
        var steps = [{
            view: 'InsertCard',
            showCardSlot: true,
        }, {
            view: 'PIN',
            showKeypad: true,
            validate: this.validatePIN,
            input: this.updatePIN,
            backButton: true

        }, {
            view: 'SelectAmount',
            showKeypad: true,
            validate:this.validateAmount,
            input: this.updateAmount,
            backButton: true
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
                <svg className="svg-logo" xmlns="http://www.w3.org/2000/svg" width="1024" height="313.122" viewBox="0 0 1024 313.122"><g class="svg-logo__text" fill="#464646"><path d="M353.092 176.74l-49.658-59.154H292.95v77.95h12.067V136.58l49.46 58.956h10.485v-77.95h-11.87zM441.54 161.902c0 13.454-7.123 23.148-22.554 23.148-15.234 0-22.357-9.1-22.357-23.148v-44.91h-11.87v45.7c0 19.39 11.67 33.437 34.225 33.437 22.75 0 34.424-15.434 34.424-33.437v-45.7h-11.87v44.91zM515.544 155.77l-31.456-38.184h-10.88v77.95h11.87V136.58l29.28 35.413h2.374l29.28-35.414v58.956h12.068v-77.95H547.2zM622.392 155.077c7.914-2.572 13.058-8.31 13.058-17.014 0-14.046-10.09-20.377-26.51-20.377h-30.073v77.75h35.414c17.807 0 27.303-7.913 27.303-20.574-.002-11.673-7.32-17.807-19.19-19.785zm-31.655-27.104h16.62c9.694 0 15.628 2.968 15.628 11.475 0 7.716-6.33 11.08-16.223 11.08h-16.025v-22.555zm21.96 57.373h-21.96V161.21h19.982c11.474 0 18.2 3.56 18.2 12.464 0 7.52-5.54 11.672-16.223 11.672zM658.992 195.536h60.34v-10.682H670.47v-24.337h40.557V150.03h-40.557v-21.96h48.865v-10.484h-60.34zM800.448 142.613c0-17.212-11.87-24.928-29.28-24.928h-33.832v77.75h11.87V166.75h14.245l28.293 28.687h13.65v-1.98l-27.3-26.905c12.66-1.385 22.355-10.484 22.355-23.94zm-51.24 14.84V128.17h23.147c8.706 0 15.43 4.75 15.43 14.84 0 9.298-6.725 14.442-15.43 14.442h-23.147zM861.556 169.42c12.266-9.1 15.63-17.212 15.63-27.3 0-13.256-9.1-25.127-28.292-25.127-18.992 0-29.478 10.88-29.676 27.104l10.88 1.98c.2-10.486 6.135-18.004 18.6-18.004 11.078 0 16.42 6.727 16.42 15.036 0 7.517-3.76 13.453-12.465 19.98L821 187.03v9.1h58.757v-10.485h-39.963l21.762-16.224zM929.81 143.603c-12.86 0-20.774 6.133-24.93 10.485.595-16.223 8.508-27.5 24.73-27.5 9.696 0 17.807 3.562 21.764 6.332l3.76-9.695c-4.353-2.77-14.444-6.727-26.71-6.727-22.75 0-35.414 16.223-35.414 39.964 0 24.137 12.86 40.162 35.414 40.162 17.41 0 30.073-11.08 30.073-27.5-.198-16.224-10.683-25.52-28.687-25.52zm-1.582 41.942c-13.058 0-20.378-8.31-22.554-20.774 3.76-4.153 11.278-11.275 22.554-11.275 10.683 0 18.4 4.946 18.4 15.63 0 9.098-7.717 16.42-18.4 16.42z"></path></g><g class="svg-logo__cube" fill="none" stroke="#464646" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M155.702 70.216L95.552 95.2l-29.48 56.72 15.475 41.716 25.422 42.01 51.118 7.26 44.132-6.246 36.806-54.86-2.556-63.81-34.08-25.49z"></path><path d="M155.702 70.216l31.852 26.515 48.916 21.26M95.552 95.2l25.83 30.906 65.963-29.19.097 69.042 51.584 15.84M81.77 193.588l39.61-67.482 66.062 39.852-37.92 62.152zM106.97 235.647l42.768-7.427 52.482 8.44"></path></g></svg>
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