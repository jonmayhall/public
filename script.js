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
  // === DROPDOWN COLOR CODING ===
  // =======================================================
  document.addEventListener("change", (e) => {
    if (e.target.tagName === "SELECT") {
      const val = e.target.value;
      const colorMap = {
        "Yes": "#c9f7c0",
        "No": "#ffb3b3",
        "N/A": "#f2f2f2",
        "Partially": "#fff8b3",
        "Tier 2": "#fff8b3",
        "5": "#c9f7c0",
        "4": "#c9f7c0",
        "3": "#fff8b3",
        "2": "#ffb3b3",
        "1": "#ffb3b3",
      };
      e.target.style.backgroundColor = colorMap[val] || "#f2f2f2";
    }
  });

  // =======================================================
  // === TABLE ADD ROW FUNCTION ===
  // =======================================================
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("add-row")) return;
    const id = e.target.dataset.target;
    const table = document.getElementById(id);
    if (!table) return;

    const first = table.querySelector("tbody tr:not(:last-child)");
    if (!first) return;

    const clone = first.cloneNode(true);
    clone.querySelectorAll("input, select").forEach((el) => {
      if (el.tagName === "SELECT") {
        el.selectedIndex = 0;
        el.style.backgroundColor = "#f2f2f2";
      } else el.value = "";
    });
    table.querySelector("tbody").insertBefore(clone, table.querySelector("tbody tr:last-child"));
  });

  // =======================================================
  // === ADDITIONAL INPUT FIELDS ===
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
      const td = e.target.closest("td");
      td.style.backgroundColor = e.target.checked ? "#fff7ed" : "";
    }
  });

  // =======================================================
  // === CONDITIONAL VISIBILITY (Final Onsite Check) ===
  // =======================================================
  const trainedSelect = document.getElementById("trained-all");
  const untrainedNotes = document.getElementById("untrained-notes");
  if (trainedSelect && untrainedNotes) {
    trainedSelect.addEventListener("change", () => {
      untrainedNotes.style.display = trainedSelect.value === "No" ? "block" : "none";
    });
  }

  const ticketSelect = document.getElementById("tickets");
  const ticketDetails = document.getElementById("ticket-details");
  if (ticketSelect && ticketDetails) {
    ticketSelect.addEventListener("change", () => {
      ticketDetails.style.display =
        ticketSelect.value === "Yes" || ticketSelect.value === "Tier 2" ? "block" : "none";
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

  // =======================================================
  // === NOTE SYNC / AUTO-FILL LOGIC ===
  // =======================================================
  function syncNotes() {
    const cemField = document.querySelector("#onsite-trainers input[placeholder='Enter CEM Name…']");
    const cemNotes = document.getElementById("summary-cem");
    if (cemField && cemNotes) cemNotes.value = cemField.value;

    const champs = Array.from(document.querySelectorAll("#onsite-trainers .champion-input input"))
      .map(i => i.value).filter(Boolean).join(", ");
    const blocks = Array.from(document.querySelectorAll("#onsite-trainers .blocker-input input"))
      .map(i => i.value).filter(Boolean).join(", ");
    if (document.getElementById("summary-champions")) document.getElementById("summary-champions").value = champs;
    if (document.getElementById("summary-blockers")) document.getElementById("summary-blockers").value = blocks;

    const preNotes = Array.from(document.querySelectorAll("#pretraining textarea"))
      .map(t => t.value).join("\n");
    const monNotes = Array.from(document.querySelectorAll("#monday-visit textarea"))
      .map(t => t.value).join("\n");
    if (document.getElementById("summary-pretraining"))
      document.getElementById("summary-pretraining").value = `${preNotes}\n${monNotes}`.trim();

    const checklistNotes = Array.from(document.querySelectorAll("#training-checklist .comment-box textarea"))
      .map(t => t.value).join("\n");
    const sumTue = document.getElementById("summary-tuesday");
    if (sumTue) sumTue.value = checklistNotes;

    const opcode = document.querySelector("#opcodes-pricing textarea")?.value || "";
    const dms = document.querySelector("#dms-integration textarea")?.value || "";
    const opNotes = document.getElementById("summary-opcodes");
    if (opNotes) opNotes.value = `${opcode}\n${dms}`.trim();
  }

  setInterval(syncNotes, 2000);
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
