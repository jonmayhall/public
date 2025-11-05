// =======================================================
// myKaarma Interactive Checklist – Final JS (Navigation + Tables + PDF)
// =======================================================

document.addEventListener('DOMContentLoaded', () => {
  // === PAGE NAVIGATION ===
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.page-section');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // deactivate all
      navButtons.forEach(b => b.classList.remove('active'));
      sections.forEach(sec => sec.classList.remove('active'));

      // activate clicked
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.target);
      if (target) target.classList.add('active');

      // scroll to top for smooth transition
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // === ADD ROW FUNCTIONALITY ===
  document.querySelectorAll('.add-row').forEach(button => {
    button.addEventListener('click', () => {
      const section = button.closest('.section');
      if (!section) return;
      const table = section.querySelector('table.training-table');
      if (!table) return;

      const tbody = table.tBodies[0];
      if (!tbody.rows.length) return;

      // Clone last row
      const lastRow = tbody.rows[tbody.rows.length - 1];
      const newRow = lastRow.cloneNode(true);

      // Reset fields
      newRow.querySelectorAll('input, select').forEach(el => {
        if (el.type === 'checkbox') el.checked = false;
        else el.value = '';
      });

      tbody.appendChild(newRow);
    });
  });

  // === PDF SAVE ===
  const saveBtn = document.getElementById('savePDF');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'pt', 'a4');
      const pages = document.querySelectorAll('.page-section');

      const marginX = 30, marginY = 30, maxWidth = 535;
      let firstPage = true;

      pages.forEach(page => {
        if (!firstPage) doc.addPage();
        firstPage = false;

        // Add page title
        const title = page.querySelector('h1')?.innerText || 'Section';
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text(title, marginX, marginY);

        // Add body text
        const text = page.innerText.replace(/\s+\n/g, '\n').trim();
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(doc.splitTextToSize(text, maxWidth), marginX, marginY + 24, { lineHeightFactor: 1.15 });
      });

      doc.save('Training_Summary.pdf');
    });
  }
});
