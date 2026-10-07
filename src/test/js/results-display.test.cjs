const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(
    path.join(__dirname, '../../main/resources/js/site/student-database.js'),
    'utf8'
);
const context = {
    console,
    document: {
        readyState: 'loading',
        addEventListener() {},
        getElementById() { return null; },
        querySelectorAll() { return []; },
        documentElement: {}
    },
    window: { setTimeout() { return 0; } },
    MutationObserver: class { observe() {} disconnect() {} }
};
vm.createContext(context);
vm.runInContext(source, context);

test('uses the shared subject name for the treasure view', () => {
    assert.equal(
        context.resolveSubjectDisplayName(
            {subjectId: 7},
            'Reli01',
            [{id: 7, name: 'Religion/Ethik'}]
        ),
        'Religion/Ethik'
    );
});

test('falls back safely when a subject is not in the shared list', () => {
    assert.equal(
        context.resolveSubjectDisplayName({subjectId: 99}, 'Unbekannt', []),
        'Unbekannt'
    );
});

test('uses the canonical coin thresholds and display order', () => {
    assert.equal(context.gradeForCoins(0), 6);
    assert.equal(context.gradeForCoins(20), 5);
    assert.equal(context.gradeForCoins(40), 4);
    assert.equal(context.gradeForCoins(60), 3);
    assert.equal(context.gradeForCoins(75), 2);
    assert.equal(context.gradeForCoins(90), 1);
    assert.equal(context.resolveSubjectOrder({displayOrder: 7}), 7);
    assert.equal(context.resolveSubjectOrder({name: 'unbekannt'}), 1000);
});

test('renders dynamic profile data as text, including markup-looking input', () => {
    const element = {textContent: ''};
    context.document.getElementById = id => id === 'student-name' ? element : null;
    const marker = `<img src=x onerror=alert(1)> < > & " '`;

    context.arcanumResultsSetText(
        'student-name',
        marker
    );

    assert.equal(
        element.textContent,
        marker
    );
});
