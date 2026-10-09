const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const resourceRoot = path.join(__dirname, '../../main/resources');
const productionFiles = [
    ...['html', 'js', 'css', 'templates', 'meta'].flatMap(directory => {
        const root = path.join(resourceRoot, directory);
        const files = [];

        function collect(current) {
            for (const entry of fs.readdirSync(current, {withFileTypes: true})) {
                const file = path.join(current, entry.name);
                if (entry.isDirectory()) collect(file);
                else files.push(file);
            }
        }

        collect(root);
        return files;
    })
].filter(file => /\.(html|js|css|json)$/.test(file));

const source = productionFiles
    .map(file => fs.readFileSync(file, 'utf8'))
    .join('\n');

test('production resources contain no inline scripts or event handlers', () => {
    assert.doesNotMatch(source, /<script\b(?![^>]*\bsrc\s*=)[^>]*>/i);
    assert.doesNotMatch(source, /\bon[a-z][a-z0-9_-]*\s*=\s*(?:["'][^"']*["']|[^\s>]+)/i);
    assert.doesNotMatch(source, /\.(?:onclick|ondblclick|onchange|oninput|onsubmit|onload|onerror|onkeydown|onkeyup|onmousedown|onmouseup|onmouseover|onfocus|onblur)\s*=/i);
    assert.doesNotMatch(source, /\bjavascript\s*:/i);
});

test('production resources contain no executable HTML sinks or eval', () => {
    assert.doesNotMatch(source, /\b(?:innerHTML|outerHTML|insertAdjacentHTML|document\.write)\b/);
    assert.doesNotMatch(source, /\b(?:eval|Function)\s*\(/);
});

test('production resources contain no inline styles', () => {
    assert.doesNotMatch(source, /<style\b[^>]*>/i);
    assert.doesNotMatch(source, /\bstyle\s*=\s*(?:["'][^"']*["']|[^\s>]+)/i);
    assert.doesNotMatch(source, /\bsetAttribute\s*\(\s*["']style["']/i);
    assert.doesNotMatch(source, /\.cssText\s*=/i);
});

test('admin results use the external shared results asset', () => {
    const adminTemplate = fs.readFileSync(
        path.join(resourceRoot, 'html/admin/student-results.html'),
        'utf8'
    );
    const paths = JSON.parse(fs.readFileSync(
        path.join(resourceRoot, 'meta/paths/get_paths.json'),
        'utf8'
    ));

    assert.doesNotMatch(adminTemplate, /<script\b/i);
    assert.deepEqual(paths['/build_results.js'].namespaces, ['user', 'teacher']);
    assert.equal(fs.existsSync(path.join(resourceRoot, 'js/user/build_results.js')), true);
    assert.equal(fs.existsSync(path.join(resourceRoot, 'js/teacher/build_results.js')), true);
    assert.equal(fs.existsSync(path.join(resourceRoot, 'js/admin/build_results.js')), false);
});
