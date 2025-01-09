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

function saveAsPNG() {
    const name = document.getElementById('name').value.trim() || 'unbekannt';
    const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
    const unit = document.getElementById('unit').value.trim() || 'einheit';

    const sanitizedName = name.replace(/[^a-zA-ZäöüÄÖÜß0-9-_\s]/g, '').replace(/\s+/g, '_');
    const sanitizedUnit = unit.replace(/[^a-zA-ZäöüÄÖÜß0-9-_\s]/g, '').replace(/\s+/g, '_');

    // Styles für Screenshot vorbereiten
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;
    document.body.style.overflow = 'visible';
    document.body.style.height = 'auto';

    // Zuerst Screenshot erstellen
    html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        height: document.body.scrollHeight,
        windowHeight: document.body.scrollHeight,
        scrollY: 0,
        scrollX: 0,
        onclone: function(clonedDoc) {
            clonedDoc.body.style.overflow = 'visible';
            clonedDoc.body.style.height = 'auto';
        }
    }).then(canvas => {
        // Screenshot speichern
        const link = document.createElement('a');
        link.download = `Feedback_${sanitizedName}_${sanitizedUnit}_${date}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Styles zurücksetzen
        document.body.style.overflow = originalOverflow;
        document.body.style.height = originalHeight;

        // Dann Overlay anzeigen
        const feedbackOverlay = document.createElement('div');
        feedbackOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            font-size: 1.5em;
        `;
        feedbackOverlay.innerHTML = '<div>📸 Feedback wurde gespeichert!</div>';
        document.body.appendChild(feedbackOverlay);

        setTimeout(() => {
            location.reload();
        }, 1500);
    }).catch(error => {
        console.error("Screenshot error:", error);
        alert('Fehler beim Speichern. Bitte erneut versuchen.');
        document.body.style.overflow = originalOverflow;
        document.body.style.height = originalHeight;
    });
}
