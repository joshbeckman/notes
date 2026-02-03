---
layout: Page
title: Settings
permalink: "/settings/"
emoji: "⚙️"
tags: index
toc: true
searchable: true
---

Your preferences are stored in your browser's localStorage and apply only to this device.

## Remote Sync (Optional)

Load settings from a JSON file you control (e.g., GitHub Gist raw URL):

<div class="settings-remote">
    <div class="settings-field">
        <label for="settings-remote-url">Remote URL</label>
        <input type="url" id="settings-remote-url" placeholder="https://gist.githubusercontent.com/..." />
    </div>
    <button id="settings-load-remote" type="button">Load from Remote</button>
    <div id="settings-sync-status" class="settings-status"></div>
</div>

<details class="settings-export">
    <summary>Export Settings</summary>
    <p>Copy this JSON to save in a Gist or other file for syncing across devices:</p>
    <textarea id="settings-export-json" readonly rows="8"></textarea>
    <button id="settings-copy-export" type="button">Copy to Clipboard</button>
</details>

## Appearance

<div class="settings-field">
    <label for="settings-color-scheme">Color scheme</label>
    <select id="settings-color-scheme">
        <option value="system">System default</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
    </select>
</div>
<p class="small">Override system preference for light or dark mode.</p>

<div class="settings-field">
    <label for="settings-custom-color">Custom accent color</label>
    <input type="color" id="settings-custom-color" value="#903465" />
    <input type="text" id="settings-custom-color-hex" placeholder="#903465" maxlength="7" />
</div>
<p class="small">Overrides the default site accent color used for borders and highlights.</p>

<div class="settings-field settings-checkbox">
    <input type="checkbox" id="settings-reduce-motion" />
    <label for="settings-reduce-motion">Reduce motion</label>
</div>
<p class="small">Disables the logo drawing animation.</p>

## Privacy

<div class="settings-field settings-checkbox">
    <input type="checkbox" id="settings-disable-analytics" />
    <label for="settings-disable-analytics">Disable analytics</label>
</div>
<p class="small">Prevents GoatCounter from tracking page views. Takes effect on next page load.</p>

## Social

<div class="settings-field settings-checkbox">
    <input type="checkbox" id="settings-disable-social" />
    <label for="settings-disable-social">Disable social data loading</label>
</div>
<p class="small">Stops fetching Mastodon/Bluesky/HN engagement counts on post pages.</p>

<div class="settings-field">
    <label for="settings-mastodon-instance">Your Mastodon instance</label>
    <input type="text" id="settings-mastodon-instance" placeholder="fosstodon.org" />
</div>
<p class="small">Opens Mastodon links on your home instance for easier interaction.</p>

---

<div class="settings-actions">
    <button id="settings-save" type="button">Save Settings</button>
    <button id="settings-reset" type="button">Reset to Defaults</button>
</div>

<div id="settings-save-status" class="settings-status"></div>

