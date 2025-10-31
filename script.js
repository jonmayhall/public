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
  // === TRAINING TABLE GENERATION (Dynamic Page Content) ===
  // =======================================================
  const roles = [
    {
      id: "technicians",
      title: "Technicians – Checklist",
      rows: 3,
      cols: ["DMS ID", "Login", "Workflow", "Mobile App Menu", "Search Bar",
             "RO Assignment", "Dispatch", "RO History", "Prev. Declines", "OCR",
             "Edit ASR", "ShopChat / Parts", "Adding Media", "Status Change",
             "Notifications", "Desktop Filter"]
    },
    {
      id: "advisors",
      title: "Service Advisors – Checklist",
      rows: 3,
      cols: ["DMS ID", "Login", "Mobile App Menu", "MCI", "Workflow", "Search Bar",
             "RO Assignment", "DMS History", "Prev. Declines", "OCR", "Edit ASR",
             "ShopChat", "Status Change", "MPI Send", "Desktop Filter"]
    },
    {
      id: "parts",
      title: "Parts Representatives – Checklist",
      rows: 2,
      cols: ["DMS ID", "Login", "Web App", "Workflow", "Search Bar", "Take Function",
             "DMS History", "Prev. Declines", "Parts Tab", "SOP", "Edit ASR",
             "ShopChat / Parts", "Status Change", "Notifications", "Desktop Filter"]
    },
    {
      id: "bdc",
      title: "BDC Representatives – Checklist",
      rows: 2,
      cols: ["DMS ID", "Login", "Scheduler", "Declined Services", "ServiceConnect", "Call Routing"]
    },
    {
      id: "dispatcher",
      title: "Pickup & Delivery Dispatcher – Checklist",
      rows: 2,
      cols: ["Creating Trips", "Customer Tab", "Editing Trips", "Adding Driver",
             "Adding Loaners", "Drivers View / Mobile App", "Global View"]
    },
    {
      id: "pickup",
      title: "Pickup & Delivery Drivers – Checklist",
      rows: 2,
      cols: ["App Login", "PU&D", "Notifications"]
    }
  ];

  const container = document.getElementById("tables-container");
  if (container) {
    roles.forEach((role) => {
      const div = document.createElement("div");
      div.classList.add("section");
      div.innerHTML = `
        <div class="section-header">${role.title}</div>
        <div class="table-container">
          <div class="scroll-wrapper">
            <table id="${role.id}" class="training-table">
              <thead>
                <tr>
                  <th style="width:40px;"></th>
                  <th style="width:260px;">Name</th>
                  ${role.cols.map(c => `<th>${c}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${Array.from({ length: role.rows }).map(() => `
                  <tr>
                    <td><input type="checkbox" class="verify"></td>
                    <td><input type="text" placeholder="Name"></td>
                    ${role.cols.map(() => `
                      <td>
                        <select>
                          <option></option>
                          <option>Yes</option>
                          <option>No</option>
                        </select>
                      </td>
                    `).join("")}
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
        <div class="table-footer">
          <button class="add-row" data-target="${role.id}" type="button">+</button>
        </div>
        <div class="section-block comment-box">
          <h2>Additional Comments</h2>
          <textarea placeholder="Type here…"></textarea>
        </div>
      `;
      container.appendChild(div);
    });
  }

  // =======================================================
  // === DROPDOWN COLOR CODING ===
  // =======================================================
  document.addEventListener("change", (e) => {
    if (e.target.tagName === "SELECT") {
      const val = e.target.value;
      const colors = {
        "Yes": "#c9f7c0",
        "No": "#ffb3b3",
        "N/A": "#f2f2f2",
        "Web Only": "#fff8b3",
        "Mobile Only": "#ffe0b3",
        "No Information to Review": "#ffb3b3",
        "No Information Available": "#ffb3b3"
      };
      e.target.style.backgroundColor = colors[val] || "#f2f2f2";
    }
  });

  // =======================================================
  // === ADD ROW FUNCTION (Tables) ===
  // =======================================================
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("add-row")) return;
    const id = e.target.dataset.target;
    const table = document.getElementById(id);
    if (!table) return;
    const first = table.querySelector("tbody tr");
    const clone = first.cloneNode(true);
    clone.querySelectorAll("input[type='text']").forEach((i) => i.value = "");
    clone.querySelectorAll("select").forEach((s) => {
      s.selectedIndex = 0;
      s.style.backgroundColor = "#f2f2f2";
    });
    clone.querySelectorAll(".verify").forEach((c) => c.checked = false);
    table.querySelector("tbody").appendChild(clone);
  });

  // =======================================================
  // === TEXTAREA AUTO EXPAND ===
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
      const cell = e.target.closest("td");
      cell.style.backgroundColor = e.target.checked ? "#fff7ed" : "";
    }
  });

  // =======================================================
  // === CONDITIONAL TEXTAREAS (Final Onsite Check) ===
  // =======================================================
  const trainedAll = document.getElementById("trained-all");
  const trainedNotes = document.getElementById("trained-all-notes");
  const supportTickets = document.getElementById("support-tickets");
  const ticketNotes = document.getElementById("support-ticket-notes");

  const toggleVisibility = () => {
    if (trainedAll && trainedNotes)
      trainedNotes.classList.toggle("hidden", trainedAll.value !== "No");
    if (supportTickets && ticketNotes)
      ticketNotes.classList.toggle("hidden", !["Yes", "Tier 2"].includes(supportTickets.value));
  };

  [trainedAll, supportTickets].forEach(el => el?.addEventListener("change", toggleVisibility));

  // =======================================================
  // === PDF EXPORT FUNCTION ===
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

  // =======================================================
  // === NOTE SYNC (Expanded for all new pages) ===
  // =======================================================
  const pretrainingNotes = document.querySelector("#pretraining textarea:last-of-type");
  const mondayNotes = document.querySelector("#monday-visit textarea");
  const trainingSummary = document.querySelector("#training-summary");

  const syncNotes = () => {
    if (!trainingSummary) return;
    const tAreas = trainingSummary.querySelectorAll("textarea");

    const preText = pretrainingNotes?.value || "";
    const mondayText = mondayNotes?.value || "";

    // Order: Overall, CEM, Champions, Pre/Monday, Tue, Wed, Opcodes
    if (tAreas[2]) tAreas[2].value = preText + "\n" + mondayText;

    // Tuesday / Wednesday autofills from Training Checklist page
    const checklist = document.querySelector("#training-checklist");
    const checkNotes = checklist?.querySelector("textarea")?.value || "";
    if (tAreas[3]) tAreas[3].value = checkNotes;
    if (tAreas[4]) tAreas[4].value = checkNotes;

    // Opcode + DMS integration merge
    const opcode = document.querySelector("#opcodes-pricing textarea")?.value || "";
    const dms = document.querySelector("#dms-integration textarea")?.value || "";
    if (tAreas[5]) tAreas[5].value = `${opcode}\n${dms}`.trim();

    // Champions & Blockers autofill
    const champions = Array.from(document.querySelectorAll(".champion-input input"))
      .map(i => i.value).filter(Boolean).join(", ");
    const blockers = Array.from(document.querySelectorAll(".blocker-input input"))
      .map(i => i.value).filter(Boolean).join(", ");
    const champInput = trainingSummary.querySelector("input[placeholder*='Champion']");
    const blockInput = trainingSummary.querySelector("input[placeholder*='Blocker']");
    if (champInput) champInput.value = champions;
    if (blockInput) blockInput.value = blockers;
  };

  setInterval(syncNotes, 2000);

  // =======================================================
  // === ADDITIONAL INPUT FIELD FUNCTIONS ===
  // =======================================================
  window.addTrainerField = (btn) => {
    const container = btn.closest(".trainer-input").parentElement;
    const clone = btn.closest(".trainer-input").cloneNode(true);
    clone.querySelector("input").value = "";
    container.appendChild(clone);
  };

  window.addChampionField = (btn) => {
    const container = btn.closest(".champion-input").parentElement;
    const clone = btn.closest(".champion-input").cloneNode(true);
    clone.querySelector("input").value = "";
    container.appendChild(clone);
  };

  window.addBlockerField = (btn) => {
    const container = btn.closest(".blocker-input").parentElement;
    const clone = btn.closest(".blocker-input").cloneNode(true);
    clone.querySelector("input").value = "";
    container.appendChild(clone);
  };
});

// === FADE ANIMATIONS ===
document.head.insertAdjacentHTML("beforeend", `
  <style>
    .fade-in { animation: fadeIn 0.25s ease-in-out; }
    .fade-out { animation: fadeOut 0.25s ease-in-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: translateY(0);} }
    @keyframes fadeOut { from { opacity: 1; transform: translateY(0);} to { opacity: 0; transform: translateY(10px);} }
    .hidden { display:none; }
  </style>
`);
