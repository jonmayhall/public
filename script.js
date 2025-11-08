// =======================================================
// myKaarma Interactive Checklist – Navigation, Add Row, PDF
// =======================================================

window.addEventListener('DOMContentLoaded', () => {

  // ---------- Sidebar Navigation ----------
  const nav = document.getElementById('sidebar-nav');
  const sections = document.querySelectorAll('.page-section');

  if (nav) {
    nav.addEventListener('click', e => {
      const btn = e.target.closest('.nav-btn');
      if (!btn) return;
      const targetId = btn.dataset.target;
      const target = document.getElementById(targetId);
      if (!target) return;

      nav.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      sections.forEach(sec => sec.classList.remove('active'));
      target.classList.add('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Populate dropdowns ----------
  document.querySelectorAll('.yn-select').forEach(sel => {
    if (sel.options.length === 0) {
      ['', 'Yes', 'No', 'Not Trained', 'N/A'].forEach(v => {
        const o = document.createElement('option');
        o.value = v;
        o.textContent = v;
        sel.appendChild(o);
      });
    }
  });
  document.querySelectorAll('.yn-basic').forEach(sel => {
    if (sel.options.length === 0) {
      ['', 'Yes', 'No'].forEach(v => {
        const o = document.createElement('option');
        o.value = v;
        o.textContent = v;
        sel.appendChild(o);
      });
    }
  });

  // ---------- Add Row for tables ----------
  document.querySelectorAll('.table-footer .add-row').forEach(button => {
    button.addEventListener('click', () => {
      const section = button.closest('.section');
      if (!section) return;
      const table = section.querySelector('table.training-table');
      if (!table || !table.tBodies.length) return;

      const tbody = table.tBodies[0];
      const lastRow = tbody.rows[tbody.rows.length - 1];
      if (!lastRow) return;

      const newRow = lastRow.cloneNode(true);
      // Reset inputs & selects
      newRow.querySelectorAll('input, select').forEach(el => {
        if (el.type === 'checkbox') el.checked = false;
        else el.value = '';
      });
      tbody.appendChild(newRow);
    });
  });

  // ---------- Additional Trainers ----------
  document.querySelectorAll('.add-row.small-plus[data-role="additional-trainer"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrap = btn.closest('.multi-input-wrap');
      if (!wrap) return;
      const row = document.createElement('div');
      row.className = 'row-with-plus';
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Additional Trainer Name';
      row.appendChild(input);
      wrap.appendChild(row);
    });
  });

  // ---------- Additional POC ----------
  const addPocBtn = document.getElementById('addPocBtn');
  if (addPocBtn) {
    addPocBtn.addEventListener('click', () => {
      const container = document.getElementById('additional-poc-wrap');
      if (!container) return;

      const block = document.createElement('div');
      block.className = 'contact-block';
      block.innerHTML = `
        <div class="checklist-row">
          <label>Additional POC</label>
          <input type="text" placeholder="Name" />
        </div>
        <div class="checklist-row indent">
          <label>Cell</label>
          <input type="text" />
        </div>
        <div class="checklist-row indent">
          <label>Email</label>
          <input type="email" />
        </div>
      `;
      container.parentNode.insertBefore(block, addPocBtn.closest('.checklist-row'));
    });
  }

  // ---------- Dealership name live update ----------
  const dealerNameInput = document.getElementById('dealer-name');
  const headerName = document.getElementById('dealershipNameDisplay');
  if (dealerNameInput && headerName) {
    dealerNameInput.addEventListener('input', () => {
      headerName.textContent = dealerNameInput.value.trim() || 'Dealership Name';
    });
  }

  // ---------- Save as PDF ----------
  const pdfBtn = document.getElementById('savePDF');
  if (pdfBtn && window.jspdf) {
    pdfBtn.addEventListener('click', () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'pt', 'a4');

      const pages = document.querySelectorAll('.page-section');
      const marginX = 32, marginY = 40, maxWidth = 530;
      let first = true;

      pages.forEach(page => {
        if (!first) doc.addPage();
        first = false;

        const h1 = page.querySelector('h1');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text(h1 ? h1.textContent.trim() : 'Section', marginX, marginY);

        const text = page.innerText.replace(/\s+\n/g, '\n').trim();
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, marginX, marginY + 18, { lineHeightFactor: 1.15 });
      });

      doc.save('Training_Summary.pdf');
    });
  }

});
