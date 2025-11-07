// =======================================================
// myKaarma Interactive Checklist – Stable JS
// (Navigation, Dynamic Row Add, PDF Export)
// Updated: November 7, 2025
// =======================================================

window.addEventListener('DOMContentLoaded', () => {
  // === SIDEBAR NAVIGATION ===
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.page-section');

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      button.classList.add('active');

      sections.forEach(section => section.classList.remove('active'));
      const target = document.getElementById(button.dataset.target);
      if (target) target.classList.add('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // === ADD-ROW BUTTON HANDLER ===
  document.querySelectorAll('.table-footer .add-row').forEach(button => {
    button.addEventListener('click', () => {
      const section = button.closest('.section');
      if (!section) return;
      const table = section.querySelector('table.training-table');
      if (!table) return;

      const tbody = table.tBodies[0];
      if (!tbody || !tbody.rows.length) return;

      // Clone the last row
      const lastRow = tbody.rows[tbody.rows.length - 1];
      const newRow = lastRow.cloneNode(true);

      // Reset form fields
      newRow.querySelectorAll('input, select').forEach(el => {
        if (el.type === 'checkbox') el.checked = false;
        else el.value = '';
      });

      tbody.appendChild(newRow);
    });
  });

  // === SAVE ALL PAGES AS PDF ===
  const saveBtn = document.getElementById('savePDF');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      if (!window.jspdf) return alert("PDF generator not loaded.");
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'pt', 'a4');

      const marginX = 40;
      const marginY = 40;
      const lineHeight = 14;
      const maxWidth = 520;
      let firstPage = true;

      document.querySelectorAll('.page-section').forEach(section => {
        if (!firstPage) doc.addPage();
        firstPage = false;

        const title = section.querySelector('h1')?.innerText || 'Section';
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text(title, marginX, marginY);

        // Collect visible text for summary capture
        const content = section.innerText.trim().replace(/\s+\n/g, '\n');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(doc.splitTextToSize(content, maxWidth), marginX, marginY + 24, {
          lineHeightFactor: 1.15,
        });
      });

      doc.save('Training_Summary.pdf');
    });
  }
});
