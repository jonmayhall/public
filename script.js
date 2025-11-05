// =======================================================
// myKaarma Interactive Checklist – Stable Navigation & Table Cloning
// =======================================================

// Sidebar navigation
window.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('sidebar-nav');
  const sections = document.querySelectorAll('.page-section');

  if (nav) {
    nav.addEventListener('click', (e) => {
      const btn = e.target.closest('.nav-btn');
      if (!btn) return;
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;

      nav.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      sections.forEach(sec => sec.classList.remove('active'));
      target.classList.add('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Add-row handler: clone the LAST data row in this section's table body
  document.querySelectorAll('.table-footer .add-row').forEach(button => {
    button.addEventListener('click', () => {
      const section = button.closest('.section');
      if (!section) return;
      const table = section.querySelector('table.training-table');
      if (!table) return;

      const tbody = table.tBodies[0];
      if (!tbody || !tbody.rows.length) return;

      // find last row with real inputs to clone
      const rowToClone = [...tbody.rows].slice(-1)[0].cloneNode(true);

      // reset fields in the clone
      rowToClone.querySelectorAll('input, select').forEach(el => {
        if (el.type === 'checkbox') el.checked = false;
        else el.value = '';
      });

      tbody.appendChild(rowToClone);
    });
  });

  // Save all pages as PDF from Summary page button
  const saveBtn = document.getElementById('savePDF');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'pt', 'a4');
      const pages = document.querySelectorAll('.page-section');

      const marginX = 30, marginY = 30, lineHeight = 14, maxWidth = 535;
      let first = true;

      pages.forEach(page => {
        if (!first) doc.addPage();
        first = false;

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text(page.querySelector('h1')?.innerText || 'Section', marginX, marginY);

        // Dump text content (simple, reliable fallback)
        const text = page.innerText.replace(/\s+\n/g, '\n').trim();
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(doc.splitTextToSize(text, maxWidth), marginX, marginY + 24, { lineHeightFactor: 1.15 });
      });

      doc.save('Training_Summary.pdf');
    });
  }
});
