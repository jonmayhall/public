// === Sidebar Navigation ===
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    const target = document.getElementById(btn.dataset.target);
    if (target) target.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// === Add Row Buttons ===
document.querySelectorAll('.add-row').forEach(button => {
  button.addEventListener('click', () => {
    const table = button.closest('.section, .section-block').querySelector('table');
    if (!table) return;
    const row = table.querySelector('tbody tr').cloneNode(true);
    row.querySelectorAll('input, select').forEach(el => {
      if (el.type === 'checkbox') el.checked = false;
      else el.value = '';
    });
    table.querySelector('tbody').appendChild(row);
  });
});

// === Add Additional POC ===
document.querySelectorAll('.add-poc').forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.closest('.section-block');
    const clone = section.querySelectorAll('.checklist-row')[3].cloneNode(true);
    clone.querySelectorAll('input').forEach(i => (i.value = ''));
    section.insertBefore(clone, btn.closest('.table-footer'));
  });
});

// === Add Additional Trainer ===
document.querySelectorAll('.add-trainer').forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.closest('.section-block');
    const clone = section.querySelector('input[type="text"]').cloneNode(true);
    clone.value = '';
    const newRow = document.createElement('div');
    newRow.classList.add('checklist-row');
    newRow.style.paddingLeft = '40px';
    const label = document.createElement('label');
    label.textContent = 'Additional Trainers';
    newRow.appendChild(label);
    newRow.appendChild(clone);
    section.insertBefore(newRow, btn.closest('.table-footer'));
  });
});

// === Auto-Fill Training End Date ===
const startDate = document.getElementById('trainingStartDate');
const endDate = document.getElementById('trainingEndDate');
if (startDate && endDate) {
  startDate.addEventListener('change', () => {
    const start = new Date(startDate.value);
    if (isNaN(start)) return;
    const end = new Date(start);
    end.setDate(start.getDate() + 2);
    endDate.value = end.toISOString().split('T')[0];
  });
}

// === Auto Update Header with Dealer Group + Dealership Name ===
const dealerGroupInput = document.getElementById('dealerGroup');
const dealershipInput = document.getElementById('dealershipName');
const displayName = document.getElementById('dealershipNameDisplay');

function updateHeaderName() {
  const group = (dealerGroupInput?.value || '').trim();
  const name = (dealershipInput?.value || '').trim();
  const ignore = ['n/a', 'none', 'no', 'unknown', 'idk', "i don't know"];
  if (!name) return (displayName.textContent = 'Dealership Name');
  if (!group || ignore.includes(group.toLowerCase())) displayName.textContent = name;
  else displayName.textContent = `${group} – ${name}`;
}

if (dealerGroupInput && dealershipInput) {
  dealerGroupInput.addEventListener('input', updateHeaderName);
  dealershipInput.addEventListener('input', updateHeaderName);
}

// === Page Completion + Timestamp ===
const pages = document.querySelectorAll('.page-section');
pages.forEach(page => {
  const inputs = page.querySelectorAll('input[type="text"], input[type="date"], select');
  const notes = page.querySelectorAll('textarea');
  const banner = page.querySelector('.page-complete-banner');
  const timestamp = page.querySelector('.timestamp');

  function checkComplete() {
    let complete = true;
    inputs.forEach(el => {
      if (!el.value) complete = false;
    });
    if (complete) {
      banner.textContent = '✅ This page is complete.';
      banner.classList.add('visible');
      const now = new Date().toLocaleString();
      timestamp.textContent = `Completed on ${now}`;
    } else {
      banner.classList.remove('visible');
      timestamp.textContent = '';
    }
  }

  inputs.forEach(el => el.addEventListener('input', checkComplete));
});

// === Toast Notification ===
const toast = document.createElement('div');
toast.id = 'toast';
document.body.appendChild(toast);
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2000);
}

// === Notes Autofill into Summary ===
function syncNotes() {
  const pretrainingNotes = document.querySelector('#pretraining textarea')?.value || '';
  const mondayNotes = document.querySelector('#monday-visit textarea')?.value || '';
  const trainingNotes = document.querySelector('#training-checklist textarea')?.value || '';
  const opNotes = document.querySelector('#opcodes-pricing textarea')?.value || '';
  const dmsNotes = document.querySelector('#dms-integration textarea')?.value || '';
  const postNotes = document.querySelector('#post-training textarea')?.value || '';

  document.getElementById('summary-pretraining').value = `${pretrainingNotes}\n${mondayNotes}`;
  document.getElementById('summary-tuesday').value = trainingNotes;
  document.getElementById('summary-wednesday').value = opNotes;
  document.getElementById('summary-dms').value = dmsNotes;
  document.getElementById('summary-posttraining').value = postNotes;

  showToast('✅ Notes updated in Training Summary');
}

document.querySelectorAll('textarea').forEach(t =>
  t.addEventListener('input', () => {
    syncNotes();
  })
);

// === Save as PDF ===
document.getElementById('savePDFBtn')?.addEventListener('click', async () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'letter' });

  const pages = document.querySelectorAll('.page-section');
  let y = 40;

  for (const section of pages) {
    const title = section.querySelector('h1').innerText;
    pdf.setFontSize(14);
    pdf.text(title, 40, y);
    y += 20;

    const content = section.innerText.trim().substring(0, 1000);
    const split = pdf.splitTextToSize(content, 520);
    pdf.setFontSize(10);
    pdf.text(split, 40, y);
    y += split.length * 12 + 20;

    if (y > 700) {
      pdf.addPage();
      y = 40;
    }
  }

  pdf.save('Training_Checklist.pdf');
});

// === Submit to Google Sheets ===
document.getElementById('submitGoogleBtn')?.addEventListener('click', () => {
  const data = {};
  document.querySelectorAll('input, select, textarea').forEach(el => {
    const label = el.closest('.checklist-row')?.querySelector('label')?.textContent || el.id || 'unlabeled';
    data[label] = el.value;
  });
  fetch('https://script.google.com/macros/s/AKfycbwPRZ8t3_jqP-KMvFgo0dVK1aeWQero81RoOi9_h0luQMaCrRJ6wDBPwomk_d_GnoA9Gg/exec', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.text())
  .then(() => showToast('✅ Submitted to Google Sheet'))
  .catch(() => showToast('⚠️ Error submitting form'));
});
