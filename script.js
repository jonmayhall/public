// =======================================================
// myKaarma Interactive Training Checklist – FULL JS
// Stable + Support Ticket logic + Status Auto-Move
// =======================================================

window.addEventListener('DOMContentLoaded', () => {
  /* === SIDEBAR NAVIGATION === */
  const nav = document.getElementById('sidebar-nav');
  const sections = document.querySelectorAll('.page-section');

  if (nav) {
    nav.addEventListener('click', (e) => {
      const btn = e.target.closest('.nav-btn');
      if (!btn) return;
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;

      // Highlight active nav
      nav.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Swap page
      sections.forEach(sec => sec.classList.remove('active'));
      target.classList.add('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* === ADD ROW HANDLER FOR TRAINING TABLES === */
  document.querySelectorAll('.table-footer .add-row').forEach(button => {
    button.addEventListener('click', () => {
      const section = button.closest('.section');
      if (!section) return;
      const table = section.querySelector('table.training-table');
      if (!table) return;

      const tbody = table.tBodies[0];
      if (!tbody || !tbody.rows.length) return;

      // Clone the last actual row
      const rowToClone = tbody.rows[tbody.rows.length - 1];
      const newRow = rowToClone.cloneNode(true);

      // Reset inputs
      newRow.querySelectorAll('input, select').forEach(el => {
        if (el.type === 'checkbox') el.checked = false;
        else el.value = '';
      });

      tbody.appendChild(newRow);
    });
  });

  /* === SUPPORT TICKET PAGE – GROUP SETUP === */
  const supportSection = document.getElementById('support-ticket');
  let openTicketsBlock = null;
  let closedTicketsBlock = null;

  if (supportSection) {
    const ticketBlocks = supportSection.querySelectorAll('.section-block');
    openTicketsBlock = ticketBlocks[0] || null;
    closedTicketsBlock = ticketBlocks[1] || null;

    // For each section-block (Open / Closed), wrap its ticket fields into a .ticket-group
    ticketBlocks.forEach(block => {
      if (block.querySelector('.ticket-group')) return; // avoid double-wrap

      const children = Array.from(block.children).filter(el => !el.matches('h2'));
      if (!children.length) return;

      const groupWrapper = document.createElement('div');
      groupWrapper.className = 'ticket-group';

      children.forEach(el => groupWrapper.appendChild(el));
      block.appendChild(groupWrapper);
    });
  }

  /* === ADDITIONAL TRAINERS / POC / CHAMPIONS / SUPPORT TICKETS === */
  // Event delegation so cloned "+" buttons also work
  document.querySelectorAll('.section-block').forEach(sectionBlock => {
    sectionBlock.addEventListener('click', (event) => {
      const btn = event.target.closest('.add-row');
      if (!btn || !sectionBlock.contains(btn)) return;

      // If this "+" is on the Support Ticket page, clone the FULL ticket group
      if (btn.closest('#support-ticket')) {
        const block = btn.closest('.section-block');
        if (!block) return;

        const group = btn.closest('.ticket-group');
        if (!group) return;

        const newGroup = group.cloneNode(true);

        // Clear all text inputs and textareas in the new group
        newGroup.querySelectorAll('input[type="text"], textarea').forEach(el => {
          el.value = '';
        });

        // Reset ticket status to Open and enabled
        const statusSelect = newGroup.querySelector('.ticket-status');
        if (statusSelect) {
          statusSelect.disabled = false;
          statusSelect.value = 'Open';
        }

        block.appendChild(newGroup);
        return;
      }

      // Default behavior for other integrated-plus buttons:
      const parent = btn.closest('.checklist-row, .section-block');
      if (!parent) return;

      let input = btn.previousElementSibling;
      if (!input || input.tagName !== 'INPUT') {
        input = parent.querySelector('input[type="text"]');
      }
      if (!input) return;

      const clone = input.cloneNode(true);
      clone.value = '';
      clone.style.marginTop = '6px';
      btn.parentNode.insertBefore(clone, btn);
    });
  });

  /* === STATUS CHANGE HANDLER – MOVE CLOSED TICKETS === */
  if (supportSection && openTicketsBlock && closedTicketsBlock) {
    supportSection.addEventListener('change', (e) => {
      const select = e.target;
      if (!select.classList.contains('ticket-status')) return;

      const group = select.closest('.ticket-group');
      if (!group) return;

      const isInOpen = openTicketsBlock.contains(group);

      // When a ticket in the Open block is set to "Closed",
      // move it to the Closed block and lock the status.
      if (isInOpen && select.value === 'Closed') {
        closedTicketsBlock.appendChild(group);
        select.disabled = true;
      }
    });
  }

  /* === SAVE AS PDF (Training Summary Page) === */
  const saveBtn = document.getElementById('savePDF');
  if (saveBtn) {
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
  }
});
