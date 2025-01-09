document.addEventListener('DOMContentLoaded', function() {
    // Prevent right-click
    document.addEventListener('contextmenu', event => event.preventDefault());

    // Prevent keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && 
            (e.key === 's' || e.key === 'p' || e.key === 'u' || e.key === 'i')) {
            e.preventDefault();
        }
    });

    // Set current date
    document.getElementById('date').valueAsDate = new Date();
});

// Drag-and-Drop functionality
const actionItems = document.querySelectorAll('.action-item');
const categories = document.querySelectorAll('.category');

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
        if (dragging) {
            dropContainer.insertBefore(dragging, dropContainer.firstChild);
        }
    });
});
function saveAsFullPagePNG() {
    const name = document.getElementById('name').value.trim() || 'unbekannt';
    const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
    const unit = document.getElementById('unit').value.trim() || 'einheit';

    const sanitizedName = name.replace(/[^a-zA-ZäöüÄÖÜß0-9-_\s]/g, '').replace(/\s+/g, '_');
    const sanitizedUnit = unit.replace(/[^a-zA-ZäöüÄÖÜß0-9-_\s]/g, '').replace(/\s+/g, '_');

    const feedbackSection = document.getElementById('app');

    // Scrollbare Höhe und Breite erfassen
    const originalWidth = feedbackSection.scrollWidth;
    const originalHeight = feedbackSection.scrollHeight;

    // Temporär die Größe anpassen, um die gesamte Seite zu erfassen
    feedbackSection.style.width = `${originalWidth}px`;
    feedbackSection.style.height = `${originalHeight}px`;

    html2canvas(feedbackSection, {
        useCORS: true,
        windowWidth: originalWidth,
        windowHeight: originalHeight
    }).then(canvas => {
        // Größe zurücksetzen
        feedbackSection.style.width = "";
        feedbackSection.style.height = "";

        // Speichern als PNG
        const link = document.createElement('a');
        link.download = `Feedback_${sanitizedName}_${sanitizedUnit}_${date}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        alert("Screenshot erfolgreich gespeichert!");
    }).catch(error => {
        console.error("Fehler beim Screenshot:", error);
        alert("Fehler beim Speichern des Screenshots.");
    });
}
