import { app, Menu, shell } from 'electron';
import { is, openUrlMenuItem } from 'electron-util';
import { isDev, aboutMenuItem, appMenu } from 'electron-util/main';

const helpSubmenu = [
  openUrlMenuItem({
    label: 'Website',
    url: 'https://skybrush.io',
  }),
];

const macOsMenuTemplate = [
  appMenu([]),
  {
    role: 'editMenu',
  },
  {
    role: 'windowMenu',
  },
  {
    role: 'help',
    submenu: helpSubmenu,
  },
];

const linuxWindowsMenuTemplate = [
  {
    label: 'File',
    submenu: [{ role: 'quit' }],
  },
  {
    role: 'editMenu',
  },
  {
    role: 'windowMenu',
  },
  {
    role: 'help',
    submenu: helpSubmenu,
  },
];

if (!is.macos) {
  helpSubmenu.push(
    { type: 'separator' },
    aboutMenuItem({
      copyright: 'Copyright © CollMot Robotics',
    })
  );
}

const template = is.macos ? macOsMenuTemplate : linuxWindowsMenuTemplate;

if (isDev) {
  template.push({
    label: 'Debug',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      {
        label: 'Show App Data',
        click() {
          shell.openItem(app.getPath('userData'));
        },
      },
      {
        label: 'Delete App Data',
        click() {
          shell.moveItemToTrash(app.getPath('userData'));
          app.relaunch();
          app.quit();
        },
      },
    ],
  });
}

const createAppMenu = () => Menu.buildFromTemplate(template);

export default createAppMenu;
