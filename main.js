var requirejs = require('requirejs');
const express = require('express');
const app = express();
const port = 3000;
const { render } = requirejs("node-sass");

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

//the everything
let state = {}
document.addEventListener('DOMContentLoaded', () => {
    const c = calendarInit();
    renderMonth(c.month, c.year);
})
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

        state.time = new ShrekTime(query);
        try {
            const input = state.time.findTime(query)
            const shreked = state.time.convertTime(input);
            console.log(shreked)
            console.log(state)
            clearInput();
            //clear old results
            clearResults();
        } catch (err) {
            console.log(err);
            alert('Please enter a time value!');
        }

        const cal = calendarInit();
        console.log(cal);
        //remove user entry from form

        clearInput();
        //clear old results
        clearResults();
    }
};

/* #783392 RESULTS FUNCTIONS*/
const resultsController = () => {

    const showResults = () => {
        const markup = `<h3 class="results__time">${state.time.input} hours is ${state.time.sh} Shrek Hours.</h3>`;

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

        const SY = () => { return this.seconds / 31536000 };
        const SM = () => { return this.seconds / 262800 };
        const SW = () => { return this.seconds / 788400 };
        const SD = () => { return this.seconds / 86400 };
        const SH = () => { return this.seconds / 5400 };
        //check time by size

        if (this.seconds >= 31536000) { //example 8800
            //do years
            return this.sy = SY(),
                this.sm = SM(),
                this.sw = SW(),
                this.sd = SD(),
                this.sh = SH();

        } else if (2628000 <= Math.abs(this.seconds) && Math.abs(this.seconds) < 31536000) { //example 750
            //do months
            return this.sm = SM(),
                this.sw = SW(),
                this.sd = SD(),
                this.sh = SH();

        } else if (788400 <= Math.abs(this.seconds) && Math.abs(this.seconds) < 2628000) {
            //do weeks
            return this.sw = SW(),
                this.sd = SD(),
                this.sh = SH();

        } else if (86400 <= Math.abs(this.seconds) && Math.abs(this.seconds) < 788400) { //example: 36
            //do days
            return this.sd = SD(),
                this.sh = SH();

        } else if (Math.abs(this.seconds) < 86400) { //example: 1 hr
            //do hours
            return this.sh = SH();
        }
    };
}

/* initial calendar setup. gets days month year etc*/
const calendarInit = () => {
    const currDate = new Date();
    const monthStart = currDate.getDay();
    const month = currDate.getMonth();
    const year = currDate.getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();

    return {
        date: currDate,
        days: daysInMonth,
        start: monthStart,
        month: month,
        year: year
    }
}

//put calendar on page input is month(int) and year (int)
renderMonth = (month, year) => {

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


    const markup = `
        <li class="prev"><a href="#" class="month__arrow">&#10094;</a></li>
        <li>${months[month]}<br><span style="font-size:18px">${year}</span></li>
        <li class="next"><a href="#" class="month__arrow">&#10095;</a></li>
        `;

    DOMStrings.monthDisplay.innerHTML = markup;
};

calenderArrows = () => {

};

renderDays = (start, noDays, current) => {
    // start on 'start' day fill in blanks before
    // make markup for each day in month

    // post markup to page

    //
};
// const cal = calendarInit();
// renderMonth(cal.month, cal.year)
// // renderDays(start, days, current)
// console.log(cal)