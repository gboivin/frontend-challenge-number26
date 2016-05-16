# Number 26 frontend challenge

You can view the live project here: http://gboivin.github.io/frontend-challenge-number26, or simply run a web server (python -m SimpleHTTPServer then http://localhost:8000)

## Goal/Idea

My main goal was to make nice, minimalistic ATM, easy to use and following the general style and color scheme of Number 26.

## Technologies used:
  - Sass
  - Babel (for JSX)
  - React
  - JQuery

## Implementation
I used React to implement this ATM which means the templates are contained in the JS as JSX. I divided my app in React components as follows:
 - App
    - Header
    - _current view_
    - Actions

The views available are:
- InsertCard
- PIN
- SelectAmount
- Wait
- Money
- Abort

Actions can contain:
- Keypad
- Card slot (Insert/Take back card button)
    
## Notes on requirements
You need to click on the back button of the browser to go back to previous step. (I didn't put a button inside the App because it's not really an ATM feature).
## ATM Flow
 1. Click on "_Insert card_"
 2. You are presented with a keyboard to enter your PIN
    - The input to this field is validated (Format, length)
 3. Click on Validate
    - if PIN incorrect (!= 1234) an error is shown and you are prompted to retry
    - if PIN correct App moves to next step
 4. You can now select an amount either by clickin on the number on the keypad or clicking on one of the options
    - Amount has to be a multiple of 10, more than 0 and less than 10000
5. Click on validate
     - if amount invalid an error is displayed
    - if amount valid App moves to next step
6. Wait screen
7. Take your money and card screen
    - Once you click on take back card, APP goes back to first page and you can start again.

A click on the clear button on the keypad will empty the input, whereas a click on the cancel button will present the user with a goodbye screen and be prompter to take his card back.

## Known issues
- I developed this ATM for modern browsers, more specifically the ones supporting flexbox (http://caniuse.com/#feat=flexbox), it probably won't work On IE
- By using the back button or accessing directly a URL with a hash you can run into some flow issues (no card in the atm if you skip first step so you will see on goodbye page "Insert card" instead of take card).

Thanks for reading!

