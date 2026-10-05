let settings;

document.addEventListener('DOMContentLoaded', async () => {
    // Load student data (reuse endpoint from dashboard)
    const [studentData, subjects] = await Promise.all([
        fetchMyData(),
        fetch('/mysubjects').then(response => response.ok ? response.json() : [])
    ]);
    
    loadStudentResultView(studentData, subjects);
});
