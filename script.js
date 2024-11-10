// Drag-and-Drop Funktionalität
const actionItems = document.querySelectorAll('.action-item');
const categories = document.querySelectorAll('.category');
const saveButton = document.getElementById('save-button');

// Lock Button Funktionalität
const lockButtons = document.querySelectorAll('.lock-button');
lockButtons.forEach(button => {
    button.addEventListener('click', () => {
        const input = button.previousElementSibling;
        input.disabled = true;
        button.disabled = true;
    });
});

// Drag-and-Drop
actionItems.forEach(item => {
    item.addEventListener('dragstart', () => {
        item.classList.add('dragging');
    });

    item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
    });
});

categories.forEach(category => {
    const dropContainer = category.querySelector('.drop-container');
    category.addEventListener('dragover', event => {
        event.preventDefault();
        const dragging = document.querySelector('.dragging');
        // Element am Anfang des Drop-Containers einfügen
        dropContainer.insertBefore(dragging, dropContainer.firstChild);
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

    // Ergebnisse als PNG speichern
    setTimeout(() => {
        saveAsPDF();
        location.reload();
    }, 30000);
});

// Ergebnisse als PNG speichern
function saveAsPNG() {
    const name = document.getElementById('name').value || 'Unbekannt';
    const unit = document.getElementById('unit').value || 'Unbekannt';
    const date = document.getElementById('date').value || 'Unbekannt';

    // Wähle den relevanten Bereich aus
    const content = document.querySelector('.main-content');

    html2canvas(content).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        
        // Erstelle einen Download-Link
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `${name}-${unit}-${date}.png`;
        link.click();
    }).catch(error => {
        console.error("Fehler beim Rendern des Bereichs:", error);
    });
}
