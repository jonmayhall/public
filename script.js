// =======================================================
// myKaarma Interactive Checklist – Stable JavaScript
// Version: Nov 7, 2025 @ 3:00 PM
// =======================================================

window.addEventListener("DOMContentLoaded", () => {
  // === Sidebar Navigation ===
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".page-section");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const target = document.getElementById(btn.dataset.target);
      if (!target) return;

      sections.forEach((sec) => sec.classList.remove("active"));
      target.classList.add("active");

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // === Table Dropdown Injection (Fixes ${} literal issue) ===
  document.querySelectorAll(".training-table tbody").forEach((tbody) => {
    tbody.querySelectorAll("tr").forEach((row) => {
      // If the row contains template text, rebuild it
      if (row.innerHTML.includes("${")) {
        const cellCount = (row.innerHTML.match(/repeat\((\d+)/) || [])[1] || 0;
        const dropdowns = Array.from({ length: cellCount }, () =>
          `<td><select>
            <option></option>
            <option>Yes</option>
            <option>No</option>
            <option>Not Trained</option>
            <option>N/A</option>
          </select></td>`
        ).join("");

        // Preserve the first <td> (name + checkbox)
        const firstCell = `<td><input type="checkbox"><input type="text" placeholder="Name"></td>`;
        row.innerHTML = firstCell + dropdowns;
      }
    });
  });

  // === Add-Row Buttons ===
  document.querySelectorAll(".add-row").forEach((button) => {
    button.addEventListener("click", () => {
      const section = button.closest(".section");
      if (!section) return;

      const table = section.querySelector("table.training-table");
      if (!table) return;

      const tbody = table.tBodies[0];
      if (!tbody || !tbody.rows.length) return;

      const lastRow = tbody.rows[tbody.rows.length - 1];
      const newRow = lastRow.cloneNode(true);

      newRow.querySelectorAll("input, select").forEach((input) => {
        if (input.type === "checkbox") input.checked = false;
        else input.value = "";
      });

      tbody.appendChild(newRow);
    });
  });

  // === Save All Pages as PDF ===
  const saveBtn = document.getElementById("savePDF");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF("p", "pt", "a4");
      const pages = document.querySelectorAll(".page-section");

      const marginX = 30;
      const marginY = 40;
      const maxWidth = 540;
      let first = true;

      pages.forEach((page) => {
        if (!first) doc.addPage();
        first = false;

        const title = page.querySelector("h1")?.innerText || "Section";
        const text = page.innerText.slice(0, 1400);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(title, marginX, marginY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(doc.splitTextToSize(text, maxWidth), marginX, marginY + 20);
      });

      doc.save("Training_Summary.pdf");
    });
  }
});
