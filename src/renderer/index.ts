import { ipcRenderer, remote } from 'electron';
import * as components from './components';
import { searchItems } from "../controller";
import { Item } from "../models/Item";
import Directory from "../models/Directory";
import { deleteItem } from '../infrastructure/database';

const { Menu, MenuItem } = remote;

const itemList = <HTMLElement>document.querySelector('.container .item-list');
const searchBox = <HTMLInputElement>document.querySelector('.form-control');
const searchButton = <HTMLElement>document.querySelector('.btn-primary');

ipcRenderer.on('render', () => render());

remote.getCurrentWindow().on('ready-to-show', () => {
    render();
});

searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    render();
});

const render = () => renderItems(searchItems(searchBox.value));

const renderItems = (items: Item[]) => {
    itemList.innerHTML = "";
    items.forEach(item => {
        const itemCardElement = components.createItemCardElement(item);
        itemCardElement.addEventListener('click', () => item.open());
        itemCardElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const menu = new Menu();
            menu.append(new MenuItem({
                label: 'Tags', click() {
                    ipcRenderer.send('open-tag-modal', item.location);
                }
            }));
            if (item.isDir()) {
                const directory = new Directory(item);
                menu.append(new MenuItem({
                    label: 'Open', click() {
                        directory.open();
                    }
                }));
            }
            menu.append(new MenuItem({
                label: 'Delete', click() {
                    deleteItem(item.location);
                    render();
                }
            }));
            menu.popup({ window: remote.getCurrentWindow() });
        }, false);
        itemList.appendChild(itemCardElement);
    });
};