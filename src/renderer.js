const { ipcRenderer } = require('electron');

document.getElementById('settings').addEventListener('click', () => {
  ipcRenderer.send('settings');
});

document.getElementById('minimize').addEventListener('click', () => {
  ipcRenderer.send('minimize');
});

document.getElementById('close').addEventListener('click', () => {
    ipcRenderer.send('close');
});

const { exec } = require('child_process');

window.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.launcher-icon');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const command = button.getAttribute('data-command');
      if (command) {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing command: ${error}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
        });
      }
    });
  });
});


// 接收从主进程传递过来的配置数据
ipcRenderer.on('load-config', (event, config) => {
    const container = document.getElementById('win');
    
    // 遍历配置文件并动态生成图标
    config.forEach(app => {
        const launcherIcon = document.createElement('div');
        launcherIcon.classList.add('launcher-icon');
        launcherIcon.setAttribute('data-command', app.runCmd || app.runApp);

        const img = document.createElement('img');
        img.src = app.icon;
        img.alt = app.name;

        launcherIcon.appendChild(img);
        container.appendChild(launcherIcon);

        // 添加点击事件，执行命令
        launcherIcon.addEventListener('click', () => {
            ipcRenderer.send('run-command', app.runCmd || app.runApp);
        });
    });
});


// // 监听主进程发送的置顶状态消息
// ipcRenderer.on('update-top-icon', (event, isAlwaysOnTop) => {
//   const pinIcon = document.querySelector('#toggle-top i');
//   if (isAlwaysOnTop) {
//     pinIcon.classList.remove('fa-thumbtack');
//     pinIcon.classList.add('fa-thumbtack-slash');
//   } else {
//     pinIcon.classList.remove('fa-thumbtack-slash');
//     pinIcon.classList.add('fa-thumbtack');
//   }
// });