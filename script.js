// =======================================================
// myKaarma Interactive Training Checklist
// Full Functional JS – Restored Stable Build
// =======================================================

// Wait until the DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {

  // =======================================================
  // SIDEBAR NAVIGATION
  // =======================================================
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".page-section");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Hide all page sections, then show the selected one
      sections.forEach((sec) => sec.classList.remove("active"));
      const target = document.getElementById(btn.dataset.target);
      if (target) target.classList.add("active");

      // Scroll smoothly to the top
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // =======================================================
  // ADD-ROW FUNCTIONALITY FOR TABLES
  // =======================================================
  const addRowButtons = document.querySelectorAll(".add-row");
  addRowButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const table = button.closest(".section").querySelector("table.training-table");
      if (!table) return;

      const tbody = table.tBodies[0];
      if (!tbody || !tbody.rows.length) return;

      // Clone the last row
      const rowToClone = tbody.rows[tbody.rows.length - 1];
      const newRow = rowToClone.cloneNode(true);

      // Reset all inputs and selects in the new row
      newRow.querySelectorAll("input, select").forEach((el) => {
        if (el.type === "checkbox") el.checked = false;
        else el.value = "";
      });

      // Append the new row to the table body
      tbody.appendChild(newRow);
    });
  });

  // =======================================================
  // ADDITIONAL TRAINERS SECTION
  // =======================================================
  const addTrainerBtn = document.querySelector(".add-trainer-btn");
  const trainerSection = document.getElementById("additionalTrainers");

  if (addTrainerBtn && trainerSection) {
    addTrainerBtn.addEventListener("click", () => {
      const newTrainerRow = document.createElement("div");
      newTrainerRow.classList.add("checklist-row");
      newTrainerRow.style.paddingLeft = "40px";
      newTrainerRow.innerHTML = `
        <label>Additional Trainer</label>
        <input type="text" placeholder="Trainer Name">
      `;
      trainerSection.appendChild(newTrainerRow);
    });
  }

  // =======================================================
  // ADDITIONAL POC SECTION (DEALERSHIP INFO PAGE)
  // =======================================================
  const addPocBtn = document.querySelector(".add-poc-btn");
  const pocContainer = document.getElementById("additionalPOCs");

  if (addPocBtn && pocContainer) {
    addPocBtn.addEventListener("click", () => {
      const block = document.createElement("div");
      block.innerHTML = `
        <div class="checklist-row" style="padding-left:40px;">
          <label>Additional POC</label>
          <input type="text" placeholder="Full Name">
        </div>
        <div class="checklist-row" style="padding-left:60px;">
          <label>Cell</label>
          <input type="text" placeholder="(xxx) xxx-xxxx">
        </div>
        <div class="checklist-row" style="padding-left:60px;">
          <label>Email</label>
          <input type="email" placeholder="example@email.com">
        </div>
      `;
      pocContainer.appendChild(block);
    });
  }

  // =======================================================
  // AUTO-FILL TRAINING END DATE
  // =======================================================
  const startDateInput = document.querySelector("#trainingStartDate");
  const endDateInput = document.querySelector("#trainingEndDate");

  if (startDateInput && endDateInput) {
    startDateInput.addEventListener("change", () => {
      const startDate = new Date(startDateInput.value);
      if (!isNaN(startDate)) {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 2);

        // Format YYYY-MM-DD
        const formatted = endDate.toISOString().split("T")[0];
        endDateInput.value = formatted;
      }
    });
  }

  // =======================================================
  // SAVE AS PDF (Optional future use)
  // =======================================================
  const saveBtn = document.getElementById("savePDF");
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF("p", "pt", "a4");
      const pages = document.querySelectorAll(".page-section");

      const marginX = 30, marginY = 30, maxWidth = 535;
      let first = true;

      pages.forEach((page) => {
        if (!first) doc.addPage();
        first = false;

        // Title
        const title = page.querySelector("h1")?.innerText || "Section";
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(title, marginX, marginY);

        // Page text content
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
