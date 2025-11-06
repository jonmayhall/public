/* =======================================================
   myKaarma Interactive Training Checklist JS
   Compact Classic Logic – Original Morning Version
   ======================================================= */

// === Sidebar Navigation ===
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".page-section").forEach(sec => sec.classList.remove("active"));
    const target = document.getElementById(btn.dataset.target);
    if (target) target.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// === Add Row Buttons ===
document.querySelectorAll(".add-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const table = btn.closest("table");
    const tbody = table?.querySelector("tbody");
    const row = tbody?.querySelector("tr");
    if (row) {
      const clone = row.cloneNode(true);
      clone.querySelectorAll("input, select").forEach(el => (el.value = ""));
      tbody.appendChild(clone);
    }
  });
});

// === Auto Fill End Date (2 days later) ===
const start = document.getElementById("trainingStart");
const end = document.getElementById("trainingEnd");
if (start && end) {
  start.addEventListener("change", () => {
    const d = new Date(start.value);
    if (!isNaN(d)) {
      d.setDate(d.getDate() + 2);
      end.value = d.toISOString().split("T")[0];
    }
  });
}

// === Dealership Name Auto Update ===
const groupInput = document.querySelector("#dealership-info input[placeholder='Dealer Group']");
const dealerInput = document.querySelector("#dealership-info input[placeholder='Dealership Name']");
if (dealerInput) {
  dealerInput.addEventListener("input", () => {
    const group = groupInput?.value?.trim();
    const name = dealerInput.value.trim();
    const header = document.getElementById("dealershipNameDisplay");
    if (!name) {
      header.textContent = "Dealership Name";
      return;
    }
    if (group && !["n/a", "none", "i don't know", "na"].includes(group.toLowerCase())) {
      header.textContent = `${group} – ${name}`;
    } else {
      header.textContent = name;
    }
  });
}

// === Summary Auto Fill ===
function fillSummary() {
  const map = [
    ["#pretraining textarea", "#pretrainingNotes"],
    ["#monday-visit textarea", "#tuesdayNotes"],
    ["#training-checklist textarea", "#tuesdayNotes"],
    ["#opcodes-pricing textarea", "#thursdayNotes"],
    ["#dms-integration textarea", "#dmsNotes"],
    ["#post-training textarea", "#postTrainingNotes"]
  ];
  map.forEach(([src, dest]) => {
    const s = document.querySelector(src);
    const d = document.querySelector(dest);
    if (s && d) d.value = s.value;
  });
}

// === Submit Summary ===
const submitBtn = document.getElementById("submitSummaryBtn");
if (submitBtn) {
  submitBtn.addEventListener("click", () => {
    fillSummary();
    const payload = {
      trainer: document.getElementById("leadTrainerSelect")?.value || "",
      dealership: dealerInput?.value || "",
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
      body: JSON.stringify(payload)
    });

    alert("Training Summary submitted successfully!");
  });
}
