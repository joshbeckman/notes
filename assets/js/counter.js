let counter = document.getElementById('counter');
let grow = document.getElementById('grow');
let kill = document.getElementById('kill');
let url = 'https://joshbeckman-counterservice.web.val.run';
let number = 0;
let interactionCount = 0;
(function updateCounter() {
    fetch(`${url}/increment`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            animateCounterChange(number, data.number);
            number = data.number;
        });
})();
function formatCounter(number) {
    // left pad for 7 digits
    return number.toString().padStart(7, '_');
}
function animateCounterChange(startNumber, endNumber) {
    let start = Date.now();
    let end = start + 1000;
    function step() {
        let now = Date.now();
        let percent = (now - start) / (end - start);
        let value = Math.floor(startNumber + (endNumber - startNumber) * percent);
        counter.innerText = formatCounter(value);
        if (now < end) {
            requestAnimationFrame(step);
        } else {
            counter.innerText = formatCounter(endNumber);
        }
    }
    requestAnimationFrame(step);
}

grow.addEventListener('click', () => {
    interactionCount++;
    var growth = Math.floor(Math.random() * interactionCount);
    if (interactionCount > 1) {
        number = number + Math.max(1, growth);
        counter.innerText = formatCounter(number);
        fetch(`${url}/set`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ number: number }),
        })
            .then(response => response.json())
            .then(data => {
                animateCounterChange(number, data.number);
                number = data.number;
            })
            .catch(error => {
                alert('The counter is growing too quickly. Try again in a minute or so.');
            });
    } else {
        number = number + 1;
        counter.innerText = formatCounter(number);
        fetch(`${url}/increment`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                animateCounterChange(number, data.number);
                number = data.number;
            })
            .catch(error => {
                alert('The counter is growing too quickly. Try again in a minute or so.');
            });
    }
});

kill.addEventListener('click', () => {
    if (!confirm('Are you sure you want to kill the counter?')) {
        return;
    }
    counter.innerText = formatCounter(0);
    number = 0;
    interactionCount = 0;
    fetch(`${url}/reset`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            counter.innerText = formatCounter(data.number);
            number = data.number;
        });
});
