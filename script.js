/* =======================================================
   myKaarma Interactive Training Checklist
   JavaScript — Navigation & Dynamic Table Rows
   Updated November 2025
   ======================================================= */

/* === PAGE NAVIGATION === */
document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".page-section");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons and sections
      navButtons.forEach(b => b.classList.remove("active"));
      sections.forEach(s => s.classList.remove("active"));

      // Add active class to clicked button and corresponding section
      btn.classList.add("active");
      const targetId = btn.getAttribute("data-target");
      const targetSection = document.getElementById(targetId);
      if (targetSection) targetSection.classList.add("active");

      // Scroll to top of main content when switching pages
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  /* === ADD ROW BUTTONS === */
  document.querySelectorAll(".add-row").forEach(button => {
    button.addEventListener("click", () => {
      const targetTable = button.dataset.target
        ? document.getElementById(button.dataset.target)
        : button.closest("table");
      if (!targetTable) return;

      const tbody = targetTable.querySelector("tbody");
      if (!tbody || !tbody.rows.length) return;

      // Clone first row and reset input values
      const newRow = tbody.rows[0].cloneNode(true);
      newRow.querySelectorAll("input, select").forEach(el => {
        if (el.type === "checkbox") el.checked = false;
        else el.value = "";
      });
      tbody.appendChild(newRow);
    });
  });

  /* === DEALERSHIP NAME DISPLAY IN TOP BAR === */
  const dealerNameInput = document.getElementById("dealer-name");
  const dealerDisplay = document.getElementById("dealershipNameDisplay");
  if (dealerNameInput && dealerDisplay) {
    dealerNameInput.addEventListener("input", () => {
      dealerDisplay.textContent = dealerNameInput.value || "";
    });
  }

  /* === PDF SAVE BUTTON (Summary Page Only) === */
  const pdfButton = document.getElementById("pdfButton");
  if (pdfButton) {
    pdfButton.addEventListener("click", () => {
      window.print();
    });
  }
});
