# 又一个启动器 | YAQL
> *Yet Another Quick Launcher  <br> 还  另一个  快捷   启动   器*

![Version](https://img.shields.io/github/v/release/ChaoMixian/YetAnotherQuickLauncher.svg)
![Language](https://img.shields.io/badge/Language-JavaScript-yellow)
![BuildSuccess](https://img.shields.io/badge/build-success-green)

**Yet Another Quick Launcher (YAQL)** 是*又*一个桌面快捷启动器，旨在帮助用户快速启动程序。它具有简单的界面和基本的功能，适合日常使用。

![demo](demo.png)

<p align="center">
  <img src="./assets/Seewo.png" alt="Icon 1" width="100">
  <img src="./assets/Chinese.png" alt="Icon 2" width="100">
  <img src="./assets/Math.png" alt="Icon 3" width="100">
  <img src="./assets/English.png" alt="Icon 4" width="100">
</p>
<p align="center">
  <img src="./assets/Physics.png" alt="Icon 5" width="100">
  <img src="./assets/Chemistry.png" alt="Icon 6" width="100">
  <img src="./assets/Biology.png" alt="Icon 7" width="100">
  <img src="./assets/Geography.png" alt="Icon 8" width="100">
</p>



## 功能|Features

- **透明和自定义窗口**：提供半透明和可自定义的窗口，极简美观
- **开机自启动**：可设置应用程序在系统启动时自动运行。
- **托盘功能**：支持系统托盘图标，方便用户快速访问。
- **桌面悬浮球**：可以将启动器缩小为悬浮球，确保不会遮挡。
- **设置界面**：允许用户自定义设置，包括开机自启动选项。

## 安装|Install
1. **前往[Release](https://github.com/ChaoMixian/YetAnotherQuickLauncher/releases)下载并安装**

2. **享受~~屎山~~之旅**

## 配置|Configure
### Windows
```C:\Users\<用户名>\AppData\Roaming\yet-another-quick-launcher\config.json```

### Linux
```C:\Users\<用户名>\AppData\Roaming\yet-another-quick-launcher\config.json```

### 配置文件示例
```json
{
	"version": "0.1.0",
	"autoStart": true,
	"app": [
		{
			"name": "希沃白板",
			"icon": "../assets/Seewo.png",
			"runCmd": "powershell Start-Process 'C:\\Program Files (x86)\\Seewo\\EasiNote5\\swenlauncher\\swenlauncher.exe'"
		},
		{
			"name": "Chinese",
			"icon": "../assets/Chinese.png",
			"runCmd": "explorer.exe C:\\Windows"
		},
		{
			"name": "Math",
			"icon": "../assets/Math.png",
			"runCmd": "explorer.exe C:\\Windows"
		},
		{
			"name": "English",
			"icon": "../assets/English.png",
			"runCmd": "explorer.exe C:\\Windows"
		},
		{
			"name": "Physics",
			"icon": "../assets/Physics.png",
			"runCmd": "explorer.exe C:\\Windows"
		},
		{
			"name": "Chemistry",
			"icon": "../assets/Chemistry.png",
			"runCmd": "explorer.exe C:\\Windows"
		},
		{
			"name": "Biology",
			"icon": "../assets/Biology.png",
			"runCmd": "explorer.exe C:\\Windows"
		},
		{
			"name": "Geography",
			"icon": "../assets/Geography.png",
			"runCmd": "explorer.exe C:\\Windows"
		}
	]
}
```

## 构建|Build
1. **克隆或下载代码**

   ```bash
   git clone https://github.com/ChaoMixian/YetAnotherQuickLauncher.git
   cd YetAnotherQuickLauncher
   ```

2. **安装依赖**

   ```bash
   npm install
   ```

3. **运行应用**

   ```bash
   npm start
   ```

4. **打包应用**

   ```bash
   npm run build
   ```

## 截图|Screenshot

![demo](demo.png)

## 贡献|Devotion

欢迎贡献代码或建议！请遵循以下步骤来贡献你的改进：

1. Fork 这个仓库
2. 创建一个新分支 (`git checkout -b feature/YourFeature`)
3. 提交你的更改 (`git commit -am 'Add new feature'`)
4. 推送到分支 (`git push origin feature/YourFeature`)
5. 提交 Pull Request

## 许可证|Licence

此项目使用 [Apache-2.0 许可证](LICENSE)，详细信息请查看 `LICENSE` 文件。

## 联系|Contact

- **作者**: [ChaoMixian](https://github.com/ChaoMixian)
- **问题反馈**: [提交问题](https://github.com/ChaoMixian/YetAnotherQuickLauncher/issues)

---