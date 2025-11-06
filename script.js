/* =======================================================
   myKaarma Interactive Training Checklist
   JavaScript Logic – Updated November 2025
   ======================================================= */

/* ========================================================= */
/* === SIDEBAR NAVIGATION === */
/* ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".page-section");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      sections.forEach((sec) => sec.classList.remove("active"));
      const target = document.getElementById(btn.dataset.target);
      if (target) target.classList.add("active");

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
});

/* ========================================================= */
/* === ADD ROW FUNCTIONALITY === */
/* ========================================================= */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-btn")) {
    const table = e.target.closest(".section-block, .card").querySelector("table");
    if (!table) return;

    const tbody = table.querySelector("tbody");
    const lastRow = tbody.querySelector("tr:last-child");
    const clone = lastRow.cloneNode(true);

    clone.querySelectorAll("input, select").forEach((el) => {
      if (el.type === "checkbox") el.checked = false;
      else el.value = "";
    });

    tbody.appendChild(clone);
  }
});

/* ========================================================= */
/* === PAGE COMPLETION STATUS + TIMESTAMP === */
/* ========================================================= */
function checkPageCompletion(page) {
  const inputs = page.querySelectorAll("input, select, textarea");
  const nonNotes = [...inputs].filter(
    (el) =>
      !(el.tagName === "TEXTAREA" && el.closest(".section-block h2")?.innerText.toLowerCase().includes("note"))
  );

  const allFilled = nonNotes.length > 0 && nonNotes.every((el) => {
    if (el.type === "checkbox") return true;
    return el.value && el.value.trim() !== "";
  });

  let completeTag = page.querySelector(".page-complete");
  if (!completeTag) {
    completeTag = document.createElement("div");
    completeTag.className = "page-complete";
    page.prepend(completeTag);
  }

  let timestampTag = page.querySelector(".page-timestamp");
  if (!timestampTag) {
    timestampTag = document.createElement("span");
    timestampTag.className = "page-timestamp";
    completeTag.appendChild(timestampTag);
  }

  if (allFilled) {
    const now = new Date();
    const formatted = now.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    completeTag.textContent = "Page Complete";
    completeTag.appendChild(timestampTag);
    timestampTag.textContent = ` — ${formatted}`;
    completeTag.style.display = "inline-block";
  } else {
    completeTag.textContent = "";
    completeTag.style.display = "none";
  }
}

// Observe field changes
document.addEventListener("input", (e) => {
  const section = e.target.closest(".page-section");
  if (section) checkPageCompletion(section);
});

/* ========================================================= */
/* === DEALERSHIP HEADER AUTO-POPULATE === */
/* ========================================================= */
document.addEventListener("input", () => {
  const dealerGroupInput = document.querySelector(
    '#dealership-info input[placeholder="Dealer Group"], #dealership-info input[name="Dealer Group"]'
  );
  const dealershipNameInput = document.querySelector(
    '#dealership-info input[placeholder="Dealership Name"], #dealership-info input[name="Dealership Name"]'
  );

  const headerDisplay = document.getElementById("dealershipNameDisplay");
  if (!headerDisplay || !dealershipNameInput) return;

  const dealerGroup = dealerGroupInput?.value?.trim();
  const dealership = dealershipNameInput.value.trim();

  if (!dealership) {
    headerDisplay.textContent = "Dealership Name";
    return;
  }

  const ignore = ["n/a", "none", "i don't know", "unknown"];
  if (dealerGroup && !ignore.includes(dealerGroup.toLowerCase())) {
    headerDisplay.textContent = `${dealerGroup} – ${dealership}`;
  } else {
    headerDisplay.textContent = dealership;
  }
});

/* ========================================================= */
/* === AUTO-FILL NOTES INTO SUMMARY PAGE === */
/* ========================================================= */
function autoFillNotes() {
  const pretraining = document.querySelector("#pretraining textarea");
  const dealership = document.querySelector("#dealership-info textarea");
  const onsite = document.querySelector("#onsite-trainers textarea");
  const training = document.querySelector("#training-checklist textarea");
  const opcodes = document.querySelector("#opcodes-pricing textarea");
  const dms = document.querySelector("#dms-integration textarea");
  const post = document.querySelector("#post-training textarea");

  const summary = {
    pretraining: document.getElementById("pretrainingNotes"),
    tuesday: document.getElementById("tuesdayNotes"),
    thursday: document.getElementById("thursdayNotes"),
    dms: document.getElementById("dmsNotes"),
    post: document.getElementById("postTrainingNotes"),
  };

  if (summary.pretraining)
    summary.pretraining.value = [pretraining?.value, dealership?.value, onsite?.value]
      .filter(Boolean)
      .join("\n\n");

  if (summary.tuesday) summary.tuesday.value = training?.value || "";
  if (summary.thursday) summary.thursday.value = opcodes?.value || "";
  if (summary.dms) summary.dms.value = dms?.value || "";
  if (summary.post) summary.post.value = post?.value || "";
}

setInterval(autoFillNotes, 3000);

/* ========================================================= */
/* === GOOGLE SHEETS SUBMISSION === */
/* ========================================================= */
const sheetURL =
  "https://script.google.com/macros/s/AKfycbwPRZ8t3_jqP-KMvFgo0dVK1aeWQero81RoOi9_h0luQMaCrRJ6wDBPwomk_d_GnoA9Gg/exec";

document.getElementById("submitSummaryBtn")?.addEventListener("click", async () => {
  autoFillNotes();

  const data = {
    dealer: document.getElementById("dealershipNameDisplay").textContent.trim(),
    overall: document.getElementById("overallNotes")?.value || "",
    pretraining: document.getElementById("pretrainingNotes")?.value || "",
    tuesday: document.getElementById("tuesdayNotes")?.value || "",
    thursday: document.getElementById("thursdayNotes")?.value || "",
    dms: document.getElementById("dmsNotes")?.value || "",
    post: document.getElementById("postTrainingNotes")?.value || "",
  };

  try {
    const response = await fetch(sheetURL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(data),
    });
    alert("✅ Training Summary submitted successfully!");
  } catch (err) {
    console.error("Submission error:", err);
    alert("⚠️ Error submitting summary. Check console for details.");
  }
});
