// =========================================================
// myKaarma Interactive Training Checklist - script.js
// Includes: robust nav, integrated + handlers, table cloning, save PDF
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- NAVIGATION: robust, auto-stubbed ---------- */
  (function initNav() {
    const navRoot = document.getElementById('sidebar-nav');
    const content = document.getElementById('content');
    if (!navRoot || !content) return;

    const btns = Array.from(navRoot.querySelectorAll('.nav-btn'));
    const sections = () => Array.from(document.querySelectorAll('.page-section'));

    function tidyId(s) {
      return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const sectionById = {};
    sections().forEach(sec => { if (sec.id) sectionById[sec.id] = sec; });

    function findBestMatch(btn) {
      const text = (btn.textContent || btn.innerText || '').trim();
      if (!text) return null;
      const candidateId = tidyId(text);
      if (sectionById[candidateId]) return sectionById[candidateId];
      for (const id in sectionById) {
        if (id.includes(candidateId) || candidateId.includes(id)) return sectionById[id];
      }
      for (const sec of sections()) {
        const h1 = sec.querySelector('h1');
        if (h1 && (h1.innerText || h1.textContent).trim().toLowerCase() === text.toLowerCase()) return sec;
      }
      return null;
    }

    function makeStubSection(id, titleText) {
      const uniqueId = id || tidyId(titleText) || `stub-${Date.now()}`;
      if (document.getElementById(uniqueId)) return document.getElementById(uniqueId);
      const sec = document.createElement('section');
      sec.id = uniqueId;
      sec.className = 'page-section';
      sec.innerHTML = `
        <h1>${titleText || uniqueId}</h1>
        <div class="section-block">
          <h2>Coming Soon</h2>
          <div class="checklist-row">
            <label>This page hasn't been added yet. Add your content here.</label>
            <input type="text" placeholder="Optional note">
          </div>
        </div>`;
      content.appendChild(sec);
      sectionById[uniqueId] = sec;
      console.info('[nav] created stub:', uniqueId);
      return sec;
    }

    // Ensure targets exist
    btns.forEach(btn => {
      const dataTarget = btn.dataset && btn.dataset.target ? btn.dataset.target.trim() : '';
      if (!dataTarget) {
        const found = findBestMatch(btn);
        if (found) {
          btn.dataset.target = found.id;
          console.warn('[nav] mapped button by text to section id=', found.id, btn);
        } else {
          const stub = makeStubSection(null, btn.textContent.trim());
          btn.dataset.target = stub.id;
          console.warn('[nav] created stub for button with no data-target:', stub.id, btn);
        }
      } else if (!document.getElementById(dataTarget)) {
        const found = findBestMatch(btn);
        if (found) {
          btn.dataset.target = found.id;
          console.warn('[nav] remapped missing data-target to existing section:', found.id, btn);
        } else {
          const stub = makeStubSection(dataTarget, btn.textContent.trim());
          btn.dataset.target = stub.id;
          console.warn('[nav] created stub for missing data-target:', stub.id, btn);
        }
      }
    });

    function activate(targetId) {
      const target = document.getElementById(targetId);
      if (!target) return;
      btns.forEach(b => b.classList.toggle('active', b.dataset.target === targetId));
      document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.info('[nav] activated', targetId);
    }

    navRoot.addEventListener('click', (e) => {
      const btn = e.target.closest('.nav-btn');
      if (!btn) return;
      const targetId = btn.dataset.target;
      if (!targetId) return;
      activate(targetId);
    });

    // support keyboard activation
    navRoot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const btn = e.target.closest('.nav-btn');
        if (btn) { btn.click(); e.preventDefault(); }
      }
    });

    // initial activation
    const hash = location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) activate(hash);
    else {
      const existing = document.querySelector('.page-section.active');
      if (existing) {
        btns.forEach(b => b.classList.toggle('active', b.dataset.target === existing.id));
      } else {
        const firstTarget = btns.find(b => b.dataset.target)?.dataset.target;
        if (firstTarget) activate(firstTarget);
      }
    }

    // debug helper
    window.__navDebug = {
      listButtons: () => btns.map(b => ({ text: b.textContent.trim(), target: b.dataset.target })),
      listSections: () => Array.from(document.querySelectorAll('.page-section')).map(s => ({ id: s.id, title: (s.querySelector('h1')?.innerText || '').trim() })),
      activate,
      makeStubSection
    };
  })();


  /* ---------- INTEGRATED "+" (non-table) handlers ---------- */
  (function initInlineAdds() {
    // Delegate clicks on any inline .add-inline buttons inside checklist rows
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('.add-inline');
      if (!btn) return;
      const row = btn.closest('.checklist-row');
      if (!row) return;
      // clone the input(s) we want to duplicate:
      // If row contains only a single input[type=text], clone that (common case)
      const input = row.querySelector('input[type="text"]');
      if (input) {
        const newInput = input.cloneNode(true);
        newInput.value = '';
        newInput.style.marginTop = '6px';
        // Insert the new input ABOVE the button so the + remains on the bottom-most field
        row.insertBefore(newInput, btn);
        newInput.focus();
      } else {
        // fallback: clone whole row (simple)
        const clone = row.cloneNode(true);
        clone.querySelectorAll('input').forEach(i => i.value = '');
        row.parentNode.insertBefore(clone, row.nextSibling);
      }
    });
  })();


  /* ---------- TABLE add-row cloning (footer +) ---------- */
  (function initTableAdders() {
    document.body.addEventListener('click', (e) => {
      const footerBtn = e.target.closest('.table-footer .add-row');
      if (!footerBtn) return;
      const section = footerBtn.closest('.section, .page-section');
      const table = section?.querySelector('table.training-table');
      const tbody = table?.tBodies?.[0];
      if (!tbody || !tbody.rows.length) return;
      const rowToClone = tbody.rows[tbody.rows.length - 1];
      const newRow = rowToClone.cloneNode(true);
      newRow.querySelectorAll('input, select').forEach(el => {
        if (el.type === 'checkbox') el.checked = false;
        else el.value = '';
      });
      tbody.appendChild(newRow);
    });
  })();


  /* ---------- Save as PDF (basic text export) ---------- */
  (function initSavePDF() {
    const saveBtn = document.getElementById('savePDF');
    if (!saveBtn) return;
    saveBtn.addEventListener('click', async () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'pt', 'a4');
      const pages = document.querySelectorAll('.page-section');
      const marginX = 30, marginY = 30, maxWidth = 535;
      let first = true;
      for (const page of pages) {
        if (!first) doc.addPage();
        first = false;
        const title = page.querySelector('h1')?.innerText || 'Section';
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text(title, marginX, marginY);
        const text = page.innerText.replace(/\s+\n/g, '\n').trim();
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, marginX, marginY + 24);
      }
      doc.save('Training_Summary.pdf');
    });
  })();
});
