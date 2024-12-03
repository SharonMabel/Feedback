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

// Aktualisierte Save-Button-Funktion
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

    // Speichern und Reload
    setTimeout(() => {
        saveAsPNG(); // Screenshot mit personalisierten Dateinamen
        location.reload();
    }, 2000); // Kürzere Wartezeit
});

// Ergebnisse als PNG speichern - optimierte Version mit Namensergänzung
function saveAsPNG() {
    // Suche nach den Eingabefeldern für Name, Datum und Unterrichtseinheit
    const nameInput = document.querySelector('input[placeholder="Name"]');
    const dateInput = document.querySelector('input[placeholder="Datum"]');
    const unitInput = document.querySelector('input[placeholder="Unterrichtseinheit"]');

    // Standardwerte, falls Felder leer sind
    const name = nameInput ? (nameInput.value.trim() || 'unbekannt') : 'unbekannt';
    const date = dateInput ? (dateInput.value || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0];
    const unit = unitInput ? (unitInput.value.trim() || 'einheit') : 'einheit';

    // Entferne Sonderzeichen aus dem Dateinamen und ersetze Leerzeichen
    const sanitizedName = name.replace(/[^a-zA-ZäöüÄÖÜß0-9-_\s]/g, '')
                               .replace(/\s+/g, '_')
                               .trim();
    const sanitizedUnit = unit.replace(/[^a-zA-ZäöüÄÖÜß0-9-_\s]/g, '')
                               .replace(/\s+/g, '_')
                               .trim();
     // Warte kurz, damit alle Elemente initialisiert sind
     setTimeout(function() {
        html2canvas(document.body, {
            scrollX: 0,
            scrollY: -window.scrollY,
            windowWidth: document.documentElement.scrollWidth,
            windowHeight: document.documentElement.scrollHeight,
            scale: window.devicePixelRatio,
            useCORS: true
        }).then(function(canvas) {
            // Generiere einen eindeutigen Dateinamen
            const link = document.createElement('a');
            link.download = `Feedback_${sanitizedName}_${sanitizedUnit}_${date}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(error => {
            console.error("Fehler beim Rendern des Screenshots:", error);
            alert('Es gab ein Problem beim Speichern des Screenshots. Bitte versuchen Sie es erneut.');
        });
    }, 500);
}