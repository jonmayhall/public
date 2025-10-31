/* =======================================================
   myKaarma Interactive Training Checklist – Final JS
   ======================================================= */

// === SIDEBAR NAVIGATION ===
document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".nav-btn");
  const pages = document.querySelectorAll(".page-section");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      pages.forEach(p => p.classList.remove("active"));
      document.getElementById(target).classList.add("active");

      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
});

// === ADD ROW TO TABLE ===
document.addEventListener("click", e => {
  if (!e.target.classList.contains("add-row")) return;
  const btn = e.target;
  const tableId = btn.dataset.target;
  let table;

  if (tableId) {
    table = document.getElementById(tableId);
  } else {
    table = btn.closest(".section").querySelector("table");
  }

  if (!table) return;
  const first = table.querySelector("tbody tr");
  if (!first) return;

  const clone = first.cloneNode(true);
  clone.querySelectorAll("input[type='text']").forEach(i => (i.value = ""));
  clone.querySelectorAll("input[type='checkbox']").forEach(c => (c.checked = false));
  clone.querySelectorAll("select").forEach(s => {
    s.selectedIndex = 0;
    s.style.backgroundColor = "#f2f2f2";
  });

  table.querySelector("tbody").appendChild(clone);
});

// === DYNAMIC FIELD ADDERS (TRAINERS, CHAMPIONS, BLOCKERS) ===
function addTrainerField(el) {
  const parent = el.closest(".trainer-input").parentNode;
  const div = document.createElement("div");
  div.className = "trainer-input";
  div.style.position = "relative";
  div.innerHTML = `<input type="text" placeholder="Enter Additional Trainer..." style="width:100%;" />
                   <button type="button" class="add-row" onclick="addTrainerField(this)" style="position:absolute;bottom:-12px;left:-34px;">+</button>`;
  parent.appendChild(div);
}

function addChampionField(el) {
  const parent = el.closest(".champion-input").parentNode;
  const div = document.createElement("div");
  div.className = "champion-input";
  div.style.position = "relative";
  div.innerHTML = `<input type="text" placeholder="Enter Champion Name & Role..." style="width:100%;" />
                   <button type="button" class="add-row" onclick="addChampionField(this)" style="position:absolute;bottom:-12px;left:-34px;">+</button>`;
  parent.appendChild(div);
}

function addBlockerField(el) {
  const parent = el.closest(".blocker-input").parentNode;
  const div = document.createElement("div");
  div.className = "blocker-input";
  div.style.position = "relative";
  div.innerHTML = `<input type="text" placeholder="Enter Blocker Name & Role..." style="width:100%;" />
                   <button type="button" class="add-row" onclick="addBlockerField(this)" style="position:absolute;bottom:-12px;left:-34px;">+</button>`;
  parent.appendChild(div);
}

// === DROPDOWN COLOR CODING ===
document.addEventListener("change", e => {
  if (e.target.tagName !== "SELECT") return;
  const val = e.target.value.trim();

  if (e.target.classList.contains("rating-select")) {
    if (val === "5" || val === "4") e.target.style.backgroundColor = "#c9f7c0";
    else if (val === "3") e.target.style.backgroundColor = "#fff8b3";
    else if (val === "2" || val === "1") e.target.style.backgroundColor = "#ffb3b3";
    else e.target.style.backgroundColor = "#f2f2f2";
    return;
  }

  const colorMap = {
    Yes: "#c9f7c0",
    No: "#ffb3b3",
    "N/A": "#f2f2f2",
    "Yes, each has their own": "#c9f7c0",
    "Yes, but they are sharing": "#fff8b3"
  };
  e.target.style.backgroundColor = colorMap[val] || "#f2f2f2";
});

// === CONDITIONAL TEXTAREAS (Final Onsite) ===
document.addEventListener("change", e => {
  if (e.target.id === "trained-all") {
    document.getElementById("untrained-notes").style.display =
      e.target.value === "No" ? "block" : "none";
  }
  if (e.target.id === "tickets") {
    const val = e.target.value;
    document.getElementById("ticket-details").style.display =
      val === "Yes" || val === "Tier 2" ? "block" : "none";
  }
});

// === CHECKBOX HIGHLIGHTING ===
document.addEventListener("change", e => {
  if (!e.target.classList.contains("verify")) return;
  const td = e.target.closest("td");
  if (td) td.style.backgroundColor = e.target.checked ? "#fff7ed" : "";
});

// === PDF EXPORT ===
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("pdfButton");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const active = document.querySelector(".page-section.active");
    if (!active) return;
    import("https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js")
      .then(h => h.default().from(active).save(`${active.id}.pdf`));
  });
});

// === AUTOFILL PLACEHOLDER (FOR FUTURE SYNCING BETWEEN PAGES) ===
// These will be expanded later if you want Pre-Training / Monday / etc. to fill into Summary.
function getTextFrom(pageID) {
  const page = document.getElementById(pageID);
  if (!page) return "";
  const textareas = page.querySelectorAll("textarea");
  return Array.from(textareas)
    .map(t => t.value.trim())
    .filter(v => v)
    .join("\n\n");
}

function autofillSummary() {
  document.getElementById("summary-pretraining").value = getTextFrom("pretraining") + "\n" + getTextFrom("monday-visit");
  document.getElementById("summary-opcodes").value = getTextFrom("opcodes-pricing") + "\n" + getTextFrom("dms-integration");
}
