/* ============================================================
   INIT (Runs even with dynamic cache-busting)
============================================================ */

function initChecklistApp() {
  setupNavigation();
  setupClearButtons();
  setupAddRowButtons();
  setupDealershipNameBinding();
  setupPDFButton();
  console.log("Checklist App Initialized");
}

// If DOM not ready, wait. If already ready (auto cache-buster), run now.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initChecklistApp);
} else {
  initChecklistApp();
}

/* ============================================================
   NAVIGATION — Sidebar Menu
============================================================ */

function setupNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".page-section");
  const content = document.getElementById("content");

  if (!navButtons.length) {
    console.warn("No nav buttons found.");
    return;
  }

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      if (!targetId) return;

      // Activate clicked button
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Switch page
      sections.forEach((sec) => sec.classList.remove("active"));
      const page = document.getElementById(targetId);
      if (page) page.classList.add("active");

      // Scroll top
      if (content) {
        content.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

/* ============================================================
   RESET PAGE + CLEAR ALL
============================================================ */

function setupClearButtons() {
  // Per-page reset button
  document.querySelectorAll(".clear-page-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.closest(".page-section");
      if (section) {
        clearInputs(section);
      }
    });
  });

  // Global Clear All
  const clearAll = document.getElementById("clearAllBtn");
  if (clearAll) {
    clearAll.addEventListener("click", () => {
      if (!confirm("Clear ALL fields on ALL pages?")) return;

      const app = document.getElementById("app");
      clearInputs(app);

      const display = document.getElementById("dealershipNameDisplay");
      if (display) display.textContent = "Dealership Name";
    });
  }
}

function clearInputs(root) {
  const fields = root.querySelectorAll("input, textarea, select");

  fields.forEach((el) => {
    const tag = el.tagName.toLowerCase();

    if (tag === "input") {
      if (el.type === "checkbox" || el.type === "radio") {
        el.checked = false;
      } else el.value = "";
    }

    if (tag === "textarea") el.value = "";
    if (tag === "select") el.selectedIndex = 0;
  });
}

/* ============================================================
   ADD ROW BUTTONS — Tables & Dynamic Rows
============================================================ */

function setupAddRowButtons() {
  document.addEventListener("click", (e) => {
    const btn = e.target;
    if (!btn.classList.contains("add-row")) return;

    // TABLE ROW ADDING
    const tableContainer = btn.closest(".table-container");
    if (tableContainer) {
      const tbody = tableContainer.querySelector("tbody");
      if (!tbody) return;

      const last = tbody.querySelector("tr:last-child");
      if (!last) return;

      const clone = last.cloneNode(true);
      resetRowInputs(clone);
      tbody.appendChild(clone);
      return;
    }

    // CHECKLIST ROW ADDING (e.g. Additional Contacts)
    const row = btn.closest(".checklist-row");
    if (row && row.parentElement) {
      const clone = row.cloneNode(true);
      resetRowInputs(clone);
      row.parentElement.insertBefore(clone, row.nextSibling);
    }
  });
}

function resetRowInputs(row) {
  const fields = row.querySelectorAll("input, textarea, select");

  fields.forEach((el) => {
    const tag = el.tagName.toLowerCase();

    if (tag === "input") {
      if (el.type === "checkbox") el.checked = false;
      else el.value = "";
    }

    if (tag === "textarea") el.value = "";
    if (tag === "select") el.selectedIndex = 0;
  });
}

/* ============================================================
   DEALERSHIP NAME — Live Sync to Top Bar
============================================================ */

function setupDealershipNameBinding() {
  const display = document.getElementById("dealershipNameDisplay");
  if (!display) return;

  const inputs = document.querySelectorAll('input[placeholder="Dealership Name"]');

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      display.textContent = input.value.trim() || "Dealership Name";
    });
  });
}

/* ============================================================
   SAVE AS PDF — Train Summary (Basic jsPDF)
============================================================ */

function setupPDFButton() {
  const btn = document.getElementById("savePDF");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const jsPDF =
      window.jspdf?.jsPDF || window.jsPDF || window.jspdf?.default?.jsPDF;

    if (!jsPDF) {
      alert("jsPDF not loaded.");
      return;
    }

    const doc = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
    const section = document.getElementById("training-summary");

    if (!section) {
      alert("Training Summary not found.");
      return;
    }

    const textareas = section.querySelectorAll("textarea");
    const headers = section.querySelectorAll("h2");

    let y = 40;

    textareas.forEach((ta, i) => {
      const header = headers[i]?.textContent?.trim();
      if (header) {
        doc.setFontSize(13);
        doc.text(header, 40, y);
        y += 16;
      }

      doc.setFontSize(11);

      const lines = doc.splitTextToSize(ta.value, 520);
      doc.text(lines, 40, y);
      y += lines.length * 14 + 18;

      if (y > 750) {
        doc.addPage();
        y = 40;
      }
    });

    doc.save("training-summary.pdf");
  });
}
