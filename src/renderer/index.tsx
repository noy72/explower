import { ipcRenderer, remote } from 'electron';
import React, { MouseEvent, FormEvent, RefObject, createRef } from 'react';
import ReactDOM from 'react-dom';
import { Item } from "../main/models/Item";
import Directory from "../main/models/Directory";
import { deleteItem } from '../main/repositories/itemRepository';
import { searchItems } from '../main/domain/service/item';
import ItemCards from './components/ItemCards';

const { Menu, MenuItem } = remote;

type State = {
    items: Item[],
}

class Content extends React.Component<{}, State> {
    searchBoxRef: RefObject<HTMLInputElement>;

    constructor(props: {}) {
        super(props);
        this.state = {
            items: searchItems(''),
        };
        this.searchBoxRef = createRef();

        this.searchByInputText = this.searchByInputText.bind(this);
        this.resetState = this.resetState.bind(this);
    }

    componentDidMount() {
        ipcRenderer.on('render', () => this.searchByInputText());
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners('render');
    }

    render() {
        return <>
            <form autoComplete="on" onSubmit={this.searchByInputText}>
                <div className="ui fluid icon input">
                    <input ref={this.searchBoxRef} id="search-box" type="text" placeholder="title #tag" />
                    <i id="times-icon" className="times link icon" onClick={this.resetState} style={{ marginRight: "2rem" }}></i>
                    <i id="search-icon" className="search link icon" onClick={this.searchByInputText}></i>
                </div>
            </form>
            <ItemCards items={this.state.items} handlers={this.getHandlers()} />
        </>
    }

    searchByInputText(e: MouseEvent<HTMLElement> | FormEvent<HTMLFormElement> | undefined = undefined) {
        if (e != undefined) e.preventDefault();
        this.setState({
            items: searchItems(this.searchBoxRef.current!.value)
        });
    }

    resetState() {
        this.searchBoxRef.current!.value = '';
        this.setState({
            items: searchItems(''),
        });
    }

    getHandlers() {
        const openItem = (item: Item) => () => item.open();
        const addContextMenu = (item: Item) => (e: MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            const menuItemObjects = [{
                label: 'Tags',
                click: () => ipcRenderer.send('open-tag-modal', item.location)
            }, {
                label: 'Delete',
                click: () => {
                    deleteItem(item.location);
                    this.searchByInputText();
                }
            }];
            if (item.isDir()) {
                menuItemObjects.push({
                    label: 'Open',
                    click: () => {
                        const directory = new Directory(item);
                        directory.open();
                    }
                });
            }

            const menu = new Menu();
            menuItemObjects.forEach(menuItemObject =>
                menu.append(new MenuItem(menuItemObject))
            );
            menu.popup({ window: remote.getCurrentWindow() });
        };
        const searchByTag = (tag: string) => (e: MouseEvent<HTMLSpanElement>) => {
            e.stopPropagation();
            const inputText = `#"${tag}"`;
            this.searchBoxRef.current!.value = inputText;
            this.setState({
                items: searchItems(inputText),
            });
        }

        return { openItem, addContextMenu, searchByTag };
    }
}

const app = document.getElementById('contents');
ReactDOM.render(<Content />, app);