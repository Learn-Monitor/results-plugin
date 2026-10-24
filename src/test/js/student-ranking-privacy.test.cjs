const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const source=fs.readFileSync(path.join(__dirname,'../../main/resources/js/site/student-database.js'),'utf8');

test('student treasure ranking renders the Top-50 limit, never the full population',()=>{
  assert.match(source,/ranking\.rankLimit/);
  assert.doesNotMatch(source,/ranking\.rankTotal/);
  assert.match(source,/`\/\$\{ranking\.rankLimit\}`/);
  assert.match(source,/Du bist nicht in den Top 50/);
});
