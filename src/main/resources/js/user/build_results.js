document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [studentData, results] = await Promise.all([
            fetchMyData(),
            fetch('/my-completed-results', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'},
                body: '{}'
            }).then(response => {
                if (!response.ok) throw new Error(`Ergebnisse konnten nicht geladen werden (${response.status}).`);
                return response.json();
            })
        ]);
        await loadStudentResultView(studentData, results);
    } catch (error) {
        console.error('Schatzkammer konnte nicht geladen werden:', error);
        const charts = document.getElementById('charts');
        if (charts) charts.textContent = 'Die Schatzkammer konnte gerade nicht geladen werden. Bitte lade die Seite erneut.';
    }
});
