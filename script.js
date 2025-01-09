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
    feedbackOverlay.innerHTML = '<div>📸 Feedback wird gespeichert...</div>';
    document.body.appendChild(feedbackOverlay);

    setTimeout(() => {
        html2canvas(document.getElementById('app'), {
            width: 1920,
            height: 1080,
            scale: 1,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `Feedback_${sanitizedName}_${sanitizedUnit}_${date}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            setTimeout(() => {
                feedbackOverlay.remove();
                location.reload();
            }, 1000);
        }).catch(error => {
            console.error("Screenshot error:", error);
            alert('Fehler beim Speichern. Bitte erneut versuchen.');
            feedbackOverlay.remove();
        });
    }, 500);
}