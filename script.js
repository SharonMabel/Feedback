// Drag-and-Drop Funktionalität
const actionItems = document.querySelectorAll('.action-item');
const categories = document.querySelectorAll('.category');
const saveButton = document.getElementById('save-button');

actionItems.forEach(item => {
    item.addEventListener('dragstart', () => {
        item.classList.add('dragging');
    });

    item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
    });
});

categories.forEach(category => {
    category.addEventListener('dragover', event => {
        event.preventDefault();
        const dragging = document.querySelector('.dragging');
        category.appendChild(dragging);
    });
});

// Speichern und Feedback anzeigen
saveButton.addEventListener('click', event => {
    event.preventDefault();
    saveButton.disabled = true;

    // Zeige Feedback
    const mainContent = document.querySelector('.main-content');
    const feedbackOverlay = document.createElement('div');
    feedbackOverlay.style.position = 'absolute';
    feedbackOverlay.style.top = '0';
    feedbackOverlay.style.left = '0';
    feedbackOverlay.style.width = '100%';
    feedbackOverlay.style.height = '100%';
    feedbackOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    feedbackOverlay.style.display = 'flex';
    feedbackOverlay.style.justifyContent = 'center';
    feedbackOverlay.style.alignItems = 'center';
    feedbackOverlay.style.fontSize = '1.5em';
    feedbackOverlay.innerHTML = '<div><span>😊</span><p>Danke für dein Feedback!</p></div>';
    mainContent.appendChild(feedbackOverlay);

    // Seite nach 30 Sekunden neu laden
    setTimeout(() => {
        location.reload();
    }, 30000);
});
