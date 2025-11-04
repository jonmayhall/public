/* ========= myKaarma – Stable Rescue script.js ========= */

/* NAV */
const navButtons = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".page-section");
navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const target = btn.getAttribute("data-target");
    sections.forEach(sec => sec.classList.toggle("active", sec.id === target));
    window.scrollTo(0, 0);
  });
});

/* ADD-ROW */
document.querySelectorAll(".add-row").forEach(button => {
  button.addEventListener("click", () => {
    const table = button.closest(".table-container")?.querySelector("table");
    if (!table) return;
    const tbody = table.querySelector("tbody");
    const firstRow = tbody?.querySelector("tr");
    if (!firstRow) return;

    const newRow = firstRow.cloneNode(true);
    newRow.querySelectorAll("input, select, textarea").forEach(el => {
      if (el.type === "checkbox") el.checked = false;
      else if (el.tagName === "SELECT") el.selectedIndex = 0;
      else el.value = "";
    });

    tbody.appendChild(newRow);
    // re-wrap only this table
    initFirstColumnWrappers(table);
  });
});

/* Inline add fields (trainers/champions/blockers) */
function addTrainerField(button) {
  const container = button.closest(".trainer-input").parentElement;
  const div = document.createElement("div");
  div.className = "trainer-input";
  div.style.position = "relative";
  div.innerHTML = `
    <input type="text" placeholder="Enter Additional Trainer..." style="width:100%;" />
    <button type="button" class="add-row small-btn" onclick="addTrainerField(this)">+</button>`;
  container.appendChild(div);
}
function addChampionField(button) {
  const container = button.closest(".champion-input").parentElement;
  const div = document.createElement("div");
  div.className = "champion-input";
  div.style.position = "relative";
  div.innerHTML = `
    <input type="text" placeholder="Enter Champion Name & Role..." style="width:100%;" />
    <button type="button" class="add-row small-btn" onclick="addChampionField(this)">+</button>`;
  container.appendChild(div);
}
function addBlockerField(button) {
  const container = button.closest(".blocker-input").parentElement;
  const div = document.createElement("div");
  div.className = "blocker-input";
  div.style.position = "relative";
  div.innerHTML = `
    <input type="text" placeholder="Enter Blocker Name & Role..." style="width:100%;" />
    <button type="button" class="add-row small-btn" onclick="addBlockerField(this)">+</button>`;
  container.appendChild(div);
}

/* Live dealership name in topbar */
const dealerInput = document.getElementById("dealer-name");
const dealerGroupInput = document.getElementById("dealer-group");
const topbar = document.querySelector(".topbar-content");
if (dealerInput && topbar) {
  const display = document.createElement("div");
  display.id = "dealershipNameDisplay";
  topbar.appendChild(display);
  const updateHeader = () => {
    const group = dealerGroupInput?.value?.trim() || "";
    const name = dealerInput?.value?.trim() || "";
    display.textContent = group ? `${group} – ${name}` : (name || "");
  };
  dealerInput.addEventListener("input", updateHeader);
  dealerGroupInput?.addEventListener("input", updateHeader);
}

/* Save as PDF */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("save-pdf")?.addEventListener("click", () => window.print());
});

/* Table width alignment */
window.addEventListener("load", () => {
  document.querySelectorAll(".scroll-wrapper").forEach(wrapper => {
    const table = wrapper.querySelector("table");
    if (table) {
      table.style.minWidth = "100%";
      wrapper.scrollLeft = 0;
    }
  });
});

/* ====== SAFE FIRST-COLUMN WRAPPER (no HTML changes needed) ======
   Applies ONLY on #training-checklist and #opcodes-pricing.
   Adds inline checkbox + keeps text input, centered horizontally.
*/
function pageHasId(el, id) {
  return !!el.closest(`#${id}`);
}

function initFirstColumnWrappers(scope = document) {
  // Only target the two pages you asked for
  const allowed = Array.from(scope.querySelectorAll("#training-checklist, #opcodes-pricing"));
  if (allowed.length === 0) return;

  allowed.forEach(page => {
    page.querySelectorAll(".training-table tbody tr").forEach(row => {
      const td = row.querySelector("td:first-child");
      if (!td) return;

      // Skip if we already wrapped it
      if (td.querySelector(".firstcell")) return;

      // Detect existing input or text
      const existingInput = td.querySelector("input[type='text']");
      const existingSelect = td.querySelector("select");

      // We only auto-wrap if the first column contains a single name input or plain text.
      // If the user already edited HTML with different content, we don't touch it.
      if (existingSelect) return;

      // Build wrapper
      const wrapper = document.createElement("div");
      wrapper.className = "firstcell";

      const cb = document.createElement("input");
      cb.type = "checkbox";

      let nameInput = existingInput;
      if (!nameInput) {
        nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.placeholder = "Name…";
      }

      // Clear and insert
      td.textContent = "";
      wrapper.append(cb, nameInput);
      td.appendChild(wrapper);
    });
  });
}

/* Run once on DOM ready and after each + clone */
document.addEventListener("DOMContentLoaded", () => {
  initFirstColumnWrappers(document);
  // Make sure any + buttons added later still re-wrap correctly
  document.querySelectorAll(".add-row").forEach(btn => {
    btn.addEventListener("click", () => {
      requestAnimationFrame(() => {
        initFirstColumnWrappers(btn.closest(".page-section") || document);
      });
    });
  });
});
