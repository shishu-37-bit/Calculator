
const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");
const operators = ["+", "-", "*", "/", "%"];





function clearDisplay() {
    display.value = "";
}

function backspace() {
    display.value = display.value.slice(0, -1);
}

function appendValue(value) {
    display.value += value;
}





function isValidInput(value) {

    const lastChar = display.value.slice(-1);

    // Prevent two operators together
    if (
        operators.includes(value) &&
        operators.includes(lastChar)
    ) {
        return false;
    }

    // Prevent ".."
    if (
        value === "." &&
        lastChar === "."
    ) {
        return false;
    }

    return true;
}






function addHistory(expression, result) {

    const history = document.getElementById("history-list");

    if (history.innerHTML.includes("No calculations")) {
        history.innerHTML = "";
    }

    const item = document.createElement("div");

    item.className = "history-item";

    item.textContent = `${expression} = ${result}`;

    history.prepend(item);
}




async function calculate() {

    if (display.value === "") {
        return;
    }

    const expression = display.value;

    const response = await fetch("/calculate", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            expression: expression
        })

    });

    const data = await response.json();

    display.value = data.result;

    addHistory(expression, data.result);

}





buttons.forEach(button => {

    button.addEventListener("click", async () => {

        const value = button.dataset.value;

        switch (value) {

            case "C":
                clearDisplay();
                break;

            case "back":
                backspace();
                break;

            case "=":
                await calculate();
                break;

            default:

                if (isValidInput(value)) {
                    appendValue(value);
                }

        }

    });

});




document.addEventListener("keydown", async (event) => {

    const key = event.key;

    // Numbers
    if (!isNaN(key)) {
        appendValue(key);
        return;
    }

    // Operators
    if (operators.includes(key)) {

        if (isValidInput(key)) {
            appendValue(key);
        }

        return;
    }

    // Decimal
    if (key === ".") {

        if (isValidInput(".")) {
            appendValue(".");
        }

        return;
    }

    // Backspace
    if (key === "Backspace") {
        backspace();
        return;
    }

    // Escape
    if (key === "Escape") {
        clearDisplay();
        return;
    }

    // Enter
    if (key === "Enter") {
        await calculate();
        return;
    }

});



const themeButton = document.getElementById("theme-toggle");

// Load saved theme
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    themeButton.textContent = "☀️";
}

themeButton.addEventListener("click", () => {

    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {

        localStorage.setItem("theme", "light");
        themeButton.textContent = "☀️";

    } else {

        localStorage.setItem("theme", "dark");
        themeButton.textContent = "🌙";

    }

});