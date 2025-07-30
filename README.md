# ⚡ Kflux

**Kflux** is an open-source desktop app to orchestrate your KNIME workflows with ease.  
It provides scheduling, logging, and execution history via a modern UI built with Electron and React.


---

## 🚀 Features

- 🧩 Manage multiple KNIME workflows
- 🕒 Per-workflow scheduler (e.g. daily at 08:00)
- 📜 Logs and execution history tracking
- 🔘 One-click control: Run / Pause / Stop
- 🧠 Live status indicators (Idle, Running, Paused, Error)
- 🖥️ Native desktop experience via **Electron**

---

## 🛠️ Requirements

- [KNIME Analytics Platform](https://www.knime.com/downloads) installed locally (not included)
- [Node.js](https://nodejs.org) (v18+)
- React
- [Git](https://git-scm.com/) for cloning
- [Electron](https://www.electronjs.org) (installed as part of the project)

> ✅ Kflux runs as a standalone desktop application built with Electron.  
> ⚠️ Currently tested **only on Windows**. macOS/Linux support is possible but not yet verified.

---

## 📦 Installation

```bash
git clone https://github.com/Orloch314/kflux.git

# 1. Clone the repository
git clone https://github.com/Orloch314/kflux.git
cd kflux

# 2. Install % start the backend (Node.js server)
cd backend
Nnpm install
node server.js

Don't change any file


# 2. Install the frontend (Node.js server)
cd frontend
npm install

Don't change any file, don't start the frontend


# 3. In a separate terminal, INSTALL & start the Electron frontend
cd Kflux-electron
npm install --save-dev electron
npm start

Don't change any file

⚙️ Configuration
Before use, configure:

KNIME executable path (e.g. C:\Program Files\KNIME\knime.exe)
Change the workflow you may see to yours
Delete the contents of backend/data/logs.json and backend/data/history.json

Notifications via email and MS Teams are not working at the moment

📄 License
This project is licensed under the GNU General Public License v3.0 (GPL-3.0).
See the full text in the LICENSE file.

You are free to use, modify, and distribute this software under the same license.
Derivative works must also be released under GPL-3.

🔐 Disclaimer
Kflux is not affiliated with or endorsed by KNIME AG.
KNIME® is a registered trademark of KNIME AG.
This software does not include KNIME, which must be installed separately by the user.

🤝 Contributing
We welcome contributions!

⭐ Star this project to support it

🐛 Report bugs or request features via GitHub Issues

📥 Submit Pull Requests for improvements or new ideas
