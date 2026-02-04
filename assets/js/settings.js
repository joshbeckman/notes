(function() {
    'use strict';

    var STORAGE_KEY = 'joshbeckman_settings';
    var DEFAULT_SETTINGS = {
        remoteUrl: null,
        savedAt: null,
        customColor: null,
        disableSocialLoading: false,
        mastodonInstance: null,
        colorScheme: 'system',
        reduceMotion: false,
        disableAnalytics: false,
        cacheDecryptionPassphrase: false
    };

    function loadSettings() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(stored));
            }
        } catch (e) {
            console.error('Error loading settings:', e);
        }
        return Object.assign({}, DEFAULT_SETTINGS);
    }

    function saveSettings(settings) {
        try {
            settings.savedAt = new Date().toISOString();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            return true;
        } catch (e) {
            console.error('Error saving settings:', e);
            return false;
        }
    }

    function fetchRemoteSettings(url) {
        return fetch(url, { mode: 'cors' })
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Failed to fetch remote settings');
                }
                return response.json();
            });
    }

    function applySettings(settings) {
        if (!settings) {
            settings = loadSettings();
        }
        if (settings.customColor) {
            var color = settings.customColor;
            if (color.indexOf('#') !== 0) {
                color = '#' + color;
            }
            document.documentElement.style.setProperty('--c-josh', color);
            var themeColorMeta = document.querySelector('meta[name="theme-color"]');
            if (themeColorMeta) {
                themeColorMeta.setAttribute('content', color);
            }
        }

        document.documentElement.removeAttribute('data-color-scheme');
        if (settings.colorScheme && settings.colorScheme !== 'system') {
            document.documentElement.setAttribute('data-color-scheme', settings.colorScheme);
        }

        if (settings.reduceMotion) {
            document.documentElement.setAttribute('data-reduce-motion', 'true');
        } else {
            document.documentElement.removeAttribute('data-reduce-motion');
        }

        window.joshbeckmanSettings = settings;
    }

    function shouldLoadAnalytics() {
        var settings = loadSettings();
        return !settings.disableAnalytics;
    }

    function shouldLoadSocial() {
        var settings = loadSettings();
        return !settings.disableSocialLoading;
    }

    function getMastodonInstance() {
        var settings = loadSettings();
        return settings.mastodonInstance;
    }

    function shouldCacheDecryptionPassphrase() {
        var settings = loadSettings();
        return settings.cacheDecryptionPassphrase !== false;
    }

    function transformMastodonUrl(originalUrl, userInstance) {
        if (!userInstance || !originalUrl) {
            return originalUrl;
        }
        return 'https://' + userInstance + '/search?q=' + encodeURIComponent(originalUrl);
    }

    function resetSettings() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            document.documentElement.style.removeProperty('--c-josh');
            document.documentElement.removeAttribute('data-color-scheme');
            document.documentElement.removeAttribute('data-reduce-motion');
            var themeColorMeta = document.querySelector('meta[name="theme-color"]');
            if (themeColorMeta) {
                themeColorMeta.setAttribute('content', '#903465');
            }
            window.joshbeckmanSettings = Object.assign({}, DEFAULT_SETTINGS);
            return true;
        } catch (e) {
            console.error('Error resetting settings:', e);
            return false;
        }
    }

    window.JoshSettings = {
        load: loadSettings,
        save: saveSettings,
        fetchRemote: fetchRemoteSettings,
        apply: applySettings,
        shouldLoadSocial: shouldLoadSocial,
        shouldLoadAnalytics: shouldLoadAnalytics,
        shouldCacheDecryptionPassphrase: shouldCacheDecryptionPassphrase,
        getMastodonInstance: getMastodonInstance,
        transformMastodonUrl: transformMastodonUrl,
        reset: resetSettings,
        DEFAULTS: DEFAULT_SETTINGS
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            applySettings();
        });
    } else {
        applySettings();
    }
})();
