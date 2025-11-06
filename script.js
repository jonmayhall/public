/* =======================================================
   myKaarma Interactive Training Checklist
   Clean Functional JS – November 2025
   ======================================================= */

// === SIDEBAR NAVIGATION ===
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    // remove active from all
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // show the target section
    document.querySelectorAll(".page-section").forEach(sec => sec.classList.remove("active"));
    const target = document.getElementById(btn.dataset.target);
    if (target) target.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// === AUTO-FILL END DATE (2 days after start date) ===
const startInput = document.getElementById("trainingStart");
const endInput = document.getElementById("trainingEnd");
if (startInput && endInput) {
  startInput.addEventListener("change", () => {
    const startDate = new Date(startInput.value);
    if (!isNaN(startDate)) {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 2);
      const formatted = endDate.toISOString().split("T")[0];
      endInput.value = formatted;
    }
  });
}

// === ADD-ROW BUTTONS (Dynamic Row Creation) ===
document.querySelectorAll(".add-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const table = btn.closest("table");
    if (!table) return;
    const tbody = table.querySelector("tbody");
    const firstRow = tbody.querySelector("tr");
    if (firstRow) {
      const clone = firstRow.cloneNode(true);
      clone.querySelectorAll("input, select").forEach(el => (el.value = ""));
      tbody.appendChild(clone);
    }
  });
});

// === ADDITIONAL TRAINERS / POC ADD BUTTONS ===
document.querySelectorAll(".add-row").forEach(button => {
  button.addEventListener("click", () => {
    const parent = button.closest(".checklist-row");
    const clone = parent.cloneNode(true);
    clone.querySelector("input").value = "";
    parent.parentNode.insertBefore(clone, parent.nextSibling);
  });
});

// === PAGE COMPLETION CHECK + TIMESTAMP ===
function updatePageCompletion(section) {
  const selects = section.querySelectorAll("select");
  const inputs = section.querySelectorAll("input[type=text], input[type=email], input[type=date]");
  const textareas = section.querySelectorAll("textarea:not(.notes-only)");

  const allAnswered = [...selects, ...inputs]
    .filter(el => el.closest(".comment-box") === null)
    .every(el => el.value.trim() !== "");

  const completeBanner = section.querySelector(".page-complete");
  if (completeBanner) {
    if (allAnswered) {
      const now = new Date();
      const timestamp = now.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
      completeBanner.style.display = "inline-block";
      const ts = completeBanner.querySelector(".page-timestamp");
      if (ts) ts.textContent = ` – ${timestamp}`;
      section.dataset.completed = "true";
    } else {
      completeBanner.style.display = "none";
      section.dataset.completed = "false";
    }
  }
}

// monitor changes
document.querySelectorAll(".page-section").forEach(section => {
  section.addEventListener("input", () => updatePageCompletion(section));
});

// === AUTO-FILL DEALERSHIP NAME IN HEADER ===
const dealerInput = document.querySelector("#dealership-info input[placeholder='Dealership Name']");
const groupInput = document.querySelector("#dealership-info input[placeholder='Dealer Group']");
if (dealerInput) {
  dealerInput.addEventListener("input", () => {
    const group = groupInput?.value?.trim();
    const name = dealerInput.value.trim();
    const display = document.getElementById("dealershipNameDisplay");
    if (!display) return;
    if (!name) {
      display.textContent = "Dealership Name";
      return;
    }
    if (group && !["n/a", "none", "i don't know", "na"].includes(group.toLowerCase())) {
      display.textContent = `${group} – ${name}`;
    } else {
      display.textContent = name;
    }
  });
}

// === AUTO-FILL NOTES INTO SUMMARY PAGE ===
function fillSummaryNotes() {
  const summary = document.getElementById("training-summary");
  if (!summary) return;

  // pretraining
  const pre = document.querySelector("#pretraining textarea");
  const preField = document.getElementById("pretrainingNotes");
  if (pre && preField) preField.value = pre.value;

  // monday visit
  const mon = document.querySelector("#monday-visit textarea");
  const tuesField = document.getElementById("tuesdayNotes");
  if (mon && tuesField) tuesField.value = mon.value;

  // training checklist
  const train = document.querySelector("#training-checklist textarea");
  if (train && tuesField) tuesField.value += `\n${train.value}`;

  // opcodes
  const op = document.querySelector("#opcodes-pricing textarea");
  const thuField = document.getElementById("thursdayNotes");
  if (op && thuField) thuField.value = op.value;

  // dms
  const dms = document.querySelector("#dms-integration textarea");
  const dmsField = document.getElementById("dmsNotes");
  if (dms && dmsField) dmsField.value = dms.value;

  // post-training
  const post = document.querySelector("#post-training textarea");
  const postField = document.getElementById("postTrainingNotes");
  if (post && postField) postField.value = post.value;
}

// === SUBMIT TO GOOGLE SCRIPT ===
const submitBtn = document.getElementById("submitSummaryBtn");
if (submitBtn) {
  submitBtn.addEventListener("click", () => {
    fillSummaryNotes();
    const trainer = document.getElementById("leadTrainerSelect")?.value || "";
    const dealership = dealerInput?.value || "";
    const data = {
      trainer,
      dealership,
      timestamp: new Date().toLocaleString(),
      overall: document.getElementById("overallNotes")?.value || "",
      pretraining: document.getElementById("pretrainingNotes")?.value || "",
      tuesday: document.getElementById("tuesdayNotes")?.value || "",
      thursday: document.getElementById("thursdayNotes")?.value || "",
      dms: document.getElementById("dmsNotes")?.value || "",
      post: document.getElementById("postTrainingNotes")?.value || ""
    };

    fetch("https://script.google.com/macros/s/AKfycbwPRZ8t3_jqP-KMvFgo0dVK1aeWQero81RoOi9_h0luQMaCrRJ6wDBPwomk_d_GnoA9Gg/exec", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    alert("Training Summary submitted successfully!");
  });
}

// === INITIAL LOAD ===
window.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".page-section.active")?.scrollIntoView({ behavior: "smooth" });
});
