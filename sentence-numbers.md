---
layout: Page
title: Sentence Numbers
permalink: "/sentence-numbers/"
emoji: "🔢"
tags: index
serial_number: 2026.PAE.006
---

Encode numbers as memorable sentences and decode sentences back to numbers. Based on the [Asana article](https://asana.com/inside-asana/6-sad-squid-snuggle-softly) and inspired by [4 billion unique sentences](https://unsung.aresluna.org/4-billion-unique-and-sometimes-very-memorable-sentences/).

## How It Works

The algorithm uses three tiers for efficient encoding:

1. **Tiny numbers (0-32)**: Encoded as themselves (e.g., "15")
2. **Small numbers (33-4,128)**: Encoded as "N noun" (e.g., "6 cats", "12 birds")
3. **Large numbers (4,129+)**: Encoded as full sentences with the pattern "count adjective noun verb adverb" (e.g., "6 sad squid snuggle softly")

Each full sentence encodes 28 bits of information using four 128-word lists (7 bits each), allowing representation of numbers up to 268,435,455. For even larger numbers, multiple sentences can be chained with "and".

## Encode Number to Sentence

<form id="encode-form" class="sentence-form">
    <div class="settings-field">
        <label for="number-input">Enter a number</label>
        <input type="number" id="number-input" placeholder="62534" min="0" />
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

    // Word lists with 128 items each (7 bits per position)
    const WORD_LISTS = {
        adjective: [
            'happy', 'sad', 'angry', 'calm', 'brave', 'shy', 'loud', 'quiet', 'fast', 'slow',
            'bright', 'dark', 'warm', 'cool', 'soft', 'hard', 'smooth', 'rough', 'clean', 'dirty',
            'fresh', 'stale', 'young', 'old', 'new', 'ancient', 'modern', 'classic', 'simple', 'complex',
            'easy', 'hard', 'light', 'heavy', 'thin', 'thick', 'tall', 'short', 'wide', 'narrow',
            'deep', 'shallow', 'high', 'low', 'near', 'far', 'close', 'distant', 'early', 'late',
            'quick', 'lazy', 'active', 'passive', 'strong', 'weak', 'bold', 'timid', 'fierce', 'gentle',
            'wild', 'tame', 'free', 'bound', 'open', 'closed', 'full', 'empty', 'rich', 'poor',
            'busy', 'idle', 'noisy', 'silent', 'sharp', 'dull', 'sweet', 'bitter', 'sour', 'salty',
            'hot', 'cold', 'wet', 'dry', 'solid', 'liquid', 'dense', 'sparse', 'tight', 'loose',
            'firm', 'soft', 'rigid', 'flexible', 'stable', 'shaky', 'steady', 'wobbly', 'smooth', 'bumpy',
            'flat', 'curved', 'straight', 'bent', 'level', 'sloped', 'even', 'odd', 'round', 'square',
            'plain', 'fancy', 'bare', 'ornate', 'simple', 'elaborate', 'crude', 'refined', 'raw', 'cooked',
            'natural', 'artificial', 'real', 'fake', 'true', 'false', 'right', 'wrong'
        ],
        noun: [
            'cats', 'dogs', 'birds', 'squid', 'fish', 'bears', 'wolves', 'deer', 'owls', 'foxes',
            'lions', 'tigers', 'elephants', 'zebras', 'giraffes', 'monkeys', 'pandas', 'koalas', 'rabbits', 'mice',
            'rats', 'hamsters', 'guinea-pigs', 'ferrets', 'horses', 'cows', 'pigs', 'sheep', 'goats', 'chickens',
            'ducks', 'geese', 'turkeys', 'eagles', 'hawks', 'sparrows', 'robins', 'crows', 'ravens', 'parrots',
            'dolphins', 'whales', 'sharks', 'turtles', 'frogs', 'toads', 'snakes', 'lizards', 'crocodiles', 'alligators',
            'spiders', 'ants', 'bees', 'wasps', 'butterflies', 'moths', 'beetles', 'flies', 'mosquitoes', 'dragonflies',
            'trees', 'flowers', 'roses', 'tulips', 'daisies', 'sunflowers', 'orchids', 'lilies', 'violets', 'poppies',
            'mountains', 'valleys', 'rivers', 'lakes', 'oceans', 'forests', 'deserts', 'plains', 'hills', 'cliffs',
            'clouds', 'stars', 'moons', 'suns', 'planets', 'comets', 'asteroids', 'galaxies', 'nebulas', 'quasars',
            'books', 'pens', 'pencils', 'papers', 'notebooks', 'folders', 'binders', 'staplers', 'clips', 'erasers',
            'chairs', 'tables', 'desks', 'beds', 'sofas', 'benches', 'stools', 'shelves', 'cabinets', 'drawers',
            'doors', 'windows', 'walls', 'floors', 'ceilings', 'roofs', 'chimneys', 'porches', 'decks', 'patios',
            'cars', 'trucks', 'buses', 'trains', 'planes', 'boats', 'ships', 'bikes', 'scooters', 'skates'
        ],
        verb: [
            'run', 'jump', 'swim', 'fly', 'dance', 'snuggle', 'sleep', 'play', 'hunt', 'sing',
            'walk', 'skip', 'hop', 'crawl', 'climb', 'slide', 'roll', 'spin', 'twist', 'turn',
            'push', 'pull', 'lift', 'drop', 'throw', 'catch', 'kick', 'hit', 'punch', 'slap',
            'eat', 'drink', 'chew', 'swallow', 'taste', 'smell', 'sniff', 'breathe', 'inhale', 'exhale',
            'see', 'watch', 'look', 'stare', 'glance', 'peek', 'gaze', 'observe', 'notice', 'spot',
            'hear', 'listen', 'whisper', 'shout', 'scream', 'yell', 'call', 'speak', 'talk', 'chat',
            'read', 'write', 'draw', 'paint', 'sketch', 'color', 'trace', 'copy', 'erase', 'mark',
            'build', 'make', 'create', 'craft', 'construct', 'assemble', 'design', 'plan', 'arrange', 'organize',
            'break', 'tear', 'rip', 'cut', 'slice', 'chop', 'split', 'crack', 'smash', 'crush',
            'find', 'seek', 'search', 'hunt', 'discover', 'locate', 'track', 'follow', 'chase', 'pursue',
            'give', 'take', 'offer', 'receive', 'accept', 'reject', 'refuse', 'deny', 'grant', 'allow',
            'love', 'hate', 'like', 'dislike', 'enjoy', 'prefer', 'want', 'need', 'wish', 'hope',
            'think', 'know', 'learn', 'teach', 'study', 'remember', 'forget', 'recall'
        ],
        adverb: [
            'quickly', 'slowly', 'happily', 'sadly', 'softly', 'loudly', 'gracefully', 'clumsily', 'eagerly', 'lazily',
            'carefully', 'carelessly', 'gently', 'roughly', 'smoothly', 'awkwardly', 'easily', 'hardly', 'lightly', 'heavily',
            'quietly', 'noisily', 'silently', 'vocally', 'calmly', 'wildly', 'peacefully', 'violently', 'safely', 'dangerously',
            'warmly', 'coldly', 'hotly', 'coolly', 'brightly', 'dimly', 'clearly', 'vaguely', 'sharply', 'bluntly',
            'sweetly', 'bitterly', 'sourly', 'freshly', 'stalely', 'cleanly', 'dirtily', 'neatly', 'messily', 'tidily',
            'orderly', 'chaotically', 'randomly', 'systematically', 'regularly', 'irregularly', 'evenly', 'unevenly', 'smoothly', 'roughly',
            'firmly', 'loosely', 'tightly', 'slackly', 'rigidly', 'flexibly', 'stiffly', 'limply', 'steadily', 'shakily',
            'strongly', 'weakly', 'powerfully', 'feebly', 'boldly', 'timidly', 'bravely', 'cowardly', 'fiercely', 'meekly',
            'actively', 'passively', 'busily', 'idly', 'eagerly', 'reluctantly', 'willingly', 'unwillingly', 'gladly', 'sadly',
            'joyfully', 'sorrowfully', 'cheerfully', 'gloomily', 'optimistically', 'pessimistically', 'hopefully', 'hopelessly', 'positively', 'negatively',
            'kindly', 'cruelly', 'gently', 'harshly', 'tenderly', 'brutally', 'lovingly', 'hatefully', 'friendly', 'hostilely',
            'politely', 'rudely', 'respectfully', 'disrespectfully', 'formally', 'informally', 'seriously', 'playfully', 'solemnly', 'jovially',
            'wisely', 'foolishly', 'cleverly', 'stupidly', 'intelligently', 'ignorantly', 'smartly', 'dumbly'
        ]
    };

    const TINY_THRESHOLD = 32;
    const SMALL_THRESHOLD = 4128; // 33 + (32 * 128) - 1
    const SENTENCE_MAX = 268435455; // 2^28 - 1 (one full sentence)

    function encodeNumberToSentence(number) {
        // Tier 1: Tiny numbers (0-32) encode as themselves
        if (number <= TINY_THRESHOLD) {
            return String(number);
        }

        // Tier 2: Small numbers (33-4128) encode as "N noun"
        if (number <= SMALL_THRESHOLD) {
            const adjusted = number - 33; // Start from 0
            const count = Math.floor(adjusted / 128) + 1; // 1-32
            const nounIndex = adjusted % 128;
            return `${count} ${WORD_LISTS.noun[nounIndex]}`;
        }

        // Tier 3: Large numbers (4129+) encode as full sentences
        // For numbers beyond one sentence, chain with "and"
        const sentences = [];
        let remaining = number - SMALL_THRESHOLD - 1; // Adjust to start from 0

        while (remaining >= 0) {
            const sentenceValue = remaining % (SENTENCE_MAX + 1);

            // Extract 7-bit indices for each word position (total 28 bits)
            const adverbIndex = sentenceValue & 0x7F; // bits 0-6
            const verbIndex = (sentenceValue >> 7) & 0x7F; // bits 7-13
            const nounIndex = (sentenceValue >> 14) & 0x7F; // bits 14-20
            const adjectiveIndex = (sentenceValue >> 21) & 0x7F; // bits 21-27

            // Count is derived from adjective for consistency
            const count = (adjectiveIndex % 32) + 1; // 1-32

            const sentence = `${count} ${WORD_LISTS.adjective[adjectiveIndex]} ${WORD_LISTS.noun[nounIndex]} ${WORD_LISTS.verb[verbIndex]} ${WORD_LISTS.adverb[adverbIndex]}`;
            sentences.unshift(sentence); // Add to beginning

            remaining = Math.floor(remaining / (SENTENCE_MAX + 1)) - 1;
            if (remaining < 0) break;
        }

        return sentences.join(' and ');
    }

    function decodeSentenceToNumber(sentence) {
        const normalized = sentence.toLowerCase().trim();

        // Check if it's a chained sentence with "and"
        const parts = normalized.split(/\s+and\s+/);

        let total = 0;
        let multiplier = 1;

        // Process sentences from right to left (least significant first)
        for (let i = parts.length - 1; i >= 0; i--) {
            const part = parts[i].trim();
            const words = part.split(/\s+/);

            // Tier 1: Single number (0-32)
            if (words.length === 1) {
                const num = parseInt(words[0], 10);
                if (!isNaN(num) && num >= 0 && num <= TINY_THRESHOLD) {
                    if (parts.length > 1) {
                        throw new Error('Cannot chain simple numbers with "and"');
                    }
                    return num;
                }
                throw new Error(`Invalid single word: ${words[0]}`);
            }

            // Tier 2: "N noun" format (33-4128)
            if (words.length === 2) {
                const count = parseInt(words[0], 10);
                if (isNaN(count) || count < 1 || count > 32) {
                    throw new Error(`Invalid count in small number format: ${words[0]}`);
                }
                const nounIndex = WORD_LISTS.noun.indexOf(words[1]);
                if (nounIndex === -1) {
                    throw new Error(`Word "${words[1]}" not found in noun list`);
                }
                if (parts.length > 1) {
                    throw new Error('Cannot chain small number format with "and"');
                }
                return 33 + ((count - 1) * 128) + nounIndex;
            }

            // Tier 3: Full sentence format (4129+)
            if (words.length === 5) {
                const count = parseInt(words[0], 10);
                if (isNaN(count) || count < 1 || count > 32) {
                    throw new Error(`Invalid count: ${words[0]}`);
                }

                const adjectiveIndex = WORD_LISTS.adjective.indexOf(words[1]);
                const nounIndex = WORD_LISTS.noun.indexOf(words[2]);
                const verbIndex = WORD_LISTS.verb.indexOf(words[3]);
                const adverbIndex = WORD_LISTS.adverb.indexOf(words[4]);

                if (adjectiveIndex === -1) throw new Error(`Word "${words[1]}" not found in adjective list`);
                if (nounIndex === -1) throw new Error(`Word "${words[2]}" not found in noun list`);
                if (verbIndex === -1) throw new Error(`Word "${words[3]}" not found in verb list`);
                if (adverbIndex === -1) throw new Error(`Word "${words[4]}" not found in adverb list`);

                // Reconstruct the 28-bit value
                const sentenceValue = (adjectiveIndex << 21) | (nounIndex << 14) | (verbIndex << 7) | adverbIndex;

                total += sentenceValue * multiplier;
                multiplier *= (SENTENCE_MAX + 1);
                continue;
            }

            throw new Error(`Invalid sentence format: expected 1, 2, or 5 words, got ${words.length}`);
        }

        // Add base offset for large numbers
        if (parts.length > 0 && parts[parts.length - 1].split(/\s+/).length === 5) {
            total += SMALL_THRESHOLD + 1;
        }

        return total;
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
            displayResult(encodeResult, 'Error: Please enter a valid non-negative number', true);
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
