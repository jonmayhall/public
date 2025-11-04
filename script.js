/* =======================================================
   myKaarma Interactive Training Checklist – script.js
   Final Stable Version (November 2025)
   ======================================================= */

// === PAGE NAVIGATION ===
const navButtons = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".page-section");

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const target = btn.getAttribute("data-target");
    sections.forEach((sec) => {
      sec.classList.toggle("active", sec.id === target);
    });

    window.scrollTo(0, 0);
  });
});

// === DYNAMIC ADD-ROW BUTTONS FOR TABLES ===
document.querySelectorAll(".add-row").forEach((button) => {
  button.addEventListener("click", () => {
    const table = button.closest(".table-container")?.querySelector("table");
    if (!table) return;

    const tbody = table.querySelector("tbody");
    const firstRow = tbody?.querySelector("tr");
    if (!firstRow) return;

    const newRow = firstRow.cloneNode(true);

    // Clear all inputs/selects in the cloned row
    newRow.querySelectorAll("input, select, textarea").forEach((el) => {
      if (el.type === "checkbox") {
        el.checked = false;
      } else if (el.tagName === "SELECT") {
        el.selectedIndex = 0;
      } else {
        el.value = "";
      }
    });

    tbody.appendChild(newRow);
    initFirstColumnWrappers(table); // reapply checkbox wrapper
  });
});

// === ADD TRAINER / CHAMPION / BLOCKER FIELDS ===
function addTrainerField(button) {
  const container = button.closest(".trainer-input").parentElement;
  const newDiv = document.createElement("div");
  newDiv.className = "trainer-input";
  newDiv.style.position = "relative";
  newDiv.innerHTML = `
    <input type="text" placeholder="Enter Additional Trainer..." style="width:100%;" />
    <button type="button" class="add-row small-btn" onclick="addTrainerField(this)">+</button>
  `;
  container.appendChild(newDiv);
}

function addChampionField(button) {
  const container = button.closest(".champion-input").parentElement;
  const newDiv = document.createElement("div");
  newDiv.className = "champion-input";
  newDiv.style.position = "relative";
  newDiv.innerHTML = `
    <input type="text" placeholder="Enter Champion Name & Role..." style="width:100%;" />
    <button type="button" class="add-row small-btn" onclick="addChampionField(this)">+</button>
  `;
  container.appendChild(newDiv);
}

function addBlockerField(button) {
  const container = button.closest(".blocker-input").parentElement;
  const newDiv = document.createElement("div");
  newDiv.className = "blocker-input";
  newDiv.style.position = "relative";
  newDiv.innerHTML = `
    <input type="text" placeholder="Enter Blocker Name & Role..." style="width:100%;" />
    <button type="button" class="add-row small-btn" onclick="addBlockerField(this)">+</button>
  `;
  container.appendChild(newDiv);
}

// === DEALERSHIP NAME LIVE UPDATE IN HEADER ===
const dealerInput = document.getElementById("dealer-name");
const dealerGroupInput = document.getElementById("dealer-group");
const topbar = document.querySelector(".topbar-content");

if (dealerInput && topbar) {
  const dealershipDisplay = document.createElement("div");
  dealershipDisplay.id = "dealershipNameDisplay";
  dealershipDisplay.textContent = "";
  topbar.appendChild(dealershipDisplay);

  const updateHeader = () => {
    const group = dealerGroupInput?.value?.trim() || "";
    const name = dealerInput?.value?.trim() || "";
    dealershipDisplay.textContent = group
      ? `${group} – ${name}`
      : name || "";
  };

  dealerInput.addEventListener("input", updateHeader);
  if (dealerGroupInput) dealerGroupInput.addEventListener("input", updateHeader);
}

// === SAVE AS PDF ===
document.addEventListener("DOMContentLoaded", () => {
  const pdfBtn = document.getElementById("save-pdf");
  if (pdfBtn) {
    pdfBtn.addEventListener("click", () => {
      window.print();
    });
  }
});

// === UTILITY: AUTO-ADJUST TABLE WIDTHS ===
window.addEventListener("load", () => {
  document.querySelectorAll(".scroll-wrapper").forEach((wrapper) => {
    const table = wrapper.querySelector("table");
    if (table) {
      table.style.minWidth = "100%";
      wrapper.scrollLeft = 0;
    }
  });
});

// =======================================================
// === FIRST COLUMN WRAPPERS WITH CHECKBOXES
// =======================================================
function initFirstColumnWrappers(scope = document) {
  scope.querySelectorAll(".training-table tbody tr").forEach((row) => {
    const td = row.querySelector("td:first-child");
    if (!td) return;

    // Skip if already wrapped
    if (td.querySelector(".firstcell")) return;

    // Move any existing content (like text or input)
    const existing = Array.from(td.childNodes).filter(
      (n) => n.nodeType === 1 || n.nodeType === 3
    );
    const wrapper = document.createElement("label");
    wrapper.className = "firstcell";

    const cb = document.createElement("input");
    cb.type = "checkbox";

    // Find or create name input
    let input = existing.find((n) => n.tagName === "INPUT");
    if (!input) {
      input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Name…";
      input.style.maxWidth = "130px";
    }

    // Clear and rebuild
    td.textContent = "";
    wrapper.append(cb, input);
    td.appendChild(wrapper);
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  initFirstColumnWrappers();

  // Reapply wrapper when new rows are added
  document.querySelectorAll(".add-row").forEach((btn) => {
    btn.addEventListener("click", () => {
      requestAnimationFrame(() =>
        initFirstColumnWrappers(btn.closest(".table-container") || document)
      );
    });
  });
});
