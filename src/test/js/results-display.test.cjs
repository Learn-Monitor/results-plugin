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

test('uses effective awarded tokens for earned results and preserves maximum fallback', () => {
    assert.equal(context.arcanumResultEffectiveAward({tokens: 4, awardedTokens: 2}), 2);
    assert.equal(context.arcanumResultEffectiveAward({tokens: 4, awardedTokens: null}), 4);
    assert.equal(context.arcanumResultEffectiveAward({tokens: 4}), 4);
    assert.equal(context.arcanumResultEffectiveAward({tokens: 4, awardedTokens: 0}), 0);
    assert.equal(context.arcanumResultEffectiveAward({tokens: 4, awardedTokens: 'bad'}), 0);
    assert.equal(
        context.arcanumResultCoinSources([
            {tokens: 4, awardedTokens: 4},
            {tokens: 4, awardedTokens: 2},
            {tokens: 3, awardedTokens: null}
        ]).length,
        9
    );
});

test('formats variable rewards with earned and maximum values', () => {
    assert.equal(context.arcanumResultTaskRewardText({tokens: 4, variableTokens: true, awardedTokens: 2}), '2 von 4 Münzen');
    assert.equal(context.arcanumResultTaskRewardText({tokens: 4, variableTokens: true, awardedTokens: 4}), '4 von 4 Münzen');
    assert.equal(context.arcanumResultTaskRewardText({tokens: 1, variableTokens: true, awardedTokens: 1}), '1 von 1 Münze');
    assert.equal(context.arcanumResultTaskRewardText({tokens: 4, variableTokens: false, awardedTokens: 4}), '+4');
});

test('keeps variable reward zero distinct from maximum', () => {
    assert.equal(context.arcanumResultTaskRewardText({tokens: 4, variableTokens: true, awardedTokens: 0}), '0 von 4 Münzen');
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
