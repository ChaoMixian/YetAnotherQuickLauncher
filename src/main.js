"use strict";

const { app, BrowserWindow, ipcMain, screen, Menu, Tray, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}


let mainWindow = null;
let settingsWindow = null;
let floatingBall = null
let tray = null;
let Store;
let store;

function setAutoStart(enable) {
  if (process.platform === 'win32') {
    // Windows 平台设置开机自启
    app.setLoginItemSettings({
      openAtLogin: enable,
      path: process.execPath
    });
  } else if (process.platform === 'linux') {
    // Linux 平台放弃了
  }
}


async function initConfig() {
  // 动态加载 electron-store
  Store = (await import('electron-store')).default;

  // 获取应用版本
  const appVersion = app.getVersion();

  // 定义默认配置
  let defaultConfig;  // 在函数作用域内声明 defaultConfig

  if (process.platform === "linux") {
    // Linux 的默认配置
    defaultConfig = {
      version: appVersion,
      autoStart: true,
      app: [
        {
          name: "希沃白板",
          icon: "../assets/Seewo.png",
          runCmd: "nautilus ~/Code"
        },
        {
          name: "Chinese",
          icon: "../assets/Chinese.png",
          runCmd: "nautilus ~/Code"
        },
        {
          name: "Math",
          icon: "../assets/Math.png",
          runCmd: "nautilus ~/Code"
        },
        {
          name: "English",
          icon: "../assets/English.png",
          runCmd: "nautilus ~/Code"
        },
        {
          name: "Physics",
          icon: "../assets/Physics.png",
          runCmd: "nautilus ~/Code"
        },
        {
          name: "Chemistry",
          icon: "../assets/Chemistry.png",
          runCmd: "nautilus ~/Code"
        },
        {
          name: "Biology",
          icon: "../assets/Biology.png",
          runCmd: "nautilus ~/Code"
        },
        {
          name: "Geography",
          icon: "../assets/Geography.png",
          runCmd: "nautilus ~/Code"
        }
      ]
    };
  } else if (process.platform === "win32") {
    // Windows 的默认配置
    defaultConfig = {
      version: appVersion,
      autoStart: true,
      app: [
        {
          name: "希沃白板",
          icon: "../assets/Seewo.png",
          runCmd: "explorer.exe C:\\Windows"
        },
        {
          name: "Chinese",
          icon: "../assets/Chinese.png",
          runCmd: "explorer.exe C:\\Windows"
        },
        {
          name: "Math",
          icon: "../assets/Math.png",
          runCmd: "explorer.exe C:\\Windows"
        },
        {
          name: "English",
          icon: "../assets/English.png",
          runCmd: "explorer.exe C:\\Windows"
        },
        {
          name: "Physics",
          icon: "../assets/Physics.png",
          runCmd: "explorer.exe C:\\Windows"
        },
        {
          name: "Chemistry",
          icon: "../assets/Chemistry.png",
          runCmd: "explorer.exe C:\\Windows"
        },
        {
          name: "Biology",
          icon: "../assets/Biology.png",
          runCmd: "explorer.exe C:\\Windows"
        },
        {
          name: "Geography",
          icon: "../assets/Geography.png",
          runCmd: "explorer.exe C:\\Windows"
        }
      ]
    };
  }

  // 创建 Store 实例并设置默认值
  store = new Store({
    defaults: defaultConfig // 使用默认配置
  });

  // 检查配置中的 autoStart 值
  const autoStart = store.get('autoStart', true); // 如果未设置，则默认为 true
  setAutoStart(autoStart); // 根据配置设置开机自启

  // 读取配置文件并发送给渲染进程
  const config = store.get('app') || [];
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('load-config', config);
  });

  console.log(store.get('version')); // 打印当前版本
}


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 211,
    frame: false, // 去掉窗口边框
    transparent: true, // 使窗口透明
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: true,
      nodeIntegration: true, // 确保 nodeIntegration 为 true
      contextIsolation: false, // 解决require is not defined
    },
    alwaysOnTop: false, // 不要置顶
    focusable: false,   // 不可聚焦
    skipTaskbar: true   // 不显示在任务栏
  });

  mainWindow.loadFile('src/index.html');

  // 获取屏幕的工作区域
  const { workArea } = screen.getPrimaryDisplay();
  const { width, height } = workArea;

  // 计算右上角的位置
  const x = width - mainWindow.getBounds().width;
  const y = height - mainWindow.getBounds().height;

  mainWindow.setBounds({
    x: x,
    y: y,
    width: mainWindow.getBounds().width,
    height: mainWindow.getBounds().height
  });
}

