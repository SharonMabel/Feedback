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
function saveFullPageScreenshot() {
    const name = document.getElementById('name').value.trim() || 'unbekannt';
    const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
    const unit = document.getElementById('unit').value.trim() || 'einheit';

    const sanitizedName = name.replace(/[^a-zA-ZäöüÄÖÜß0-9-_\s]/g, '').replace(/\s+/g, '_');
    const sanitizedUnit = unit.replace(/[^a-zA-ZäöüÄÖÜß0-9-_\s]/g, '').replace(/\s+/g, '_');

    const feedbackSection = document.getElementById('app');
    const originalScrollY = window.scrollY;

    const captureFullPage = async () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Erfassen der gesamten Höhe und Breite
        const totalHeight = feedbackSection.scrollHeight;
        const totalWidth = feedbackSection.scrollWidth;
        canvas.width = totalWidth;
        canvas.height = totalHeight;

        let currentScrollY = 0;

        while (currentScrollY < totalHeight) {
            window.scrollTo(0, currentScrollY);

            // Warte, damit der Browser das Scrollen korrekt umsetzt
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Screenshot des aktuellen sichtbaren Bereichs
            const partCanvas = await html2canvas(feedbackSection, {
                useCORS: true,
                windowWidth: totalWidth,
                windowHeight: window.innerHeight
            });

            const partHeight = Math.min(window.innerHeight, totalHeight - currentScrollY);
            context.drawImage(partCanvas, 0, currentScrollY, totalWidth, partHeight);
            currentScrollY += window.innerHeight;
        }

        // Zurückscrollen
        window.scrollTo(0, originalScrollY);

        // Screenshot speichern
        const link = document.createElement('a');
        link.download = `Feedback_${sanitizedName}_${sanitizedUnit}_${date}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        alert("Screenshot erfolgreich gespeichert!");
    };

    captureFullPage().catch(error => {
        console.error("Fehler beim Erstellen des vollständigen Screenshots:", error);
        alert("Fehler beim Speichern des Screenshots.");
    });
}
