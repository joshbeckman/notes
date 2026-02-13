---
layout: Page
title: Sentence Numbers
permalink: "/sentence-numbers/"
emoji: "🔢"
tags: index
serial_number: 2026.PAE.006
---

Encode numbers as memorable sentences and decode sentences back to numbers. Based on the [Asana article](https://asana.com/inside-asana/6-sad-squid-snuggle-softly) and inspired by [4 billion unique sentences](https://unsung.aresluna.org/4-billion-unique-and-sometimes-very-memorable-sentences/).

## Encode Number to Sentence

<form id="encode-form" class="sentence-form">
    <div class="settings-field">
        <label for="number-input">Enter a number (5 digits max)</label>
        <input type="number" id="number-input" placeholder="62534" min="10000" max="99999" />
    </div>
    <button type="submit">Encode to Sentence</button>
</form>

<div id="encode-result" class="sentence-result"></div>

## Decode Sentence to Number

<form id="decode-form" class="sentence-form">
    <div class="settings-field">
        <label for="sentence-input">Enter a sentence</label>
        <input type="text" id="sentence-input" placeholder="6 sad squid snuggle softly" />
    </div>
    <button type="submit">Decode to Number</button>
</form>

<div id="decode-result" class="sentence-result"></div>

<script>
(function() {
    'use strict';

    // Word lists based on the "6 sad squid snuggle softly" pattern
    const WORD_LISTS = {
        count: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
        adjective: ['happy', 'sad', 'angry', 'calm', 'brave', 'shy', 'loud', 'quiet', 'fast', 'slow'],
        noun: ['cats', 'dogs', 'birds', 'squid', 'fish', 'bears', 'wolves', 'deer', 'owls', 'foxes'],
        verb: ['run', 'jump', 'swim', 'fly', 'dance', 'snuggle', 'sleep', 'play', 'hunt', 'sing'],
        adverb: ['quickly', 'slowly', 'happily', 'sadly', 'softly', 'loudly', 'gracefully', 'clumsily', 'eagerly', 'lazily']
    };

    function encodeNumberToSentence(number) {
        const numStr = String(number).padStart(5, '0');
        if (numStr.length !== 5) {
            throw new Error('Number must be 5 digits or less');
        }

        const digits = numStr.split('').map(d => parseInt(d, 10));
        const words = [
            WORD_LISTS.count[digits[0]],
            WORD_LISTS.adjective[digits[1]],
            WORD_LISTS.noun[digits[2]],
            WORD_LISTS.verb[digits[3]],
            WORD_LISTS.adverb[digits[4]]
        ];

        return `${digits[0]} ${words.slice(1).join(' ')}`;
    }

    function decodeSentenceToNumber(sentence) {
        const normalized = sentence.toLowerCase().trim();
        const words = normalized.split(/\s+/);

        if (words.length < 4 || words.length > 5) {
            throw new Error('Sentence must have 4-5 words (count adjective noun verb adverb)');
        }

        const digits = [];

        // First word should be a digit
        const countDigit = parseInt(words[0], 10);
        if (isNaN(countDigit) || countDigit < 0 || countDigit > 9) {
            // Try to find it in the count list
            const countIndex = WORD_LISTS.count.indexOf(words[0]);
            if (countIndex === -1) {
                throw new Error(`First word must be a digit or word for 0-9, got: ${words[0]}`);
            }
            digits.push(countIndex);
        } else {
            digits.push(countDigit);
        }

        // Find the remaining words in their respective lists
        const wordTypes = ['adjective', 'noun', 'verb', 'adverb'];
        for (let i = 0; i < wordTypes.length; i++) {
            const wordIndex = i + 1;
            if (wordIndex >= words.length) {
                throw new Error(`Missing ${wordTypes[i]} in sentence`);
            }
            const word = words[wordIndex];
            const list = WORD_LISTS[wordTypes[i]];
            const index = list.indexOf(word);
            if (index === -1) {
                throw new Error(`Word "${word}" not found in ${wordTypes[i]} list`);
            }
            digits.push(index);
        }

        return parseInt(digits.join(''), 10);
    }

    function createCopyButton(text) {
        const button = document.createElement('button');
        button.textContent = 'Copy';
        button.className = 'copy-button';
        button.addEventListener('click', function() {
            navigator.clipboard.writeText(text).then(function() {
                button.textContent = 'Copied!';
                if (window.goatcounter && window.goatcounter.count) {
                    window.goatcounter.count({ path: 'widget-sentence-copy', title: 'Copy sentence number', event: true });
                }
                setTimeout(function() {
                    button.textContent = 'Copy';
                }, 2000);
            }).catch(function(err) {
                console.error('Failed to copy text: ', err);
            });
        });
        return button;
    }

    function displayResult(resultDiv, text, isError) {
        resultDiv.innerHTML = '';
        resultDiv.className = 'sentence-result';

        if (isError) {
            resultDiv.className += ' sentence-result-error';
            resultDiv.textContent = text;
        } else {
            const wrapper = document.createElement('div');
            wrapper.className = 'sentence-result-wrapper';
            wrapper.style.position = 'relative';

            const pre = document.createElement('pre');
            pre.textContent = text;
            wrapper.appendChild(pre);

            const copyBtn = createCopyButton(text);
            wrapper.appendChild(copyBtn);

            resultDiv.appendChild(wrapper);
            resultDiv.className += ' sentence-result-success';
        }
    }

    // Handle encode form
    const encodeForm = document.getElementById('encode-form');
    const numberInput = document.getElementById('number-input');
    const encodeResult = document.getElementById('encode-result');

    encodeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const number = parseInt(numberInput.value, 10);

        if (isNaN(number) || number < 0) {
            displayResult(encodeResult, 'Error: Please enter a valid positive number', true);
            return;
        }

        if (number > 99999) {
            displayResult(encodeResult, 'Error: Number must be 5 digits or less (max: 99999)', true);
            return;
        }

        try {
            const sentence = encodeNumberToSentence(number);
            displayResult(encodeResult, sentence, false);

            // Update URL with query param
            const url = new URL(window.location);
            url.searchParams.set('number', number);
            url.searchParams.delete('sentence');
            window.history.pushState({}, '', url);
        } catch (err) {
            displayResult(encodeResult, 'Error: ' + err.message, true);
        }
    });

    // Handle decode form
    const decodeForm = document.getElementById('decode-form');
    const sentenceInput = document.getElementById('sentence-input');
    const decodeResult = document.getElementById('decode-result');

    decodeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const sentence = sentenceInput.value.trim();

        if (!sentence) {
            displayResult(decodeResult, 'Error: Please enter a sentence', true);
            return;
        }

        try {
            const number = decodeSentenceToNumber(sentence);
            displayResult(decodeResult, String(number), false);

            // Update URL with query param
            const url = new URL(window.location);
            url.searchParams.set('sentence', sentence);
            url.searchParams.delete('number');
            window.history.pushState({}, '', url);
        } catch (err) {
            displayResult(decodeResult, 'Error: ' + err.message, true);
        }
    });

    // Handle query parameters on page load
    function handleQueryParams() {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('number')) {
            const number = parseInt(urlParams.get('number'), 10);
            if (!isNaN(number)) {
                numberInput.value = number;
                encodeForm.dispatchEvent(new Event('submit'));
            }
        }

        if (urlParams.has('sentence')) {
            const sentence = urlParams.get('sentence');
            if (sentence) {
                sentenceInput.value = sentence;
                decodeForm.dispatchEvent(new Event('submit'));
            }
        }
    }

    // Run on page load
    handleQueryParams();
})();
</script>

<style>
.sentence-form {
    margin: 1rem 0;
}

.sentence-form .settings-field {
    margin-bottom: 1rem;
}

.sentence-form label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
}

.sentence-form input[type="number"],
.sentence-form input[type="text"] {
    width: 100%;
    max-width: 400px;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
}

.sentence-form button[type="submit"] {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
}

.sentence-result {
    margin: 1rem 0;
    min-height: 2rem;
}

.sentence-result-wrapper {
    position: relative;
    display: inline-block;
    min-width: 300px;
}

.sentence-result pre {
    padding: 1rem;
    background: var(--color-background-alt);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 1.1rem;
    margin: 0;
}

.sentence-result-success {
    color: var(--color-text);
}

.sentence-result-error {
    color: var(--color-error, #c00);
    font-weight: bold;
}

.sentence-result .copy-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
}
</style>
