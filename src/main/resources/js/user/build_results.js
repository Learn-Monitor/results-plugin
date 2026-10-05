document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [studentData, subjects] = await Promise.all([
            fetchMyData(),
            fetch('/mysubjects').then(response => response.ok ? response.json() : [])
        ]);
        const results = {subjects: []};
        await Promise.all((Array.isArray(subjects) ? subjects : []).map(async subject => {
            const response = await fetch('/my-curriculum-progress', {
                method: 'POST', credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({subjectId: Number(subject.id)})
            });
            if (!response.ok) throw new Error(`Fortschritt konnte nicht geladen werden (${response.status}).`);
            const progress = await response.json();
            results.subjects.push({...subject, completedTasks: [
                ...(progress.completedCentralTasks || []).map(task => ({...task, type: 'CENTRAL'})),
                ...(progress.completedFlexibleTasks || []).map(task => ({...task, type: 'FLEXIBLE'}))
            ]});
        }));
        await loadStudentResultView(studentData, results);
    } catch (error) {
        console.error('Schatzkammer konnte nicht geladen werden:', error);
        const charts = document.getElementById('charts');
        if (charts) charts.textContent = 'Die Schatzkammer konnte gerade nicht geladen werden. Bitte lade die Seite erneut.';
    }
});
