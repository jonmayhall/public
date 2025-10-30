// =======================================================
// === MAIN SITE SCRIPT – myKaarma Interactive Checklist ===
// =======================================================

window.addEventListener("DOMContentLoaded", () => {

  // === SIDEBAR NAVIGATION ===
  const nav = document.getElementById("sidebar-nav");
  if (nav) {
    nav.addEventListener("click", (e) => {
      const btn = e.target.closest(".nav-btn");
      if (!btn) return;

      const target = btn.dataset.target;
      const section = document.getElementById(target);
      if (!section) return;

      document.querySelector(".page-section.active")?.classList.remove("active");
      section.classList.add("active");

      nav.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // =======================================================
  // === COLOR CODE DROPDOWNS ===
  // =======================================================
  document.addEventListener("change", (e) => {
    if (e.target.tagName === "SELECT") {
      const value = e.target.value;
      const colors = {
        "Yes": "#c9f7c0",
        "Web Only": "#fff8b3",
        "Mobile Only": "#ffe0b3",
        "No": "#ffb3b3",
        "Not Trained": "#ffb3b3",
        "N/A": "#f2f2f2",
        "Yes, each has their own": "#c9f7c0",
        "Yes, but they are sharing": "#fff8b3"
      };
      e.target.style.backgroundColor = colors[value] || "#f2f2f2";
    }
  });

  // =======================================================
  // === ADD ROW FUNCTION (clones first data row) ===
  // =======================================================
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("add-row")) return;
    const id = e.target.dataset.target;
    const table = document.getElementById(id);
    if (!table) return;

    const firstRow = table.querySelector("tbody tr");
    if (!firstRow) return;
    const clone = firstRow.cloneNode(true);

    // clear inputs/selects
    clone.querySelectorAll("input[type='text']").forEach((input) => (input.value = ""));
    clone.querySelectorAll("input[type='checkbox']").forEach((chk) => (chk.checked = false));
    clone.querySelectorAll("select").forEach((sel) => { sel.selectedIndex = 0; sel.style.backgroundColor = "#f2f2f2"; });

    table.querySelector("tbody").appendChild(clone);
  });

  // =======================================================
  // === AUTO-EXPAND TEXTAREAS ===
  // =======================================================
  document.addEventListener("input", (e) => {
    if (e.target.tagName === "TEXTAREA") {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    }
  });

  // =======================================================
  // === CHECKBOX VISUAL FEEDBACK ===
  // =======================================================
  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("verify")) {
      const cell = e.target.closest("td,th");
      if (cell) cell.style.backgroundColor = e.target.checked ? "#fff7ed" : "";
    }
  });

  // =======================================================
  // === PDF EXPORT ===
  // =======================================================
  const pdfButton = document.getElementById("pdfButton");
  if (pdfButton) {
    pdfButton.addEventListener("click", () => {
      const active = document.querySelector(".page-section.active");
      import("https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js")
        .then((html2pdf) => {
          html2pdf.default().from(active).save(`${active.id}.pdf`);
        });
    });
  }

});
