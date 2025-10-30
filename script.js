// =======================================================
// === MAIN JS – myKaarma Interactive Checklist ===
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
      document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      sections.forEach((s) => s.classList.remove("active"));
      section.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // === AUTO RESIZE TEXTAREAS ===
  document.addEventListener("input", (e) => {
    if (e.target.tagName === "TEXTAREA") {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    }
  });

  // === SYNC NOTES FUNCTION ===
  function syncNotes(sourceId, targetId) {
    const src = document.getElementById(sourceId);
    const tgt = document.getElementById(targetId);
    if (!src || !tgt) return;
    src.addEventListener("input", () => {
      tgt.value = src.value;
      tgt.style.height = "auto";
      tgt.style.height = tgt.scrollHeight + "px";
      localStorage.setItem(targetId, tgt.value);
    });
    document.querySelector(`[data-target="training-summary"]`)?.addEventListener("click", () => {
      tgt.value = src.value;
      tgt.style.height = "auto";
      tgt.style.height = tgt.scrollHeight + "px";
    });
  }

  // === LINKED NOTE SECTIONS ===
  syncNotes("pretraining-notes", "summary-pretraining-notes");
  syncNotes("training-notes", "summary-tuesday-notes");
  syncNotes("opcodes-notes", "summary-opcodes-notes");
  syncNotes("dms-notes", "summary-opcodes-notes");
  syncNotes("onsite-notes", "summary-cem-notes");

  // === LOCAL STORAGE PERSISTENCE ===
  document.addEventListener("input", (e) => {
    if (e.target.tagName === "TEXTAREA" && e.target.id)
      localStorage.setItem(e.target.id, e.target.value);
  });

  document.querySelectorAll("textarea[id]").forEach((area) => {
    const saved = localStorage.getItem(area.id);
    if (saved) {
      area.value = saved;
      area.style.height = "auto";
      area.style.height = area.scrollHeight + "px";
    }
  });

  // === CHAMPIONS & BLOCKERS SECTION ===
  const champContainer = document.getElementById("champion-container");
  const blockContainer = document.getElementById("blocker-container");

  const addChampion = document.getElementById("add-champion");
  const addBlocker = document.getElementById("add-blocker");

  const summaryChamp = document.getElementById("summary-champion-container");
  const summaryBlock = document.getElementById("summary-blocker-container");

  function saveData() {
    const champs = [...document.querySelectorAll(".champion-input")].map((i) => i.value.trim()).filter(Boolean);
    const blocks = [...document.querySelectorAll(".blocker-input")].map((i) => i.value.trim()).filter(Boolean);
    localStorage.setItem("champions", JSON.stringify(champs));
    localStorage.setItem("blockers", JSON.stringify(blocks));
  }

  function loadData() {
    const champs = JSON.parse(localStorage.getItem("champions") || "[]");
    const blocks = JSON.parse(localStorage.getItem("blockers") || "[]");

    if (champContainer) {
      champContainer.innerHTML = "";
      champs.forEach((val) => {
        const i = document.createElement("input");
        i.type = "text";
        i.placeholder = "User Name & Role…";
        i.className = "champion-input";
        i.value = val;
        champContainer.appendChild(i);
      });
    }
    if (blockContainer) {
      blockContainer.innerHTML = "";
      blocks.forEach((val) => {
        const i = document.createElement("input");
        i.type = "text";
        i.placeholder = "User Name & Role…";
        i.className = "blocker-input";
        i.value = val;
        blockContainer.appendChild(i);
      });
    }
  }

  function renderSummary() {
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
      saveData();
    });

  if (addBlocker)
    addBlocker.addEventListener("click", () => {
      const i = document.createElement("input");
      i.type = "text";
      i.placeholder = "User Name & Role…";
      i.className = "blocker-input";
      blockContainer.appendChild(i);
      saveData();
    });

  document.addEventListener("input", (e) => {
    if (e.target.classList.contains("champion-input") || e.target.classList.contains("blocker-input"))
      saveData();
  });

  loadData();
  document.querySelector(`[data-target="training-summary"]`)?.addEventListener("click", renderSummary);
});
