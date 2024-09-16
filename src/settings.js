// settings.js

const { ipcRenderer } = require('electron');
const Store = require('electron-store');
const store = new Store();

// 获取 HTML 元素
const autoStartCheckbox = document.getElementById('auto-start');
const saveButton = document.getElementById('save-settings');

window.addEventListener('DOMContentLoaded', () => {
    // 读取配置并设置 checkbox 状态
    const autoStart = store.get('autoStart', true);
    autoStartCheckbox.checked = autoStart;
});

saveButton.addEventListener('click', () => {
    const autoStart = autoStartCheckbox.checked;
    console.log('Saving settings:', { autoStart }); // 调试信息
    ipcRenderer.send('save-settings', { autoStart });
    alert('设置已保存！');
});
