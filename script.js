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

    // Screenshot der gesamten Seite
    html2canvas(feedbackSection, {
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.body.scrollWidth,
        windowHeight: document.body.scrollHeight
    }).then(canvas => {
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
