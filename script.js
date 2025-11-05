/* ========= myKaarma – Interactive Training Checklist ========= */

/* === NAVIGATION BETWEEN PAGES === */
const navButtons = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".page-section");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const target = btn.getAttribute("data-target");
    sections.forEach(sec => sec.classList.toggle("active", sec.id === target));
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

/* === ADD ROW BUTTONS === */
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
    initFirstColumnWrappers(table);
  });
});

/* === INLINE FIELD ADDERS (TRAINERS, CHAMPIONS, BLOCKERS) === */
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

/* === LIVE DEALERSHIP NAME IN HEADER === */
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

/* === SAVE AS PDF === */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("save-pdf")?.addEventListener("click", () => window.print());
});

/* === TABLE WIDTH ALIGNMENT === */
window.addEventListener("load", () => {
  document.querySelectorAll(".scroll-wrapper").forEach(wrapper => {
    const table = wrapper.querySelector("table");
    if (table) {
      table.style.minWidth = "100%";
      wrapper.scrollLeft = 0;
    }
  });
});

/* === STICKY FIRST COLUMN WRAPPER === */
function initFirstColumnWrappers(scope = document) {
  const pages = scope.querySelectorAll("#training-checklist, #opcodes-pricing");
  if (!pages.length) return;

  pages.forEach(page => {
    page.querySelectorAll(".training-table tbody tr").forEach(row => {
      const td = row.querySelector("td:first-child");
      if (!td || td.querySelector(".firstcell")) return;

      const existingInput = td.querySelector("input[type='text']");
      if (!existingInput) return;

      const wrapper = document.createElement("div");
      wrapper.className = "firstcell";

      const cb = document.createElement("input");
      cb.type = "checkbox";

      td.textContent = "";
      wrapper.append(cb, existingInput);
      td.appendChild(wrapper);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initFirstColumnWrappers(document);
  document.querySelectorAll(".add-row").forEach(btn => {
    btn.addEventListener("click", () => {
      requestAnimationFrame(() => {
        initFirstColumnWrappers(btn.closest(".page-section") || document);
      });
    });
  });
});

/* === AUTO SCROLL TO TOP ON PAGE CHANGE (safety fallback) === */
document.addEventListener("click", e => {
  if (e.target.classList.contains("nav-btn")) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});
