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
      const section = document.getElementById(btn.dataset.target);
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
  // === TRAINING TABLES (auto-wide text boxes) ===
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
    { id:"technicians", title:"Technicians – Checklist", rows:3, cols:["DMS ID","Login","Workflow","Mobile App Menu","Search Bar","RO Assignment","Dispatch","RO History","Prev. Declines","OCR","Edit ASR","ShopChat / Parts","Adding Media","Status Change","Notifications","Filters"] },
    { id:"advisors", title:"Service Advisors – Checklist", rows:3, cols:["DMS ID","Login","Mobile App Menu","MCI","Workflow","Search Bar","RO Assignment","DMS History","Prev. Declines","OCR","Edit ASR","ShopChat","Status Change","MPI Send","SOP"] },
    { id:"parts", title:"Parts Representatives – Checklist", rows:2, cols:["DMS ID","Login","Web App","Workflow","Search Bar","Take Function","DMS History","Prev. Declines","Parts Tab","SOP","Edit ASR","ShopChat / Parts","Status Change","Notifications","Filters"] },
    { id:"bdc", title:"BDC Representatives – Checklist", rows:2, cols:["DMS ID","Login","Scheduler","Declined Services","ServiceConnect","Call Routing"] },
    { id:"pickup", title:"Pick Up & Delivery Drivers – Checklist", rows:2, cols:["DMS ID","Login","PU&D","Notifications"] }
  ];

  const tcPage = document.getElementById("training-checklist");
  if (tcPage) {
    tcPage.querySelectorAll(".section").forEach(s => s.remove());

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
                  <th>Name</th>
                  ${role.cols.map(c=>`<th>${c}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${Array.from({length: role.rows}).map(()=>`
                  <tr>
                    <td><input type="checkbox" class="verify" /></td>
                    <td><input type="text" placeholder="Name" class="auto-wide" /></td>
                    ${role.cols.map(()=>`<td>${YESNO}</td>`).join("")}
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
      tcPage.appendChild(sec);
    });
  }

  // === Widen Service and MPI Opcode cells ===
  document.querySelectorAll('#opcodes-setup td:first-of-type input[type="text"], #mpi-opcodes td:nth-of-type(2) input[type="text"]').forEach(el => {
    el.style.width = "100%";
  });

  // =======================================================
  // === FOOTER FIX: ensure footers are part of table block ===
  // =======================================================
  document.querySelectorAll(".table-footer").forEach(footer => {
    const btn = footer.querySelector(".add-row");
    const targetId = btn?.dataset?.target;
    let container = null;
    if (targetId) {
      const table = document.getElementById(targetId);
      if (table) container = table.closest(".table-container");
    }
    if (!container) {
      const sec = footer.closest(".section") || document;
      const containers = Array.from(sec.querySelectorAll(".table-container"));
      container = containers.reverse().find(c => c.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING) || null;
    }
    if (container && !container.contains(footer)) container.appendChild(footer);
    if (container) container.classList.add("has-footer");
  });

  // =======================================================
  // === ADD ROW ===
  // =======================================================
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("add-row")) return;
    const id = e.target.dataset.target;
    const table = document.getElementById(id);
    if (!table) return;

    const tbody = table.querySelector("tbody");
    const clone = tbody.querySelector("tr").cloneNode(true);
    clone.querySelectorAll("input[type='text']").forEach(el => el.value = "");
    clone.querySelectorAll("input[type='checkbox']").forEach(el => el.checked = false);
    clone.querySelectorAll("select").forEach(el => { el.selectedIndex = 0; el.style.backgroundColor = "#f2f2f2"; });
    tbody.appendChild(clone);
  });

  // =======================================================
  // === SELECT COLOR CODING + VERIFY HIGHLIGHT ===
  // =======================================================
  const bgColors = {
    "Yes": "#c9f7c0","Web Only": "#fff8b3","Mobile Only": "#ffe0b3","No": "#ffb3b3",
    "Not Trained": "#ffb3b3","N/A": "#f2f2f2","Yes, each has their own": "#c9f7c0",
    "Yes, but they are sharing": "#fff8b3"
  };
  document.addEventListener("change", (e) => {
    if (e.target.tagName === "SELECT") e.target.style.backgroundColor = bgColors[e.target.value] || "#f2f2f2";
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
  // === SORTABLEJS (draggable rows for draggable-table) ===
  // =======================================================
  const sortableScript = document.createElement("script");
  sortableScript.src = "https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js";
  document.head.appendChild(sortableScript);

  sortableScript.onload = () => {
    document.querySelectorAll(".draggable-table tbody").forEach((tbody) => {
      new Sortable(tbody, { animation: 150, handle: "td,th", ghostClass: "dragging" });
    });
  };

  // =======================================================
  // === PDF EXPORT ===
  // =======================================================
  const pdfButton = document.getElementById("pdfButton");
  if (pdfButton) {
    pdfButton.addEventListener("click", () => {
      const active = document.querySelector(".page-section.active");
      import("https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js")
        .then((html2pdf) => html2pdf.default().from(active).save(`${active.id}.pdf`));
    });
  }

  // === Fade Animations ===
  document.head.insertAdjacentHTML("beforeend", `
    <style>
      .fade-in { animation: fadeIn 0.25s ease-in-out; }
      .fade-out { animation: fadeOut 0.25s ease-in-out; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(10px); } }
      .training-table td input[type="text"] { width: 100%; box-sizing: border-box; }
    </style>
  `);
});
// =======================================================
// === LOCAL STORAGE PERSISTENCE FOR ALL TEXTAREAS ===
// =======================================================

// Auto-save notes to localStorage
document.addEventListener("input", (e) => {
  if (e.target.tagName === "TEXTAREA" && e.target.id) {
    localStorage.setItem(e.target.id, e.target.value);
  }
});

// Restore notes from localStorage when the page loads
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("textarea[id]").forEach((area) => {
    const saved = localStorage.getItem(area.id);
    if (saved) {
      area.value = saved;
      area.style.height = "auto";
      area.style.height = area.scrollHeight + "px"; // auto-expand
    }
  });
});
