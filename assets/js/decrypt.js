(function() {
    'use strict';

    var STORAGE_PREFIX = 'joshbeckman_encrypted:';
    var ITERATIONS = 100000;
    var VERIFY_LENGTH = 8;
    var markedLoaded = false;

    function getStorageKey(keyId) {
        return STORAGE_PREFIX + keyId;
    }

    function isCachingEnabled() {
        return window.JoshSettings && window.JoshSettings.shouldCacheDecryptionPassphrase();
    }

    function getCachedPassphrase(keyId) {
        if (!isCachingEnabled()) {
            return null;
        }
        try {
            return sessionStorage.getItem(getStorageKey(keyId));
        } catch (e) {
            return null;
        }
    }

    function cachePassphrase(keyId, passphrase) {
        if (!isCachingEnabled()) {
            return;
        }
        try {
            sessionStorage.setItem(getStorageKey(keyId), passphrase);
        } catch (e) {
            console.error('Error caching passphrase:', e);
        }
    }

    function loadMarked() {
        return new Promise(function(resolve) {
            if (markedLoaded || window.marked) {
                markedLoaded = true;
                resolve();
                return;
            }
            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
            script.onload = function() {
                markedLoaded = true;
                resolve();
            };
            document.head.appendChild(script);
        });
    }

    function renderMarkdown(markdown) {
        if (window.marked) {
            return window.marked.parse(markdown);
        }
        return '<pre>' + markdown.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>';
    }

    function base64ToArrayBuffer(base64) {
        var binary = atob(base64);
        var bytes = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }

    function hexEncode(buffer) {
        var bytes = new Uint8Array(buffer);
        var hex = '';
        for (var i = 0; i < bytes.length; i++) {
            hex += bytes[i].toString(16).padStart(2, '0');
        }
        return hex;
    }

    async function deriveKey(passphrase, salt) {
        var encoder = new TextEncoder();
        var passphraseKey = await crypto.subtle.importKey(
            'raw',
            encoder.encode(passphrase),
            'PBKDF2',
            false,
            ['deriveBits', 'deriveKey']
        );

        return crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: ITERATIONS,
                hash: 'SHA-256'
            },
            passphraseKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['decrypt']
        );
    }

    async function computeVerifyHash(passphrase, salt) {
        var encoder = new TextEncoder();
        var saltBytes = new Uint8Array(salt);
        var passphraseBytes = encoder.encode(passphrase);
        var combined = new Uint8Array(passphraseBytes.length + saltBytes.length);
        combined.set(passphraseBytes);
        combined.set(saltBytes, passphraseBytes.length);

        var hashBuffer = await crypto.subtle.digest('SHA-256', combined);
        return hexEncode(hashBuffer).substring(0, VERIFY_LENGTH);
    }

    async function decryptContent(payload, passphrase) {
        var salt = base64ToArrayBuffer(payload.salt);
        var iv = base64ToArrayBuffer(payload.iv);
        var ciphertext = base64ToArrayBuffer(payload.ciphertext);

        var verify = await computeVerifyHash(passphrase, salt);
        if (verify !== payload.verify) {
            throw new Error('Wrong passphrase');
        }

        var key = await deriveKey(passphrase, salt);

        var decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: new Uint8Array(iv) },
            key,
            ciphertext
        );

        return new TextDecoder().decode(decrypted);
    }

    function createInlineForm(element, keyId, payload) {
        var container = document.createElement('div');
        container.className = 'decrypt-form-container';

        var description = document.createElement('p');
        description.textContent = 'This content is encrypted. Enter the passphrase to decrypt.';

        var form = document.createElement('form');
        form.className = 'decrypt-form';

        var input = document.createElement('input');
        input.type = 'password';
        input.placeholder = 'Passphrase';
        input.autocomplete = 'off';
        input.id = 'decrypt-input';

        var button = document.createElement('button');
        button.type = 'submit';
        button.textContent = 'Decrypt';

        form.appendChild(input);
        form.appendChild(button);

        var error = document.createElement('p');
        error.className = 'decrypt-error';

        var settingsHint = document.createElement('p');
        settingsHint.className = 'decrypt-hint small';
        settingsHint.innerHTML = '<a href="/settings#privacy">Enable caching</a> to avoid re-entering.';


        container.appendChild(description);
        container.appendChild(form);
        container.appendChild(error);
        if (!isCachingEnabled()) {
            container.appendChild(settingsHint);
        }

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            var passphrase = input.value;
            if (!passphrase) return;

            button.disabled = true;
            button.textContent = 'Decrypting...';
            error.textContent = '';
            error.style.display = 'none';

            try {
                var decrypted = await decryptContent(payload, passphrase);
                cachePassphrase(keyId, passphrase);
                await loadMarked();
                element.innerHTML = renderMarkdown(decrypted);
                element.classList.remove('encrypted-content');
                element.classList.add('decrypted-content');
            } catch (err) {
                error.textContent = err.message === 'Wrong passphrase'
                    ? 'Wrong passphrase. Please try again.'
                    : 'Decryption failed: ' + err.message;
                error.style.display = 'block';
                button.disabled = false;
                button.textContent = 'Decrypt';
                input.value = '';
                input.focus();
            }
        });

        element.innerHTML = '';
        element.appendChild(container);
        input.focus();
    }

    async function processEncryptedElement(element) {
        var keyId = element.dataset.keyId;
        var scriptTag = element.querySelector('script.encrypted-payload');
        if (!scriptTag) {
            console.error('No encrypted payload found');
            return;
        }
        var payloadText = scriptTag.textContent.trim();
        var payload;

        try {
            payload = JSON.parse(payloadText);
        } catch (e) {
            console.error('Failed to parse encrypted payload:', e);
            return;
        }

        scriptTag.remove();

        var cachedPassphrase = getCachedPassphrase(keyId);
        if (cachedPassphrase) {
            try {
                var decrypted = await decryptContent(payload, cachedPassphrase);
                await loadMarked();
                element.innerHTML = renderMarkdown(decrypted);
                element.classList.remove('encrypted-content');
                element.classList.add('decrypted-content');
                return;
            } catch (e) {
                sessionStorage.removeItem(getStorageKey(keyId));
            }
        }

        createInlineForm(element, keyId, payload);
    }

    function init() {
        var elements = document.querySelectorAll('.encrypted-content');
        elements.forEach(processEncryptedElement);
    }

    window.JoshDecrypt = {
        init: init,
        decrypt: decryptContent,
        getCachedPassphrase: getCachedPassphrase,
        cachePassphrase: cachePassphrase
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