<script src="/assets/js/settings.js"></script>
<script>
(function() {
    'use strict';

    var elements = {
        remoteUrl: document.getElementById('settings-remote-url'),
        loadRemote: document.getElementById('settings-load-remote'),
        syncStatus: document.getElementById('settings-sync-status'),
        exportJson: document.getElementById('settings-export-json'),
        copyExport: document.getElementById('settings-copy-export'),
        colorScheme: document.getElementById('settings-color-scheme'),
        customColor: document.getElementById('settings-custom-color'),
        customColorHex: document.getElementById('settings-custom-color-hex'),
        reduceMotion: document.getElementById('settings-reduce-motion'),
        disableAnalytics: document.getElementById('settings-disable-analytics'),
        disableSocial: document.getElementById('settings-disable-social'),
        mastodonInstance: document.getElementById('settings-mastodon-instance'),
        saveBtn: document.getElementById('settings-save'),
        resetBtn: document.getElementById('settings-reset'),
        saveStatus: document.getElementById('settings-save-status')
    };

    function populateForm(settings) {
        elements.remoteUrl.value = settings.remoteUrl || '';
        elements.colorScheme.value = settings.colorScheme || 'system';
        elements.reduceMotion.checked = settings.reduceMotion || false;
        elements.disableAnalytics.checked = settings.disableAnalytics || false;
        elements.disableSocial.checked = settings.disableSocialLoading || false;
        elements.mastodonInstance.value = settings.mastodonInstance || '';

        var color = settings.customColor || '#903465';
        if (color.indexOf('#') !== 0) {
            color = '#' + color;
        }
        elements.customColor.value = color;
        elements.customColorHex.value = color;

        updateExportJson(settings);
        updateSyncStatus(settings);
    }

    function getFormValues() {
        var color = elements.customColorHex.value || elements.customColor.value;
        if (color && color.indexOf('#') === 0) {
            color = color.substring(1);
        }

        return {
            remoteUrl: elements.remoteUrl.value || null,
            colorScheme: elements.colorScheme.value || 'system',
            customColor: color || null,
            reduceMotion: elements.reduceMotion.checked,
            disableAnalytics: elements.disableAnalytics.checked,
            disableSocialLoading: elements.disableSocial.checked,
            mastodonInstance: elements.mastodonInstance.value || null
        };
    }

    function updateExportJson(settings) {
        var exportable = {
            colorScheme: settings.colorScheme,
            customColor: settings.customColor,
            reduceMotion: settings.reduceMotion,
            disableAnalytics: settings.disableAnalytics,
            disableSocialLoading: settings.disableSocialLoading,
            mastodonInstance: settings.mastodonInstance,
            savedAt: settings.savedAt
        };
        elements.exportJson.value = JSON.stringify(exportable, null, 2);
    }

    function updateSyncStatus(settings) {
        if (!settings.savedAt) {
            elements.syncStatus.innerHTML = 'No settings saved yet';
            elements.syncStatus.className = 'settings-status';
            return;
        }

        var timeEl = document.createElement('time');
        timeEl.id = 'settings-sync-time';
        timeEl.className = 'time-relative';
        timeEl.setAttribute('datetime', settings.savedAt);
        timeEl.title = new Date(settings.savedAt).toLocaleString();
        timeEl.textContent = timeAgo(new Date(settings.savedAt));

        elements.syncStatus.innerHTML = '✓ Last saved: ';
        elements.syncStatus.appendChild(timeEl);
        elements.syncStatus.className = 'settings-status settings-status-success';
    }

    function showSaveStatus(message, isError) {
        elements.saveStatus.textContent = message;
        elements.saveStatus.className = 'settings-status ' + (isError ? 'settings-status-error' : 'settings-status-success');
        setTimeout(function() {
            elements.saveStatus.textContent = '';
            elements.saveStatus.className = 'settings-status';
        }, 3000);
    }

    elements.customColor.addEventListener('input', function() {
        elements.customColorHex.value = this.value;
    });

    elements.customColorHex.addEventListener('input', function() {
        var val = this.value;
        if (val.match(/^#[0-9A-Fa-f]{6}$/)) {
            elements.customColor.value = val;
        }
    });

    elements.loadRemote.addEventListener('click', function() {
        var url = elements.remoteUrl.value;
        if (!url) {
            showSaveStatus('Please enter a remote URL', true);
            return;
        }

        elements.syncStatus.innerHTML = 'Loading...';
        elements.syncStatus.className = 'settings-status';

        JoshSettings.fetchRemote(url)
            .then(function(remoteSettings) {
                var currentSettings = JoshSettings.load();
                var merged = Object.assign({}, currentSettings, remoteSettings, { remoteUrl: url });

                if (remoteSettings.savedAt && currentSettings.savedAt) {
                    var remoteDate = new Date(remoteSettings.savedAt);
                    var localDate = new Date(currentSettings.savedAt);

                    if (remoteDate > localDate) {
                        elements.syncStatus.innerHTML = '⚠ Remote is newer. Form updated with remote values.';
                        elements.syncStatus.className = 'settings-status settings-status-warning';
                    } else if (localDate > remoteDate) {
                        elements.syncStatus.innerHTML = '⚠ Local is newer. Update your remote file with the export below.';
                        elements.syncStatus.className = 'settings-status settings-status-warning';
                        merged = Object.assign({}, currentSettings, { remoteUrl: url });
                    }
                }

                populateForm(merged);
                showSaveStatus('Remote settings loaded', false);
            })
            .catch(function(err) {
                console.error('Error loading remote settings:', err);
                elements.syncStatus.innerHTML = '✗ Failed to load remote settings';
                elements.syncStatus.className = 'settings-status settings-status-error';
            });
    });

    elements.copyExport.addEventListener('click', function() {
        elements.exportJson.select();
        navigator.clipboard.writeText(elements.exportJson.value).then(function() {
            showSaveStatus('Copied to clipboard', false);
        }).catch(function() {
            showSaveStatus('Failed to copy', true);
        });
    });

    elements.saveBtn.addEventListener('click', function() {
        var settings = Object.assign({}, JoshSettings.load(), getFormValues());
        if (JoshSettings.save(settings)) {
            JoshSettings.apply(settings);
            updateExportJson(settings);
            updateSyncStatus(settings);
            showSaveStatus('Settings saved', false);
        } else {
            showSaveStatus('Failed to save settings', true);
        }
    });

    elements.resetBtn.addEventListener('click', function() {
        if (confirm('Reset all settings to defaults?')) {
            JoshSettings.reset();
            populateForm(JoshSettings.DEFAULTS);
            showSaveStatus('Settings reset to defaults', false);
        }
    });

    var settings = JoshSettings.load();
    populateForm(settings);
})();
</script>
