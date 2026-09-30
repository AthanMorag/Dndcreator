let currentStep = 1;
const totalSteps = 3;

// Wizard Navigation
document.getElementById('btn-next').addEventListener('click', () => {
  if (currentStep < totalSteps) {
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    currentStep++;
    document.getElementById(`step-${currentStep}`).classList.add('active');
    updateNav();
  }
});

document.getElementById('btn-prev').addEventListener('click', () => {
  if (currentStep > 1) {
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    currentStep--;
    document.getElementById(`step-${currentStep}`).classList.add('active');
    updateNav();
  }
});

function updateNav() {
  document.getElementById('btn-prev').disabled = (currentStep === 1);
  document.getElementById('btn-next').disabled = (currentStep === totalSteps);
}

// Extract form data
function getCharacterData() {
  return {
    name: document.getElementById('char-name').value || 'Unnamed Hero',
    class: document.getElementById('char-class').value,
    species: document.getElementById('char-species').value,
    background: document.getElementById('char-bg').value,
    scores: {
      STR: document.getElementById('score-str').value,
      DEX: document.getElementById('score-dex').value,
      CON: document.getElementById('score-con').value,
      INT: document.getElementById('score-int').value,
      WIS: document.getElementById('score-wis').value,
      CHA: document.getElementById('score-cha').value,
    }
  };
}

// Local Storage Save
document.getElementById('btn-save').addEventListener('click', () => {
  const data = getCharacterData();
  localStorage.setItem('dnd2024_character', JSON.stringify(data));
  alert('Character Saved to Local Storage!');
});

// PDF Generation using pdf-lib
document.getElementById('btn-pdf').addEventListener('click', async () => {
  const char = getCharacterData();
  const pdfDoc = await PDFLib.PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  const { width, height } = page.getSize();
  const fontSize = 18;

  page.drawText('D&D 5e (2024) Character Sheet', {
    x: 50,
    y: height - 50,
    size: 22
  });

  page.drawText(`Name: ${char.name}`, { x: 50, y: height - 100, size: fontSize });
  page.drawText(`Class: ${char.class}`, { x: 50, y: height - 130, size: fontSize });
  page.drawText(`Species: ${char.species}`, { x: 50, y: height - 160, size: fontSize });
  page.drawText(`Background: ${char.background}`, { x: 50, y: height - 190, size: fontSize });

  page.drawText('Ability Scores:', { x: 50, y: height - 240, size: 20 });
  let yPos = height - 270;
  for (const [stat, value] of Object.entries(char.scores)) {
    page.drawText(`${stat}: ${value}`, { x: 70, y: yPos, size: fontSize });
    yPos -= 25;
  }

  const pdfBytes = await pdfDoc.save();
  
  // Download file on mobile
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${char.name}_Character_Sheet.pdf`;
  link.click();
});
