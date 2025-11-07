// =======================================================
// myKaarma Interactive Checklist – Stable Navigation, Table Cloning, PDF Save, and Auto Cache-Buster
// =======================================================

window.addEventListener('DOMContentLoaded', () => {
  // === AUTO CACHE-BUSTER FOR CSS ===
  const cssLink = document.querySelector('link[rel="stylesheet"][href*="style.css"]');
  if (cssLink) {
    const today = new Date();
    const version = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    const hrefBase = cssLink.href.split('?')[0];
    cssLink.href = `${hrefBase}?v=${version}`;
  }

  // === SIDEBAR NAVIGATION ===
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

  // === ADD NEW ROW TO TABLE ===
  document.querySelectorAll('.table-footer .add-row').forEach(button => {
    button.addEventListener('click', () => {
      const section = button.closest('.section');
      if (!section) return;
      const table = section.querySelector('table.training-table');
      if (!table) return;

      const tbody = table.tBodies[0];
      if (!tbody || !tbody.rows.length) return;

      // Clone last row
      const rowToClone = tbody.rows[tbody.rows.length - 1].cloneNode(true);

      // Reset inputs and selects
      rowToClone.querySelectorAll('input, select').forEach(el => {
        if (el.type === 'checkbox') el.checked = false;
        else el.value = '';
      });

      tbody.appendChild(rowToClone);
    });
  });

  // === PDF SAVE BUTTON ===
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

        const title = page.querySelector('h1')?.innerText || 'Section';
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text(title, marginX, marginY);

        const text = page.innerText.replace(/\s+\n/g, '\n').trim();
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(doc.splitTextToSize(text, maxWidth), marginX, marginY + 20, { lineHeightFactor: 1.15 });
      });

      doc.save('Training_Summary.pdf');
    });
  }
});
