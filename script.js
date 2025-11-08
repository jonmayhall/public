// =======================================================
// myKaarma Interactive Training Checklist – Stable Build
// Version: November 7, 2025 (3:00 PM)
// =======================================================

window.addEventListener("DOMContentLoaded", () => {
  // === Sidebar Navigation ===
  const nav = document.getElementById("sidebar-nav");
  const sections = document.querySelectorAll(".page-section");

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

  // === Add Row Functionality ===
  document.querySelectorAll(".add-row").forEach((button) => {
    button.addEventListener("click", () => {
      const section = button.closest(".section") || button.closest(".section-block");
      if (!section) return;
      const table = section.querySelector("table.training-table");
      if (!table) return;

      const tbody = table.tBodies[0];
      if (!tbody || !tbody.rows.length) return;

      const lastRow = tbody.rows[tbody.rows.length - 1];
      const newRow = lastRow.cloneNode(true);

      newRow.querySelectorAll("input, select").forEach((el) => {
        if (el.type === "checkbox") el.checked = false;
        else el.value = "";
      });

      tbody.appendChild(newRow);
    });
  });

  // === PDF Save ===
  const saveBtn = document.getElementById("savePDF");
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF("p", "pt", "a4");
      const pages = document.querySelectorAll(".page-section");

      const marginX = 40,
        marginY = 40,
        maxWidth = 500;

      let first = true;

      pages.forEach((page) => {
        if (!first) doc.addPage();
        first = false;

        // Section Title
        const title = page.querySelector("h1")?.innerText || "Section";
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(title, marginX, marginY);

        // Extract text content
        const text = page.innerText.replace(/\s+\n/g, "\n").trim();
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(doc.splitTextToSize(text, maxWidth), marginX, marginY + 24, {
          lineHeightFactor: 1.15,
        });
      });

      doc.save("Training_Summary.pdf");
    });
  }
});
