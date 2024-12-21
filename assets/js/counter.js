let counter = document.getElementById('counter');
let grow = document.getElementById('grow');
let kill = document.getElementById('kill');
let url = 'https://joshbeckman-counterservice.web.val.run';
let number = 0;
let interactionCount = 0;
(function updateCounter() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            animateCounterChange(number, data.number);
            number = data.number;
        });
})();
function animateCounterChange(startNumber, endNumber) {
    let start = Date.now();
    let end = start + 1000;
    function step() {
        let now = Date.now();
        let percent = (now - start) / (end - start);
        let value = Math.floor(startNumber + (endNumber - startNumber) * percent);
        counter.innerText = value.toLocaleString();
        if (now < end) {
            requestAnimationFrame(step);
        } else {
            counter.innerText = endNumber.toLocaleString();
        }
    }
    requestAnimationFrame(step);
}

grow.addEventListener('click', () => {
    interactionCount++;
    var growth = Math.floor(Math.random() * interactionCount);
    if (interactionCount > 1) {
        number = number + growth;
        counter.innerText = number;
        fetch(`${url}/set`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ number: number }),
        })
            .then(response => response.json())
            .then(data => {
                counter.innerText = data.number.toLocaleString();
                number = data.number;
            });
    } else {
        number = number + 1;
        counter.innerText = number;
        fetch(`${url}/increment`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                counter.innerText = data.number.toLocaleString();
                number = data.number;
            });
    }
});

kill.addEventListener('click', () => {
    if (!confirm('Are you sure you want to kill the counter?')) {
        return;
    }
    counter.innerText = 0;
    number = 0;
    interactionCount = 0;
    fetch(`${url}/reset`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            counter.innerText = data.number;
            number = data.number;
        });
});
