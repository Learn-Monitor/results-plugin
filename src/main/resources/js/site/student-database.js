"use strict";

const ARCANUM_RESULT_GRADES = [
    { grade: 1, coins: 90 }, { grade: 2, coins: 75 }, { grade: 3, coins: 60 },
    { grade: 4, coins: 40 }, { grade: 5, coins: 20 }
];

function gradeForCoins(coins) {
    const match = ARCANUM_RESULT_GRADES.find(entry => Number(coins) >= entry.coins);
    return match ? match.grade : 6;
}

function resolveSubjectDisplayName(progress, progressKey, availableSubjects) {
    const canonical = Array.isArray(availableSubjects)
        ? availableSubjects.find(subject => Number(subject.id) === Number(progress?.subjectId ?? progressKey))
        : null;
    return canonical?.displayName || canonical?.name || progressKey;
}

function resolveSubjectOrder(subject) {
    return Number.isFinite(Number(subject?.displayOrder)) ? Number(subject.displayOrder) : 1000;
}

function taskRows(catalog) {
    return [...(catalog?.centralTasks || []).map(task => ({...task, type: "Zentral"})),
        ...(catalog?.flexibleTasks || []).map(task => ({...task, type: "Flexibel"}))];
}

function createTreasureCard(subject, catalog) {
    const card = document.createElement('article');
    card.className = 'treasure-card';
    const coins = Number(catalog?.progress?.totalTokens || 0);
    const grade = gradeForCoins(coins);
    const tasks = taskRows(catalog);
    const completed = tasks.filter(task => task.completed === true);
    const title = document.createElement('h3');
    title.textContent = subject.displayName || subject.name || 'Unbenanntes Fach';
    card.appendChild(title);
    const score = document.createElement('p');
    score.className = 'treasure-card__score';
    score.textContent = `${coins} Münzen · Note ${grade} (aktueller Zwischenstand)`;
    card.appendChild(score);
    const summary = document.createElement('p');
    summary.className = 'treasure-card__summary';
    summary.textContent = `${completed.length} bestätigte Etappe${completed.length === 1 ? '' : 'n'} · ${tasks.length - completed.length} weitere Etappe${tasks.length - completed.length === 1 ? '' : 'n'} im Katalog`;
    card.appendChild(summary);
    const list = document.createElement('ul');
    list.className = 'treasure-card__stages';
    if (!tasks.length) {
        const empty = document.createElement('li');
        empty.textContent = 'Für dieses Fach sind aktuell keine Etappen freigegeben.';
        list.appendChild(empty);
    } else tasks.forEach(task => {
        const item = document.createElement('li');
        item.className = task.completed ? 'is-completed' : 'is-open';
        item.textContent = `${task.completed ? 'Bestätigt' : 'Offen'}: ${task.name} · ${task.tokens ?? 0} Münzen`;
        list.appendChild(item);
    });
    card.appendChild(list);
    return card;
}

function loadStudentResultView(studentData, availableSubjects = [], catalogs = {}) {
    const name = document.getElementById('student-name');
    if (name) name.textContent = `${studentData.firstName} ${studentData.lastName}`;
    const charts = document.getElementById('charts');
    if (!charts) return;
    charts.replaceChildren();
    const subjects = [...(Array.isArray(availableSubjects) ? availableSubjects : [])]
        .sort((a, b) => resolveSubjectOrder(a) - resolveSubjectOrder(b) ||
            String(a.displayName || a.name).localeCompare(String(b.displayName || b.name), 'de'));
    if (!subjects.length) {
        const empty = document.createElement('p');
        empty.textContent = 'Für deine Klassenstufe sind noch keine Fächer eingerichtet.';
        charts.appendChild(empty);
        return;
    }
    subjects.forEach(subject => {
        const catalog = catalogs[String(subject.id)];
        if (catalog) charts.appendChild(createTreasureCard(subject, catalog));
        else {
            const error = document.createElement('article');
            error.className = 'treasure-card treasure-card--error';
            error.textContent = 'Die Daten für dieses Fach konnten gerade nicht geladen werden.';
            charts.appendChild(error);
        }
    });
}
