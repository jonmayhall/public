// =======================================================
// myKaarma Interactive Checklist – Stable Build JS
// Updated: November 7, 2025
// =======================================================

window.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("sidebar-nav");
  const sections = document.querySelectorAll(".page-section");

  // === SIDEBAR NAVIGATION ===
  if (nav) {
    nav.addEventListener("click", (e) => {
      const btn = e.target.closest(".nav-btn");
      if (!btn) return;
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;

      nav.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      sections.forEach((sec) => sec.classList.remove("active"));
      target.classList.add("active");

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // === ADD ROW TO TRAINING TABLES ===
  document.querySelectorAll(".table-footer .add-row:not([data-addtarget])").forEach((button) => {
    button.addEventListener("click", () => {
      const section = button.closest(".section");
      if (!section) return;
      const table = section.querySelector("table.training-table");
      if (!table) return;

      const tbody = table.tBodies[0];
      if (!tbody || !tbody.rows.length) return;
      const newRow = tbody.rows[0].cloneNode(true);

      newRow.querySelectorAll("input, select").forEach((el) => {
        if (el.type === "checkbox") el.checked = false;
        else el.value = "";
      });
      tbody.appendChild(newRow);
    });
  });

  // === ADDITIONAL TRAINERS ===
  document.querySelectorAll(".add-row[data-addtarget='additionalTrainer']").forEach((button) => {
    button.addEventListener("click", () => {
      const parent = button.closest(".section-block");
      if (!parent) return;
      const newLine = document.createElement("div");
      newLine.className = "checklist-row indented";
      newLine.innerHTML = `
        <label>Additional Trainers</label>
        <input type="text" />
      `;
      parent.insertBefore(newLine, button.parentElement);
    });
  });

  // === ADDITIONAL POC ===
  document.querySelectorAll(".add-row[data-addtarget='additionalPOC']").forEach((button) => {
    button.addEventListener("click", () => {
      const parent = button.closest(".section-block");
      if (!parent) return;

      const group = document.createElement("div");
      group.innerHTML = `
        <div class="checklist-row">
          <label>Additional POC</label>
          <input type="text" />
        </div>
        <div class="checklist-row indented">
          <label>Cell:</label>
          <input type="text" />
        </div>
        <div class="checklist-row indented">
          <label>Email:</label>
          <input type="text" />
        </div>
      `;
      button.closest(".section-block").insertBefore(group, button.parentElement);
    });
  });

  // === SAVE AS PDF ===
  const saveBtn = document.getElementById("savePDF");
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF("p", "pt", "a4");
      const pages = document.querySelectorAll(".page-section");

      const marginX = 30, marginY = 30, lineHeight = 14, maxWidth = 535;
      let first = true;

      pages.forEach((page) => {
        if (!first) doc.addPage();
        first = false;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(page.querySelector("h1")?.innerText || "Section", marginX, marginY);

        const text = page.innerText.replace(/\s+\n/g, "\n").trim();
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(doc.splitTextToSize(text, maxWidth), marginX, marginY + 24, { lineHeightFactor: 1.15 });
      });

      doc.save("Training_Summary.pdf");
    });
  }
});
