var React = require('react');
var $ = require('jquery');

var Header = require('./Header');
var Actions = require('./Actions');
var InsertCard = require('./InsertCard');
var PIN = require('./PIN');
var SelectAmount = require('./SelectAmount');
var Wait = require('./Wait');
var Money = require('./Money');
var Abort = require('./Abort');
               
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

module.exports = ATM;