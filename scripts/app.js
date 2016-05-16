"use strict";

const ATM = React.createClass({
    getInitialState: function() {
        /*
         * These are the different steps in this app, each one has a view property 
         * which defines the react component used, functions used for validation or handling input,
         * and finally some booleans to define if the keypad or cardslot should be visible at this step 
        */

        let steps = [{
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

        let currentStep = this.getCurrentStep(steps);

        return {steps: steps, currentStep: currentStep, PIN: '', amount: ''};
    },

    //Once component is mounted, watch hash changes to load right step
    componentDidMount: function() {
        $(window).on('hashchange', function(a) {
            this.setState({
                currentStep: this.getCurrentStep(this.state.steps)
            });
        }.bind(this));
    },

    //Gets current step index
    getCurrentStepIndex: function() {
        return this.state.steps.map(function(step) { return step.view; }).indexOf(this.state.currentStep.view); 
    },

    //Gets current step from hash or first one in case no hash is present
    getCurrentStep: function(steps) {
        let stepFromHash = $.grep(steps, function(step) { return step.view === window.location.hash.slice(1); });
        return stepFromHash.length ? stepFromHash[0] : steps[0];
    },

    //Moves App to next step
    next: function() {
        let currentIndex = this.getCurrentStepIndex();
        if(currentIndex < this.state.steps.length -1) {
            if (this.viewIs('SelectAmount')) {
                //Set timeout for end of wait
                setTimeout(this.next, 3000);
            }
            this.setCurrentView(currentIndex + 1);
        }
    },

    //Moves App to prev step
    prev: function() {
        let newIndex = this.getCurrentStepIndex() -1;
        if (newIndex == 0) {
            this.clear();
        }
        this.setCurrentView(newIndex);
    },

    //Set hash to current view
    setCurrentView: function(index) {
        window.location.hash = '#' + this.state.steps[index].view
    },
    
    // Called Whenever client clicks on button "Cancel", offer client to take his card
    abort: function() {
        this.setState({
            currentStep: {
                view: 'Abort',
                showCardSlot: true
            }
        });
    },

    //Calls current steps validation (called when click on validate)
    validate: function() {
         setTimeout(this.state.currentStep.validate, 3000);
    },

    //Clears inputted info
    clear: function() {
        this.setState({
            amount: '',
            PIN: '',
        });
    },

    //Resets app to default state
    reset: function() {
        this.clear();
        this.setCurrentView(0);
    },

    //Handle input on keypad
    input: function(key, reset) {
        this.setState({error: ''});
        this.state.currentStep.input(key, reset);
    },

    //Helper function that returns true if current view is passed as param
    viewIs: function(view) {
        return this.state.currentStep.view === view;
    },

    //Handle change of PIN, includes validation of PIN format
    updatePIN: function(value) {
        let newValue = value ? this.state.PIN + value : '';
        if (!this.validatePINFormat(newValue)) return;
        this.setState({
            PIN: newValue
        });
    },

    //Validate that PIN must be a number less than 5 chars
    validatePINFormat: function(PIN) {
        return !PIN || Number.isInteger(parseInt(PIN)) && PIN.length <= 4;
    },

    //Validate PIN
    validatePIN: function() {
        //Show error if PIN is wrong
        if (this.state.PIN != 1234) {
            this.setState({
                error: 'Oops wrong PIN! Try again',
                PIN: ''
            });
        //Else move to next step
        } else {
            this.next();
        }
    },

    //Handle update of amount
    updateAmount: function(value, reset) {
        let newValue;
        //If one of the choices are clicked instead of using keypad, don't append value
        if (reset) {
            newValue = value;
        } else {
            newValue = value ? this.state.amount + value : '';
        }
        this.setState({
            amount: newValue
        });
    },

    //Validate amount inputted
    validateAmount: function() {
        let error;
        let amount = parseInt(this.state.amount);
        if (!amount) {
            error='Please enter an amount';
        }
        else if (amount > 10000){
            error = 'You cannot withdraw more than 10000€';
        } else if (amount % 10 !== 0) {
            error = 'The amount has to be a multiple of 10';
        }
        //Show error if any
        if (error) {
            this.setState({
                error: error,
                amount: ''
            });
        //Else move to next step
        } else {
            this.next();
        }
    },

    //Handle inserting or taking back card
    handleCardAction: function () {
        if (!this.state.hasCard) {
            this.next();
        } else {
            this.reset();
        }

        this.setState({hasCard: !this.state.hasCard});
    },

    //Render view according to current step
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

/** InsertCard **/
const InsertCard = React.createClass({
    render: function() {
        return(
            <Instruction>
                <h2>Please insert your card<span className="card"/></h2>
            </Instruction> 
        )
    }
});

/** Instruction **/
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

/** Abort **/
const Abort = React.createClass({
    render: function() {
        let text = "Ciao! Don't forget your"
        return (
            <Instruction>
                <h2>{text}</h2><span className="card"></span>
            </Instruction>
        )
    }
});

/** PIN **/
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

/** SelectAmount **/
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

/** Wait **/
const Wait = React.createClass({
    render: function() {
        return (
            <Instruction>
                <h2>Please wait while we prepare your money!</h2>
            </Instruction>
        );
    }
});

/** Money **/
const Money = React.createClass({
    render: function() {
        let text = "Ciao! Don't forget your card and money!";
        return (
            <Instruction>
                <h2>{text}</h2>
            </Instruction>
        );
    }
});

/** Actions **/
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

/** Keypad **/
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

/** CardSlot **/
const CardSlot = React.createClass({
    render: function() {
        return (
            <button onClick={this.props.atm.handleCardAction} className="card-slot">
                {this.props.atm.state.hasCard ? 'Take back card' : 'Insert Card'}
            </button>
        )
    }
})


//Render React App to browser
ReactDOM.render(
    <ATM />,
    document.getElementById('atm')        
);