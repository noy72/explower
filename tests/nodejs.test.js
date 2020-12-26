const assert = require('assert').strict;
const fs = require('fs');
const rootPath = require('app-root-path');
const sampleDirPath = `${rootPath}/tests/sample_dir`;

it('readdirSync', function () {
    const dirs = fs.readdirSync(sampleDirPath);
    assert.equal(dirs.length, 6);
    for (let i = 1; i < dirs.length; i++) {
        assert.equal(dirs[i], `dir0${i}`);
    }
});
