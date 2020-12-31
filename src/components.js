const path = require('path');

//TODO: 分割代入できそう
exports.itemCard = (dirPath, itemInfo) => {
    //TODO: サムネイルが存在しないときの処理
    //TODO: クリックしたときの処理
    //TODO: 画像サイズの制限
    return `<div class="col">
    <div class="card">
        <img src="${itemInfo.thumbnail}" class="card-img-top">
        <div class="card-body">
            <h5 class="card-title">${path.basename(dirPath)}</h5>
            <p class="card-text">タグとか並べる？</p>
        </div>
    </div>
</div>`
};

exports.tag = (checked, name) => {
    return `<div class="form-check form-check-inline">
    <input class="form-check-input" type="checkbox" ${checked ? "checked" : ""} id="${name}" value="${name}">
    <label class="form-check-label" for="${name}">${name}</label>
</div>`;
};
