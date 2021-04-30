import path from 'path';
import { Element, BrowserObject } from 'webdriverio';

const applicationConfig = {
    path: path.join(__dirname, '../../out/explower-darwin-x64/explower.app/Contents/MacOS/explower'),
    args: [path.join(__dirname, '../../src')],
    cwd: __dirname, // ワーキングディレクトリを変更することで，読み込むdata.jsonをテスト用のものに変えている．
};

async function getInnerTexts(element: Element | BrowserObject, selector: string): Promise<string[]> {
    const searched_elements = await element.$$(selector);
    return Promise.all(searched_elements.map(e => e.getText()));
}

async function getInnerText(element: Element | BrowserObject, selector: string): Promise<string> {
    const searched_element = await element.$(selector);
    return await searched_element.getText();
}

/**
 * 引数に与えた関数が真になるまで待機する関数．
 * 忙しくないビジーループ．
 * @param func 満たしたい条件を確認する関数
 */
async function wait(func: () => Promise<boolean>): Promise<void> {
    const timeout = 5000;
    const interval = 100;
    for (let i = 0; i < timeout / interval; i++) {
        if (await func()) break;
        await new Promise(resolve => setTimeout(resolve, interval));
    }
}



export { applicationConfig, getInnerText, getInnerTexts,wait };