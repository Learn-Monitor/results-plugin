document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [studentData, subjects] = await Promise.all([
            fetchMyData(),
            fetch('/mysubjects').then(response => response.ok ? response.json() : [])
        ]);
        const catalogs = {};
        await Promise.all((Array.isArray(subjects) ? subjects : []).map(async subject => {
            const response = await fetch('/my-curriculum-catalog', {
                method: 'POST', credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({subjectId: Number(subject.id)})
            });
            if (response.ok) catalogs[String(subject.id)] = await response.json();
        }));
        loadStudentResultView(studentData, subjects, catalogs);
    } catch (error) {
        console.error('Schatzkammer konnte nicht geladen werden:', error);
        const charts = document.getElementById('charts');
        if (charts) charts.textContent = 'Die Schatzkammer konnte gerade nicht geladen werden. Bitte lade die Seite erneut.';
    }
});
