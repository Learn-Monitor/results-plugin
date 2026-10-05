const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(
    path.join(__dirname, '../../main/resources/js/site/student-database.js'),
    'utf8'
);
const context = { console };
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
