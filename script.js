// =======================================================
// === myKaarma Interactive Training Checklist Script ===
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

      nav.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      sections.forEach((s) => s.classList.remove("active"));
      section.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // === AUTO-RESIZE TEXTAREAS ===
  document.addEventListener("input", (e) => {
    if (e.target.tagName === "TEXTAREA") {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    }
  });

  // === NOTE SYNC UTILITY ===
  function syncNotes(sourceId, targetId) {
    const src = document.getElementById(sourceId);
    const tgt = document.getElementById(targetId);
    if (!src || !tgt) return;

    // copy on typing
    src.addEventListener("input", () => {
      tgt.value = src.value;
      tgt.style.height = "auto";
      tgt.style.height = tgt.scrollHeight + "px";
      localStorage.setItem(targetId, tgt.value);
    });

    // refresh when visiting summary
    document.querySelector(`[data-target="training-summary"]`)
      ?.addEventListener("click", () => {
        tgt.value = src.value;
        tgt.style.height = "auto";
        tgt.style.height = tgt.scrollHeight + "px";
      });
  }

  // === CONNECT PAGE NOTES ===
  syncNotes("pretraining-notes", "summary-pretraining-notes");
  syncNotes("training-notes", "summary-tuesday-notes");
  syncNotes("opcodes-notes", "summary-opcodes-notes");
  syncNotes("dms-notes", "summary-opcodes-notes");
  syncNotes("onsite-notes", "summary-cem-notes");

  // === LOCAL-STORAGE PERSISTENCE ===
  document.addEventListener("input", (e) => {
    if (e.target.tagName === "TEXTAREA" && e.target.id) {
      localStorage.setItem(e.target.id, e.target.value);
    }
  });

  document.querySelectorAll("textarea[id]").forEach((area) => {
    const saved = localStorage.getItem(area.id);
    if (saved) {
      area.value = saved;
      area.style.height = "auto";
      area.style.height = area.scrollHeight + "px";
    }
  });

  // =======================================================
  // === CHAMPIONS & BLOCKERS SECTION ===
  // =======================================================
  const champContainer = document.getElementById("champion-container");
  const blockContainer = document.getElementById("blocker-container");
  const addChampion = document.getElementById("add-champion");
  const addBlocker = document.getElementById("add-blocker");
  const summaryChamp = document.getElementById("summary-champion-container");
  const summaryBlock = document.getElementById("summary-blocker-container");

  function saveCBData() {
    const champs = [...document.querySelectorAll(".champion-input")]
      .map((i) => i.value.trim())
      .filter(Boolean);
    const blocks = [...document.querySelectorAll(".blocker-input")]
      .map((i) => i.value.trim())
      .filter(Boolean);
    localStorage.setItem("champions", JSON.stringify(champs));
    localStorage.setItem("blockers", JSON.stringify(blocks));
  }

  function loadCBData() {
    const champs = JSON.parse(localStorage.getItem("champions") || "[]");
    const blocks = JSON.parse(localStorage.getItem("blockers") || "[]");

    if (champContainer) {
      champContainer.innerHTML = "";
      champs.forEach((v) => {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "User Name & Role…";
        input.className = "champion-input";
        input.value = v;
        champContainer.appendChild(input);
      });
    }
    if (blockContainer) {
      blockContainer.innerHTML = "";
      blocks.forEach((v) => {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "User Name & Role…";
        input.className = "blocker-input";
        input.value = v;
        blockContainer.appendChild(input);
      });
    }
  }

  function renderCBSummary() {
    const champs = JSON.parse(localStorage.getItem("champions") || "[]");
    const blocks = JSON.parse(localStorage.getItem("blockers") || "[]");
    if (summaryChamp)
      summaryChamp.innerHTML = champs.length
        ? champs.map((c) => `<div>${c}</div>`).join("")
        : "<em>No data entered</em>";
    if (summaryBlock)
      summaryBlock.innerHTML = blocks.length
        ? blocks.map((b) => `<div>${b}</div>`).join("")
        : "<em>No data entered</em>";
  }

  if (addChampion)
    addChampion.addEventListener("click", () => {
      const i = document.createElement("input");
      i.type = "text";
      i.placeholder = "User Name & Role…";
      i.className = "champion-input";
      champContainer.appendChild(i);
      saveCBData();
    });

  if (addBlocker)
    addBlocker.addEventListener("click", () => {
      const i = document.createElement("input");
      i.type = "text";
      i.placeholder = "User Name & Role…";
      i.className = "blocker-input";
      blockContainer.appendChild(i);
      saveCBData();
    });

  document.addEventListener("input", (e) => {
    if (e.target.classList.contains("champion-input") ||
        e.target.classList.contains("blocker-input")) {
      saveCBData();
    }
  });

  loadCBData();
  document.querySelector(`[data-target="training-summary"]`)
    ?.addEventListener("click", renderCBSummary);

  // =======================================================
  // === SAVE-AS-PDF (ACTIVE SECTION) ===
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
