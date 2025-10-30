// =======================================================
// === MAIN SITE SCRIPT – myKaarma Interactive Checklist ===
// =======================================================

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

      const active = document.querySelector(".page-section.active");
      if (active) {
        active.classList.remove("active");
        active.classList.add("fade-out");
        setTimeout(() => active.classList.remove("fade-out"), 250);
      }

      setTimeout(() => {
        sections.forEach((s) => s.classList.remove("active"));
        section.classList.add("active", "fade-in");
        setTimeout(() => section.classList.remove("fade-in"), 250);
      }, 150);

      nav.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // =======================================================
  // === TRAINING TABLE GENERATION (Dynamic + Full Cells) ===
  // =======================================================
  const YESNO = `
    <select>
      <option></option>
      <option value="Yes">Yes</option>
      <option value="Web Only">Web Only</option>
      <option value="Mobile Only">Mobile Only</option>
      <option value="No">No</option>
      <option value="Not Trained">Not Trained</option>
      <option value="N/A">N/A</option>
    </select>
  `;

  const roles = [
    {
      id: "technicians",
      title: "Technicians – Checklist",
      rows: 3,
      cols: [
        "DMS ID","Login","Workflow","Mobile App Menu","Search Bar","RO Assignment",
        "Dispatch","RO History","Prev. Declines","OCR","Edit ASR","ShopChat / Parts",
        "Adding Media","Status Change","Notifications","Filters"
      ]
    },
    {
      id: "advisors",
      title: "Service Advisors – Checklist",
      rows: 3,
      cols: [
        "DMS ID","Login","Mobile App Menu","MCI","Workflow","Search Bar",
        "RO Assignment","DMS History","Prev. Declines","OCR","Edit ASR",
        "ShopChat","Status Change","MPI Send","SOP"
      ]
    },
    {
      id: "parts",
      title: "Parts Representatives – Checklist",
      rows: 2,
      cols: [
        "DMS ID","Login","Web App","Workflow","Search Bar","Take Function",
        "DMS History","Prev. Declines","Parts Tab","SOP","Edit ASR",
        "ShopChat / Parts","Status Change","Notifications","Filters"
      ]
    },
    {
      id: "bdc",
      title: "BDC Representatives – Checklist",
      rows: 2,
      cols: ["DMS ID","Login","Scheduler","Declined Services","ServiceConnect","Call Routing"]
    },
    {
      id: "pickup",
      title: "Pick Up & Delivery Drivers – Checklist",
      rows: 2,
      cols: ["DMS ID","Login","PU&D","Notifications"]
    }
  ];

  const container = document.getElementById("training-checklist");
  if (container) {
    container.querySelectorAll(".section").forEach(sec => sec.remove());

    roles.forEach((role) => {
      const sec = document.createElement("div");
      sec.className = "section";
      sec.innerHTML = `
        <div class="section-header">${role.title}</div>
        <div class="table-container">
          <div class="scroll-wrapper">
            <table id="${role.id}" class="training-table">
              <thead>
                <tr>
                  <th>Completed</th>
                  <th style="width:260px;">Name</th>
                  ${role.cols.map(c => `<th>${c}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${Array.from({ length: role.rows }).map(() => `
                  <tr>
                    <td><input type="checkbox" class="verify"></td>
                    <td><input type="text" placeholder="Name"></td>
                    ${role.cols.map(() => `<td>${YESNO}</td>`).join("")}
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
          <div class="table-footer"><button class="add-row" data-target="${role.id}" type="button">+</button></div>
        </div>
        <div class="section-block comment-box">
          <h2>Notes</h2>
          <textarea placeholder="Type here…"></textarea>
        </div>
      `;
      container.appendChild(sec);
    });
  }

  // =======================================================
  // === Fix Floating Footers (Move inside table-container) ===
  // =======================================================
  document.querySelectorAll(".table-container + .table-footer").forEach((footer) => {
    const containerEl = footer.previousElementSibling;
    if (containerEl && containerEl.classList.contains("table-container")) {
      containerEl.appendChild(footer);
    }
  });

  // =======================================================
  // === ADD ROW ===
  // =======================================================
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("add-row")) return;
    const id = e.target.dataset.target;
    const table = document.getElementById(id);
    if (!table) return;

    const tBody = table.querySelector("tbody");
    const firstRow = tBody.querySelector("tr");
    const clone = firstRow.cloneNode(true);

    clone.querySelectorAll("input[type='text']").forEach((el) => el.value = "");
    clone.querySelectorAll("input[type='checkbox']").forEach((el) => el.checked = false);
    clone.querySelectorAll("select").forEach((el) => {
      el.selectedIndex = 0;
      el.style.backgroundColor = "#f2f2f2";
    });

    tBody.appendChild(clone);
    if (id === "mpi-opcodes") updateRowNumbers();
  });

  // =======================================================
  // === DROPDOWN COLOR CODING ===
  // =======================================================
  const bgColors = {
    "Yes": "#c9f7c0",
    "Web Only": "#fff8b3",
    "Mobile Only": "#ffe0b3",
    "No": "#ffb3b3",
    "Not Trained": "#ffb3b3",
    "N/A": "#f2f2f2",
    "Yes, each has their own": "#c9f7c0",
    "Yes, but they are sharing": "#fff8b3"
  };

  document.addEventListener("change", (e) => {
    if (e.target.tagName === "SELECT") {
      const value = e.target.value;
      e.target.style.backgroundColor = bgColors[value] || "#f2f2f2";
    }
    if (e.target.classList.contains("verify")) {
      const cell = e.target.closest("td");
      if (cell) cell.style.backgroundColor = e.target.checked ? "#fff7ed" : "#fff";
    }
  });

  // =======================================================
  // === AUTO EXPAND TEXTAREAS ===
  // =======================================================
  document.addEventListener("input", (e) => {
    if (e.target.tagName === "TEXTAREA") {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    }
  });

  // =======================================================
  // === SORTABLEJS (for drag/drop rows) ===
  // =======================================================
  const sortableScript = document.createElement("script");
  sortableScript.src = "https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js";
  document.head.appendChild(sortableScript);

  sortableScript.onload = () => {
    document.querySelectorAll(".draggable-table tbody").forEach((tbody) => {
      const table = tbody.closest("table");
      new Sortable(tbody, {
        animation: 150,
        handle: "td,th",
        ghostClass: "dragging",
        scroll: true,
        scrollSensitivity: 60,
        scrollSpeed: 20,
        onEnd: () => {
          if (table && table.id === "mpi-opcodes") updateRowNumbers();
        }
      });
    });

    document.querySelectorAll(".scroll-wrapper").forEach((wrap) => {
      wrap.style.maxHeight = "340px";
      wrap.style.overflowY = "auto";
      wrap.style.overflowX = "auto";
    });
  };

  // =======================================================
  // === MPI Reset Order ===
  // =======================================================
  const resetButton = document.getElementById("resetMpiOrder");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      const mpiTable = document.getElementById("mpi-opcodes");
      if (!mpiTable) return;
      const tbody = mpiTable.querySelector("tbody");
      const rows = Array.from(tbody.querySelectorAll("tr"));
      rows.sort((a, b) => {
        const aNum = parseInt(a.querySelector(".row-number")?.textContent || "0", 10);
        const bNum = parseInt(b.querySelector(".row-number")?.textContent || "0", 10);
        return aNum - bNum;
      });
      tbody.innerHTML = "";
      rows.forEach((r) => tbody.appendChild(r));
      updateRowNumbers();
    });
  }

  function updateRowNumbers() {
    const mpi = document.getElementById("mpi-opcodes");
    if (!mpi) return;
    mpi.querySelectorAll("tbody tr").forEach((row, i) => {
      const numCell = row.querySelector(".row-number");
      if (numCell) numCell.textContent = String(i + 1);
    });
  }

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

// === FADE ANIMATIONS ===
document.head.insertAdjacentHTML("beforeend", `
  <style>
    .fade-in { animation: fadeIn 0.25s ease-in-out; }
    .fade-out { animation: fadeOut 0.25s ease-in-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(10px); } }
  </style>
`);
