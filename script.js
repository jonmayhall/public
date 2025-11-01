// === SIDEBAR NAVIGATION ===
document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".page-section").forEach((s) => s.classList.remove("active"));
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
    const target = btn.dataset.target;
    document.getElementById(target).classList.add("active");
    btn.classList.add("active");
  });
});

// === DEALERSHIP NAME SYNC ===
const dealerInputs = [
  "dealer-name",
  "dealership-name",
  "dealership",
  "dealerGroup",
  "dealershipName"
];
const headerDisplay = document.getElementById("dealership-display");

document.addEventListener("input", (e) => {
  if (dealerInputs.includes(e.target.id)) {
    headerDisplay.textContent = e.target.value.trim() || "Dealership Name";
  }
});

// === CONDITIONAL FIELDS ===
const trainedSelect = document.getElementById("trainedAll");
const untrainedDiv = document.getElementById("untrainedList");
if (trainedSelect) {
  trainedSelect.addEventListener("change", () => {
    untrainedDiv.style.display = trainedSelect.value === "No" ? "block" : "none";
  });
}

const supportSelect = document.getElementById("supportTickets");
const ticketDiv = document.getElementById("ticketDetails");
if (supportSelect) {
  supportSelect.addEventListener("change", () => {
    ticketDiv.style.display =
      supportSelect.value === "Yes" || supportSelect.value === "Tier 2"
        ? "block"
        : "none";
  });
}

// === AUTOFILL (LIVE SYNC) ===
const autoFillMap = [
  // Source ID → Target ID
  ["onsite-trainers", "cemInfo"],
  ["onsite-trainers", "autoChampion"],
  ["onsite-trainers", "autoBlocker"],
  ["pretraining", "preMondayNotes"],
  ["monday-visit", "preMondayNotes"],
  ["training-checklist", "tuesdayNotes"],
  ["training-checklist", "wednesdayNotes"],
  ["opcodes-pricing", "opcodeIntegrationNotes"],
  ["dms-integration", "opcodeIntegrationNotes"],
];

function gatherPageNotes(pageId) {
  const section = document.getElementById(pageId);
  if (!section) return "";
  const textareas = section.querySelectorAll("textarea");
  let notes = "";
  textareas.forEach((ta) => {
    if (ta.value.trim()) notes += ta.value.trim() + "\n\n";
  });
  return notes.trim();
}

function autoFillAll() {
  autoFillMap.forEach(([source, target]) => {
    const targetBox = document.getElementById(target);
    if (targetBox) {
      targetBox.value = gatherPageNotes(source);
    }
  });
}

// Run autofill on load
document.addEventListener("DOMContentLoaded", autoFillAll);

// Update live as notes change
document.addEventListener("input", (e) => {
  if (e.target.tagName === "TEXTAREA") autoFillAll();
});

// === ADD SMALL INPUT ROWS ===
function addTrainerField(btn) {
  const wrapper = btn.closest(".trainer-input-wrapper");
  const clone = wrapper.cloneNode(true);
  clone.querySelector("input").value = "";
  wrapper.after(clone);
}
function addChampionField(btn) {
  const wrapper = btn.closest(".champion-input-wrapper");
  const clone = wrapper.cloneNode(true);
  clone.querySelector("input").value = "";
  wrapper.after(clone);
}
function addBlockerField(btn) {
  const wrapper = btn.closest(".blocker-input-wrapper");
  const clone = wrapper.cloneNode(true);
  clone.querySelector("input").value = "";
  wrapper.after(clone);
}

// === ADD TABLE ROWS ===
document.querySelectorAll(".add-row").forEach((btn) => {
  btn.addEventListener("click", () => {
    const table = document.getElementById(btn.dataset.target);
    if (!table) return;
    const lastRow = table.querySelector("tbody tr:last-child");
    const clone = lastRow.cloneNode(true);
    clone.querySelectorAll("input, select").forEach((el) => {
      if (el.type === "checkbox") el.checked = false;
      else el.value = "";
    });
    table.querySelector("tbody").appendChild(clone);
  });
});

// === SAVE AS PDF (ALL PAGES) ===
document.addEventListener("DOMContentLoaded", () => {
  const pdfButton = document.getElementById("pdfButton");
  if (!pdfButton) return;

  pdfButton.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "pt", "a4");
    const content = document.body.cloneNode(true);

    content.querySelectorAll("#sidebar, #pdfButton").forEach((el) => el.remove());

    doc.html(content, {
      callback: function (pdf) {
        pdf.save("Training_Summary.pdf");
      },
      x: 10,
      y: 10,
      html2canvas: { scale: 0.6 },
    });
  });
});
