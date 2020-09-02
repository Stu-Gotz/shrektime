import moment from 'moment';
//the everything
let state = {}

//Eventually make it babel-ized but for now function > form

/* #783392 What does the app do?

- Recieves user input. Either from date input or calendar
- toggle US format and Non-US
- keep track of current time at bottom
- handle animations?

*/

/* Less document.queryselector more space*/
const DOMStrings = {
    inputField: document.querySelector('.user-input__field'),
    resultsField: document.querySelector('.results'),
    submitInput: document.querySelector('.btn__submit'),
    hideGif: document.querySelector('.btn__hide-gif'),
    monthDisplay: document.querySelector('.month__display'),
    daysDisplay: document.querySelector('.days'),
}


/* manage fields */
const getInput = () => DOMStrings.inputField.value;
const clearInput = () => DOMStrings.inputField.value = '';
const clearResults = () => DOMStrings.resultsField.textContent = '';

/* #783392 INPUT FUNCTIONS*/
const inputController = () => {
    //get user input
    const query = getInput();

    //handle the input field 


    if (query) {

        state.input = new ShrekTime(query);
        try {
            const input = state.input.findTime(query)
            const shreked = state.input.convertTime(input);

            clearInput();
            //clear old results
            clearResults();
        } catch (err) {
            console.log(err);
            alert('Please enter a time value!');
        }
        //remove user entry from form

        const input = state.input.findTime(query)
        const shreked = state.input.convertTime(input);

        clearInput();
        //clear old results
        clearResults();
    }
};

/* #783392 RESULTS FUNCTIONS*/
const resultsController = () => {

    const showResults = () => {
        const markup = `<h3 class="results__time">${state.input.input} hours is ${state.input.sh} Shrek Hours.</h3>`;

        DOMStrings.resultsField.insertAdjacentHTML('afterbegin', markup);
    };
    showResults();
    // clearResults = () => {
    //     const markup = `<h3 class="results__time"></h3>`;

    //     DOMStrings.resultsField.insertAdjacentHTML('afterbegin', markup);
    // };
};

// #783392 submit button function
DOMStrings.submitInput.addEventListener('click', e => {
    if (state) {
        state = {};
    };
    e.preventDefault();
    inputController();
    resultsController();
});

DOMStrings.hideGif.addEventListener('click', () => {
    const gif = document.getElementById('side-gif');
    gif.style.backgroundImage = "none";
    gif.style.backgroundColor = "transparent";
});

/* Math functions */
/* 1 ShrekHour (sh) = 1.5 hours = 90 min = 5400 sec
   1 ShrekDay (sd) = 16 sh = 24 hours = 1440 min = 86400 sec
   1 ShrekWeek (sw) = 146 sh = 219 hours = 13140 min = 788400 sec
   1 ShrekMonth (sm) = 584 Sh = 876 hours = 52560 min = 3153600 sec 
   1 ShrekYear (sy) = 5840sh = 8760 hours = 525600 min = 31536000 sec
   
   dawn of time (year 0) = 2001. First day is 11 Apr 2001
   beforeShrek (BS) is any year before that year. */

/* #783392 Main Class */
class ShrekTime {
    constructor(input) {
        this.input = input; //user input time
    }

    //change time to seconds
    findTime(text) {
        //^\d{1,}:(?:[0-5]\d):(?:[0-5]\d) time validation regex
        text = this.input; //either whole hour or hours:seconds
        const timeArr = text.split(':')

        let totalSeconds;
        if (timeArr.length > 1) {
            const hours = parseInt(timeArr[0], 10);
            const minutes = parseInt(timeArr[1], 10);

            totalSeconds = (hours * 3600) + (minutes * 60);
            return this.seconds = totalSeconds;
        } else {
            const hours = parseInt(timeArr[0], 10);
            totalSeconds = hours * 3600;
            return this.seconds = totalSeconds;
        }
    };

    //change seconds back to shrek time
    convertTime() {
        //convert
        const seconds = this.seconds;
        //shrek time vars
        let sh, sd, sm, sy, sw;

        const SY = () => { return Math.round(seconds / 31536000) };
        const SM = () => { return Math.round(seconds / 262800) };
        const SW = () => { return Math.round(seconds / 788400) };
        const SD = () => { return Math.round(seconds / 86400) };
        const SH = () => { return Math.round(seconds / 5400) };
        //check time by size

        if (seconds >= 31536000) { //example 8800
            //do years
            return this.sy = SY(),
                this.sm = SM(),
                this.sw = SW(),
                this.sd = SD(),
                this.sh = SH();

        } else if (2628000 <= Math.abs(seconds) && Math.abs(seconds) < 31536000) { //example 750
            //do months
            return this.sm = SM(),
                this.sw = SW(),
                this.sd = SD(),
                this.sh = SH();

        } else if (788400 <= Math.abs(seconds) && Math.abs(seconds) < 2628000) {
            //do weeks
            return this.sw = SW(),
                this.sd = SD(),
                this.sh = SH();

        } else if (86400 <= Math.abs(seconds) && Math.abs(seconds) < 788400) { //example: 36
            //do days
            return this.sd = SD(),
                this.sh = SH();

        } else if (Math.abs(seconds) <= 86400) { //example: 1 hr
            //do hours
            return this.sh = SH();
        }
    };
}

const CalendarOutput = class {
    constructor() {
        this.currDate = Date.now()
    }

    //display calendar to page
    /* get day*/
    renderCalender() {
        //Arrays of the month strings
        const months = ['Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'];

        const monthStart = this.currDate.getDay();
        console.log(monthStart);

        const daysInMonth = 32 - (this.currDate.getDate());
        console.log(daysInMonth);
        const daysToMonths = {
            thirtyone: ['Jan',
                'Mar',
                'May',
                'Jul',
                'Aug',
                'Oct',
                'Dec'],
            twentyeight: 'Feb',
            thirty: ['Apr',
                'Jun',
                'Sep',
                'Nov']
        };


        const renderDisplay = () => {
            const markup = `
            <li class="prev"><a href="#" class="month__arrow">&#10094;</a></li>
            <li>${months[month - 1]}<br><span style="font-size:18px">${year}</span></li>
            <li class="next"><a href="#" class="month__arrow">&#10095;</a></li>
            `;

            DOMStrings.monthDisplay.innerHTML = markup;
        };

        return {
            month: months[month - 1],
            year: year,
            noDays: daysInMonth,

        };
    };
}




const c = new CalendarOutput();
c.renderCalender();
c.renderCalender().renderDisplay();
console.log(c)