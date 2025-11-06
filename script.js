/* =======================================================
   myKaarma Interactive Training Checklist – JS Logic
   Updated: November 2025
   ======================================================= */

/* === SIDEBAR NAVIGATION (Stable) === */
document.addEventListener('DOMContentLoaded', () => {
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.page-section');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.dataset.target;
      sections.forEach(sec => sec.classList.remove('active'));
      const targetSection = document.getElementById(targetId);
      if (targetSection) targetSection.classList.add('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  /* === ADD ROW BUTTONS === */
  document.querySelectorAll('.add-row').forEach(button => {
    button.addEventListener('click', () => {
      const table = button.closest('.section')?.querySelector('table');
      if (table) {
        const tbody = table.tBodies[0];
        const rowClone = tbody.rows[tbody.rows.length - 1].cloneNode(true);
        rowClone.querySelectorAll('input, select').forEach(el => {
          if (el.type === 'checkbox') el.checked = false;
          else el.value = '';
        });
        tbody.appendChild(rowClone);
      } else {
        // For Additional Trainers add button
        const parent = button.closest('.checklist-row');
        const newRow = parent.cloneNode(true);
        newRow.querySelector('input').value = '';
        parent.after(newRow);
      }
    });
  });

  /* =======================================================
     PAGE COMPLETION + TIMESTAMP
     ======================================================= */
  const pages = document.querySelectorAll('.page-section');
  pages.forEach(page => {
    const statusBanner = page.querySelector('.page-status');
    if (!statusBanner) return;

    const updateStatus = () => {
      const inputs = [...page.querySelectorAll('input, select')]
        .filter(el => !el.closest('.section-block.comment-box'));
      const filled = inputs.filter(el => {
        if (el.type === 'checkbox') return el.checked;
        return el.value.trim() !== '';
      });
      if (filled.length && filled.length === inputs.length) {
        const now = new Date();
        const ts = now.toLocaleString();
        statusBanner.textContent = `Page completed ${ts}`;
        statusBanner.style.background = '#d8f6d0';
        statusBanner.style.borderColor = '#8ac78a';
      } else {
        statusBanner.textContent = 'Incomplete';
        statusBanner.style.background = '#f6f6f6';
        statusBanner.style.borderColor = '#ccc';
      }
    };
    page.addEventListener('input', updateStatus);
    updateStatus();
  });

  /* =======================================================
     AUTO HEADER UPDATE – DEALERSHIP NAME
     ======================================================= */
  const dealerInput = document.querySelector('#dealership-info input:nth-of-type(2)');
  const groupInput = document.querySelector('#dealership-info input:nth-of-type(1)');
  const headerDisplay = document.getElementById('dealershipNameDisplay');

  const updateHeader = () => {
    const dealer = dealerInput?.value?.trim();
    const group = groupInput?.value?.trim();
    if (!dealer) {
      headerDisplay.textContent = 'Dealership Name';
      return;
    }
    if (!group || /^(n\/a|none|unknown|i\s?don.?t\s?know)$/i.test(group))
      headerDisplay.textContent = dealer;
    else
      headerDisplay.textContent = `${group} – ${dealer}`;
  };
  dealerInput?.addEventListener('input', updateHeader);
  groupInput?.addEventListener('input', updateHeader);
  updateHeader();

  /* =======================================================
     TRAINING END DATE AUTO-FILL (2 days after start)
     ======================================================= */
  const start = document.getElementById('trainingStart');
  const end = document.getElementById('trainingEnd');
  if (start && end) {
    start.addEventListener('change', () => {
      const sDate = new Date(start.value);
      if (!isNaN(sDate)) {
        const endDate = new Date(sDate);
        endDate.setDate(sDate.getDate() + 2);
        const formatted = endDate.toISOString().split('T')[0];
        end.value = formatted;
      }
    });
  }

  /* =======================================================
     GOOGLE SHEETS SUBMIT (Trainer sync)
     ======================================================= */
  const formURL = "https://script.google.com/macros/s/AKfycbwPRZ8t3_jqP-KMvFgo0dVK1aeWQero81RoOi9_h0luQMaCrRJ6wDBPwomk_d_GnoA9Gg/exec";
  const saveBtn = document.getElementById('savePDF') || document.getElementById('submitSummary');
  const trainerSelect = document.getElementById('leadTrainerSelect');

  async function submitToSheet() {
    const allData = {};
    document.querySelectorAll('.page-section').forEach(page => {
      const pageId = page.id;
      const fields = [...page.querySelectorAll('input, select, textarea')]
        .map(el => ({ name: el.placeholder || el.previousSibling?.textContent || '', value: el.value }));
      allData[pageId] = fields;
    });

    const payload = {
      timestamp: new Date().toLocaleString(),
      trainer: trainerSelect?.value || '',
      data: JSON.stringify(allData)
    };

    try {
      await fetch(formURL, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      });
      alert('Training Summary successfully submitted to Google Sheets!');
    } catch (err) {
      alert('Error submitting to Google Sheets.');
      console.error(err);
    }
  }

  if (saveBtn) saveBtn.addEventListener('click', submitToSheet);

  /* =======================================================
     NOTES AUTO-FILL TO SUMMARY PAGE
     ======================================================= */
  const summary = document.getElementById('training-summary');
  if (summary) {
    const fillMap = {
      pretraining: 'Pre-Training & Monday Visit Notes',
      dealership-info: 'Pre-Training & Monday Visit Notes',
      onsite-trainers: 'Pre-Training & Monday Visit Notes',
      training-checklist: 'End of Day Training Summary - Tuesday',
      opcodes-pricing: 'End of Day Training Summary - Thursday',
      dms-integration: 'Opcode, Pricing, and Integrations Notes',
      'post-training': 'Post-Training Checklist Notes'
    };

    const fillSummary = () => {
      Object.entries(fillMap).forEach(([id, sectionHeader]) => {
        const srcPage = document.getElementById(id);
        const destBox = [...summary.querySelectorAll('.section-block h2')]
          .find(h2 => h2.textContent.includes(sectionHeader))
          ?.parentElement.querySelector('textarea');
        if (srcPage && destBox) {
          const notes = [...srcPage.querySelectorAll('.section-block.comment-box textarea')]
            .map(t => t.value.trim()).filter(Boolean).join('\n\n');
          if (notes) destBox.value = notes;
        }
      });
    };

    document.querySelectorAll('textarea').forEach(t => t.addEventListener('input', fillSummary));
    fillSummary();
  }
});