function createTray() {
  let icon;
  if (process.platform === 'linux') {
    icon = path.join(__dirname, '../assets/icon.png');
  } else if (process.platform === 'win32') {
    icon = path.join(__dirname, '../assets/icon.ico');
  }

  // 创建托盘实例
  tray = new Tray(icon);

  let menu = Menu.buildFromTemplate([
    {
      label: '开机启动',
      checked: app.getLoginItemSettings().openAtLogin, // 获取当前自启动状态
      type: 'checkbox',
      click: () => {
        const openAtLogin = !app.getLoginItemSettings().openAtLogin;
        if (!app.isPackaged) { // 生成环境
          app.setLoginItemSettings({
            openAtLogin,
            path: process.execPath
          });
        } else {
          app.setLoginItemSettings({ openAtLogin });
        }
      }
    },
    {
      label: '退出',
      click: () => app.quit()
    }
  ]);

  // 鼠标悬停时显示的文本
  tray.setToolTip('YAQL');
  // 设置上下文菜单
  tray.setContextMenu(menu);
  // 绑定点击事件：控制窗口显示和隐藏
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}



// 设置窗口
function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus(); // 如果窗口已经存在，聚焦它
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 400,
    height: 300,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  settingsWindow.loadFile('src/settings.html'); // 加载设置窗口的 HTML 文件
  settingsWindow.on('closed', () => {
    settingsWindow = null; // 窗口关闭时销毁引用
  });
}

function createFloatingBall() {
  floatingBall = new BrowserWindow({
    width: 50,
    height: 50,
    resizable: false,
    frame: false, // 去掉窗口边框
    transparent: true, // 使窗口透明
    resizable: false, // 禁止调整大小
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
    alwaysOnTop: false, // 不要置顶
    skipTaskbar: true   // 不显示在任务栏
  });

  floatingBall.loadFile('src/floatingBall.html'); // 加载设置窗口的 HTML 文件

  // 获取屏幕的工作区域
  const { workArea } = screen.getPrimaryDisplay();
  const { width, height } = workArea;

  // 计算右上角的位置
  const x = width - floatingBall.getBounds().width;
  const y = height - floatingBall.getBounds().height;

  floatingBall.setBounds({
    x: x,
    y: y,
    width: floatingBall.getBounds().width,
    height: floatingBall.getBounds().height
  });

  floatingBall.on('closed', () => {
    floatingBall = null; // 窗口关闭时销毁引用
  });
}


// 监听 IPC 事件
ipcMain.on('settings', () => {
  const configPath = path.join(app.getPath('userData'), 'config.json'); // 假设配置文件是 config.json
  if (process.platform === 'linux') {
    exec(`xdg-open "${configPath}"`, (error) => {
      if (error) {
        console.error(`打开文件出错: ${error.message}`);
      }
    });
  } else if (process.platform === 'win32') {
    exec(`"${configPath}"`, (error) => {
      if (error) {
        console.error(`打开文件出错: ${error.message}`);
      }
    });
  }
  // createSettingsWindow();
});

ipcMain.on('minimize', () => {
  mainWindow.hide();
  createFloatingBall();
});

ipcMain.on('maximize', () => {
  if (floatingBall) {
    floatingBall.close(); // 关闭悬浮球
  }
  if (mainWindow) {
    mainWindow.show(); // 显示主窗口
  }
});

ipcMain.on('close', () => {
  app.quit(); // 退出应用
});

ipcMain.on('save-settings', (event, settings) => {
  console.log('保存设置:', settings);

  const store = new Store();
  store.set('autoStart', settings.autoStart); // 更新配置文件中的 autoStart 选项

  // 验证配置是否被正确保存
  console.log('当前配置:', store.get('autoStart'));

  setAutoStart(settings.autoStart); // 更新系统开机启动状态

  if (settingsWindow) {
    settingsWindow.close(); // 保存后关闭设置窗口
  }
});


ipcMain.on('run-command', (event, command) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行命令出错: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
});


if (process.platform === 'win32') {
  // 应用是否打包
  if (app.isPackaged) {
    // 设置开机启动
    app.setLoginItemSettings({
      openAtLogin: true
    });
  }
}

app.whenReady().then(() => {
  initConfig();
  createWindow();
  createTray();


  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
