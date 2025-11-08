// =======================================================
// myKaarma Interactive Training Checklist – FULL JS (Stable Build)
// Version: November 2025
// =======================================================

window.addEventListener('DOMContentLoaded', () => {
  // === SIDEBAR NAVIGATION ===
  const nav = document.getElementById('sidebar-nav');
  const sections = document.querySelectorAll('.page-section');

  if (nav) {
    nav.addEventListener('click', (e) => {
      const btn = e.target.closest('.nav-btn');
      if (!btn) return;
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;

      // Remove and add active class
      nav.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show selected section
      sections.forEach(sec => sec.classList.remove('active'));
      target.classList.add('active');

      // Scroll to top on section switch
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =======================================================
  // === TABLE ADD-ROW FUNCTIONALITY ===
  // =======================================================
  document.querySelectorAll('.table-footer .add-row').forEach(button => {
    button.addEventListener('click', () => {
      const section = button.closest('.section');
      if (!section) return;

      const table = section.querySelector('table.training-table');
      if (!table) return;

      const tbody = table.tBodies[0];
      if (!tbody || !tbody.rows.length) return;

      // Clone last data row
      const lastRow = tbody.rows[tbody.rows.length - 1];
      const newRow = lastRow.cloneNode(true);

      // Reset all form elements
      newRow.querySelectorAll('input, select').forEach(el => {
        if (el.type === 'checkbox') el.checked = false;
        else el.value = '';
      });

      tbody.appendChild(newRow);
    });
  });

  // =======================================================
  // === ADDITIONAL ROWS FOR NON-TABLE SECTIONS ===
  // (e.g., Additional Trainers, Additional POC)
  // =======================================================
  document.querySelectorAll('.section-block .add-row').forEach(button => {
    button.addEventListener('click', () => {
      const block = button.closest('.section-block');
      if (!block) return;

      // Clone the last checklist-row before the button
      const rows = block.querySelectorAll('.checklist-row');
      const lastRow = rows[rows.length - 1];
      if (!lastRow) return;

      const clone = lastRow.cloneNode(true);
      clone.querySelectorAll('input, select').forEach(el => el.value = '');
      block.insertBefore(clone, button);
    });
  });

  // =======================================================
  // === SAVE ALL PAGES TO PDF ===
  // =======================================================
  const saveBtn = document.getElementById('savePDF');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'pt', 'a4');
      const pages = document.querySelectorAll('.page-section');

      const marginX = 30;
      const marginY = 30;
      const maxWidth = 535;
      let firstPage = true;

      for (const page of pages) {
        if (!firstPage) doc.addPage();
        firstPage = false;

        // Page Title
        const title = page.querySelector('h1')?.innerText || 'Section';
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text(title, marginX, marginY);

        // Extract text from page
        const content = page.innerText.replace(/\s+\n/g, '\n').trim();
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(doc.splitTextToSize(content, maxWidth), marginX, marginY + 24, {
          lineHeightFactor: 1.15
        });
      }

      doc.save('Training_Summary.pdf');
    });
  }

  // =======================================================
  // === OPTIONAL: FLOATING BUTTON SMOOTH SCROLL ===
  // =======================================================
  const floatBtn = document.querySelector('.floating-btn');
  if (floatBtn) {
    floatBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
