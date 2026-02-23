
let balance = 100;
let historyNumbers = [];
let isSpinning = false;

let rouletteOrder = [
    0, 32, 15, 19, 4, 21, 2, 25, 17,
    34, 6, 27, 13, 36, 11, 30, 8, 23,
    10, 5, 24, 16, 33, 1, 20, 14,
    31, 9, 22, 18, 29, 7, 28, 12,
    35, 3, 26
];

let spinButton = document.getElementById("spinBtn");
let betTypeSelect = document.getElementById("betType");
let numberInput = document.getElementById("chosenNumber");
let wheel = document.getElementById("wheel");


spinButton.addEventListener("click", spinRoulette);
betTypeSelect.addEventListener("change", toggleNumberInput);


function toggleNumberInput() {
    if (betTypeSelect.value === "number") {
        numberInput.style.display = "block";
    } else {
        numberInput.style.display = "none";
    }
}

function spinRoulette() {

    if (isSpinning) return;

    let name = document.getElementById("playerName").value;
    let betAmount = parseInt(document.getElementById("betAmount").value);

    if (!name || isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
        alert("Please enter a valid name and bet amount.");
        return;
    }

    isSpinning = true;
    spinButton.disabled = true;


    let randomIndex = Math.floor(Math.random() * rouletteOrder.length);
    let winningNumber = rouletteOrder[randomIndex];


    let degreePerSlot = 360 / rouletteOrder.length;
    let extraSpins = 6 * 360; 
    let finalRotation = extraSpins - (randomIndex * degreePerSlot);

    wheel.style.transform = "rotate(" + finalRotation + "deg)";

    setTimeout(function () {
        processResult(winningNumber, betAmount, name);
        isSpinning = false;
        spinButton.disabled = false;
    }, 4000);
}

function processResult(number, betAmount, name) {

    let betType = betTypeSelect.value;
    let chosenNumber = parseInt(numberInput.value);

    historyNumbers.unshift(number);

    if (historyNumbers.length > 5) {
        historyNumbers.pop();
    }

    let win = false;


    if (betType === "number" && number === chosenNumber) {
        win = true;
    }
    else if (betType === "even" && number !== 0 && number % 2 === 0) {
        win = true;
    }
    else if (betType === "odd" && number % 2 !== 0) {
        win = true;
    }
    else if (betType === "red" && isRed(number)) {
        win = true;
    }
    else if (betType === "black" && isBlack(number)) {
        win = true;
    }


    if (win) {

        if (betType === "number") {
            balance += betAmount * 5;
        } else {
            balance += betAmount;
        }

        document.body.style.backgroundColor = "green";

        document.getElementById("result").innerHTML =
            name + " WON! Winning number: " + number;

        document.getElementById("resultImage").src =
            "https://cdn-icons-png.flaticon.com/512/190/190411.png";

    } else {

        balance -= betAmount;

        document.body.style.backgroundColor = "darkred";

        document.getElementById("result").innerHTML =
            name + " LOST! Winning number: " + number;

        document.getElementById("resultImage").src =
            "https://cdn-icons-png.flaticon.com/512/463/463612.png";
    }

    document.getElementById("balance").innerHTML =
        "Balance: $" + balance;

    updateHistoryDisplay();

    // Fin de partie
    if (balance <= 0) {
        alert("Game Over!");
        spinButton.disabled = true;
    }
}


function isRed(num) {
    let redNumbers = [
        1,3,5,7,9,12,14,16,18,19,
        21,23,25,27,30,32,34,36
    ];
    return redNumbers.includes(num);
}


function isBlack(num) {
    let blackNumbers = [
        2,4,6,8,10,11,13,15,17,20,
        22,24,26,28,29,31,33,35
    ];
    return blackNumbers.includes(num);
}

function updateHistoryDisplay() {

    let historyDiv = document.getElementById("history");
    historyDiv.innerHTML = "";

    for (let i = 0; i < historyNumbers.length; i++) {

        let number = historyNumbers[i];

        let span = document.createElement("span");

        if (number === 0) {
            span.classList.add("green-text");
        }
        else if (isRed(number)) {
            span.classList.add("red-text");
        }
        else {
            span.classList.add("black-text");
        }

        span.textContent = number;

        historyDiv.appendChild(span);

        
        if (i < historyNumbers.length - 1) {
            historyDiv.innerHTML += " - ";
        }
    }
}