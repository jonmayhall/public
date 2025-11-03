// =======================================================
// === myKaarma Interactive Training Checklist Script ===
// =======================================================

window.addEventListener("DOMContentLoaded", () => {
  // === SIDEBAR NAVIGATION ===
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".page-section");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      sections.forEach((s) => s.classList.remove("active"));
      document.getElementById(target).classList.add("active");

      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // === DEALERSHIP NAME SYNC ===
  const dealerGroupInput = document.getElementById("dealerGroup");
  const dealerNameInput = document.getElementById("dealershipName");
  const headerDisplay = document.getElementById("dealership-display");

  function updateHeaderName() {
    const group = dealerGroupInput?.value.trim() || "";
    const name = dealerNameInput?.value.trim() || "";

    let displayText = "Dealership Name";
    if (group && name) displayText = `${group} – ${name}`;
    else if (name) displayText = name;
    else if (group) displayText = group;

    headerDisplay.textContent = displayText;
    localStorage.setItem("dealerGroup", group);
    localStorage.setItem("dealerName", name);
  }

  // Load saved values
  const savedGroup = localStorage.getItem("dealerGroup");
  const savedName = localStorage.getItem("dealerName");
  if (savedGroup) dealerGroupInput.value = savedGroup;
  if (savedName) dealerNameInput.value = savedName;
  updateHeaderName();

  if (dealerGroupInput) dealerGroupInput.addEventListener("input", updateHeaderName);
  if (dealerNameInput) dealerNameInput.addEventListener("input", updateHeaderName);

  // === ADD ROW FUNCTIONALITY ===
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-row")) {
      const id = e.target.dataset.target;
      const table = document.getElementById(id);
      if (!table) return;

      const firstRow = table.querySelector("tbody tr");
      if (!firstRow) return;

      const clone = firstRow.cloneNode(true);
      clone.querySelectorAll("input[type='text']").forEach((input) => (input.value = ""));
      clone.querySelectorAll("textarea").forEach((ta) => (ta.value = ""));
      clone.querySelectorAll("select").forEach((select) => (select.selectedIndex = 0));
      clone.querySelectorAll(".verify").forEach((box) => (box.checked = false));

      table.querySelector("tbody").appendChild(clone);
    }
  });

  // === AUTO EXPAND TEXTAREAS ===
  document.addEventListener("input", (e) => {
    if (e.target.tagName === "TEXTAREA") {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    }
  });

  // === DROPDOWN COLOR FEEDBACK ===
  document.addEventListener("change", (e) => {
    if (e.target.tagName === "SELECT") {
      const value = e.target.value.trim();
      const colors = {
        "Yes": "#d6f5d6",
        "No": "#ffd6d6",
        "N/A": "#f2f2f2",
      };
      e.target.style.backgroundColor = colors[value] || "#fff";
    }
  });

  // === CHECKBOX HIGHLIGHT ===
  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("verify")) {
      const row = e.target.closest("tr");
      if (row) row.style.backgroundColor = e.target.checked ? "#fff8e1" : "";
    }
  });

  // === SAVE AS PDF (ALL PAGES) ===
  const pdfButton = document.getElementById("pdfButton");
  if (pdfButton) {
    pdfButton.addEventListener("click", async () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF("p", "pt", "a4");

      const content = document.querySelector("#content");
      const clone = content.cloneNode(true);

      // Hide sidebar and floating buttons in PDF
      clone.querySelectorAll(".floating-btn, #sidebar").forEach((el) => el.remove());

      await doc.html(clone, {
        callback: function (pdf) {
          pdf.save("Training_Summary.pdf");
        },
        margin: [20, 20, 20, 20],
        autoPaging: "text",
        x: 0,
        y: 0,
        html2canvas: { scale: 0.6 },
      });
    });
  }
});
