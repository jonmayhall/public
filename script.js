// Run after DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {

  // === SIDEBAR NAVIGATION ===
  const nav = document.getElementById("sidebar-nav");
  const sections = document.querySelectorAll(".page-section");

  if (nav) {
    nav.addEventListener("click", (e) => {
      const btn = e.target.closest(".nav-btn");
      if (!btn) return;

      const target = btn.dataset.target;
      const section = document.getElementById(target);
      if (!section) return;

      // Fade-out active section
      const active = document.querySelector(".page-section.active");
      if (active) {
        active.classList.remove("active");
        active.classList.add("fade-out");
        setTimeout(() => active.classList.remove("fade-out"), 250);
      }

      // Delay fade-in
      setTimeout(() => {
        sections.forEach((s) => s.classList.remove("active"));
        section.classList.add("active", "fade-in");
        setTimeout(() => section.classList.remove("fade-in"), 250);
      }, 150);

      // Highlight active button
      nav.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // === DROPDOWN COLOR CODING ===
  document.addEventListener("change", (e) => {
    if (e.target.tagName === "SELECT") {
      const value = e.target.value;
      const colors = {
        "Yes": "#c9f7c0",
        "Web Only": "#fff8b3",
        "Mobile Only": "#ffe0b3",
        "No": "#ffb3b3",
        "Not Trained": "#ffb3b3",
        "N/A": "#f2f2f2"
      };
      e.target.style.backgroundColor = colors[value] || "#f2f2f2";
    }
  });

  // === ADD ROW FUNCTION ===
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("add-row")) return;

    const id = e.target.dataset.target;
    const table = document.getElementById(id);
    if (!table) return;

    const firstRow = table.querySelector("tbody tr");
    const clone = firstRow.cloneNode(true);

    // Clear inputs
    clone.querySelectorAll("input[type='text']").forEach((input) => input.value = "");
    clone.querySelectorAll("input[type='checkbox']").forEach((cb) => cb.checked = false);
    clone.querySelectorAll("select").forEach((select) => {
      select.selectedIndex = 0;
      select.style.backgroundColor = "#f2f2f2";
    });

    table.querySelector("tbody").appendChild(clone);
    if (id === "mpi-opcodes") updateRowNumbers();
  });

  // === AUTO EXPAND TEXTAREAS ===
  document.addEventListener("input", (e) => {
    if (e.target.tagName === "TEXTAREA") {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    }
  });

  // === SORTABLEJS FOR DRAGGING ===
  const sortableScript = document.createElement("script");
  sortableScript.src = "https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js";
  document.head.appendChild(sortableScript);

  sortableScript.onload = () => {
    document.querySelectorAll(".draggable-table tbody").forEach((tbody) => {
      new Sortable(tbody, {
        animation: 150,
        handle: "td",
        ghostClass: "dragging",
        onEnd: () => {
          if (tbody.closest("table").id === "mpi-opcodes") {
            updateRowNumbers();
          }
        }
      });
    });
  };

  // === PDF EXPORT ===
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

  // === UPDATE ROW NUMBERS (for MPI table) ===
  function updateRowNumbers() {
    const mpiTable = document.getElementById("mpi-opcodes");
    if (!mpiTable) return;
    const rows = mpiTable.querySelectorAll("tbody tr");
    rows.forEach((row, i) => {
      const numberCell = row.querySelector(".row-number");
      if (numberCell) numberCell.textContent = i + 1;
    });
  }

  // === STYLE CHECKBOX INTERACTION ===
  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("verify")) {
      if (e.target.checked) {
        e.target.parentElement.style.backgroundColor = "#fff8ef";
      } else {
        e.target.parentElement.style.backgroundColor = "";
      }
    }
  });
});

// === FADE ANIMATION CLASSES ===
document.head.insertAdjacentHTML("beforeend", `
  <style>
    .fade-in { animation: fadeIn 0.25s ease-in-out; }
    .fade-out { animation: fadeOut 0.25s ease-in-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(10px); } }
  </style>
`);
