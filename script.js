// script.js

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupClearButtons();
  setupAddRowButtons();
  setupDealershipNameBinding();
  setupPDFButton();
});

/* ---------------------------------------------
   NAVIGATION – sidebar menu buttons
--------------------------------------------- */
function setupNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".page-section");
  const content = document.getElementById("content");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      if (!targetId) return;

      // Toggle active button
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Toggle visible section
      sections.forEach((sec) => sec.classList.remove("active"));
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add("active");
      }

      // Scroll top of content
      if (content && content.scrollTo) {
        content.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

/* ---------------------------------------------
   CLEAR BUTTONS – per page + global Clear All
--------------------------------------------- */
function setupClearButtons() {
  // "Reset This Page"
  const pageClearButtons = document.querySelectorAll(".clear-page-btn");
  pageClearButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.closest(".page-section");
      if (!section) return;
      clearInputsInElement(section);
    });
  });

  // "Clear All" in top bar
  const clearAllBtn = document.getElementById("clearAllBtn");
  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", () => {
      if (
        !confirm(
          "This will clear ALL inputs on ALL pages of the checklist. Are you sure?"
        )
      ) {
        return;
      }
      clearInputsInElement(document.getElementById("app") || document.body);
      // Reset dealership name display
      const dealershipDisplay = document.getElementById(
        "dealershipNameDisplay"
      );
      if (dealershipDisplay) {
        dealershipDisplay.textContent = "Dealership Name";
      }
    });
  }
}

function clearInputsInElement(root) {
  const fields = root.querySelectorAll("input, textarea, select");
  fields.forEach((el) => {
    const tag = el.tagName.toLowerCase();
    if (tag === "input") {
      const type = el.type.toLowerCase();
      if (type === "checkbox" || type === "radio") {
        el.checked = false;
      } else {
        el.value = "";
      }
    } else if (tag === "textarea") {
      el.value = "";
    } else if (tag === "select") {
      el.selectedIndex = 0;
    }
  });
}

/* ---------------------------------------------
   ADD ROW BUTTONS – tables + integrated-plus rows
--------------------------------------------- */
function setupAddRowButtons() {
  // Use event delegation so it works for dynamically added buttons too
  document.addEventListener("click", (evt) => {
    const btn = evt.target;
    if (!(btn instanceof HTMLElement)) return;
    if (!btn.classList.contains("add-row")) return;

    // 1) Try table rows first
    const tableContainer = btn.closest(".table-container");
    if (tableContainer) {
      const tbody = tableContainer.querySelector("tbody");
      if (!tbody) return;
      const lastRow = tbody.querySelector("tr:last-child");
      if (!lastRow) return;

      const newRow = lastRow.cloneNode(true);
      resetClonedRowInputs(newRow);
      tbody.appendChild(newRow);
      return;
    }

    // 2) Fallback: duplicate a checklist-row (for things like extra contacts)
    const row = btn.closest(".checklist-row");
    if (row && row.parentElement) {
      const newRow = row.cloneNode(true);
      resetClonedRowInputs(newRow);
      row.parentElement.insertBefore(newRow, row.nextSibling);
    }
  });
}

function resetClonedRowInputs(row) {
  const fields = row.querySelectorAll("input, textarea, select");
  fields.forEach((el) => {
    const tag = el.tagName.toLowerCase();
    if (tag === "input") {
      const type = el.type.toLowerCase();
      if (type === "checkbox" || type === "radio") {
        el.checked = false;
      } else {
        el.value = "";
      }
    } else if (tag === "textarea") {
      el.value = "";
    } else if (tag === "select") {
      el.selectedIndex = 0;
    }
  });
}

/* ---------------------------------------------
   DEALERSHIP NAME – sync to top bar
--------------------------------------------- */
function setupDealershipNameBinding() {
  const display = document.getElementById("dealershipNameDisplay");
  if (!display) return;

  // Any input with placeholder "Dealership Name" will control the header
  const inputs = document.querySelectorAll(
    'input[placeholder="Dealership Name"]'
  );
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      display.textContent = input.value.trim() || "Dealership Name";
    });
  });
}

/* ---------------------------------------------
   SAVE AS PDF – basic jsPDF wiring
--------------------------------------------- */
function setupPDFButton() {
  const btn = document.getElementById("savePDF");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    if (!window.jspdf && !window.jsPDF && !window.jspdf?.jsPDF) {
      alert("jsPDF library not loaded.");
      return;
    }

    // Support both UMD and older globals
    const jsPDF =
      window.jspdf?.jsPDF || window.jsPDF || window.jspdf?.default?.jsPDF;

    if (!jsPDF) {
      alert("Unable to access jsPDF.");
      return;
    }

    const doc = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
    });

    // For now, just dump the Training Summary page's textareas into the PDF.
    const summarySection = document.getElementById("training-summary");
    if (!summarySection) {
      alert("Training Summary section not found.");
      return;
    }

    const textareas = summarySection.querySelectorAll("textarea");
    let y = 40;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    textareas.forEach((ta, index) => {
      const label = summarySection
        .querySelectorAll("h2")
        [index]?.textContent?.trim();
      if (label) {
        doc.setFontSize(13);
        doc.text(label, 40, y);
        y += 16;
      }

      doc.setFontSize(11);
      const lines = doc.splitTextToSize(ta.value || "", 520);
      doc.text(lines, 40, y);
      y += lines.length * 13 + 18;

      // Simple page-break if near bottom
      if (y > 760) {
        doc.addPage();
        y = 40;
      }
    });

    doc.save("myKaarma-training-summary.pdf");
  });
}
