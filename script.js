/* =======================================================
   myKaarma Interactive Training Checklist – Restored Script
   ======================================================= */

// === SIDEBAR NAVIGATION ===
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

// === ADD ROW BUTTONS ===
document.addEventListener("click", e => {
  if (e.target.classList.contains("add-btn") || e.target.classList.contains("add-row")) {
    const table = e.target.closest("table");
    if (table) {
      const lastRow = table.querySelector("tbody tr:last-child");
      if (lastRow) {
        const clone = lastRow.cloneNode(true);
        clone.querySelectorAll("input, select").forEach(input => {
          if (input.tagName === "SELECT") input.selectedIndex = 0;
          else input.value = "";
        });
        table.querySelector("tbody").appendChild(clone);
      }
    }
  }
});

// === AUTO-FILL END DATE ===
const trainingStart = document.getElementById("trainingStart");
const trainingEnd = document.getElementById("trainingEnd");
if (trainingStart && trainingEnd) {
  trainingStart.addEventListener("change", () => {
    const start = new Date(trainingStart.value);
    if (!isNaN(start)) {
      const end = new Date(start);
      end.setDate(end.getDate() + 2);
      trainingEnd.value = end.toISOString().split("T")[0];
    }
  });
}

// === DEALERSHIP NAME HEADER AUTO-FILL ===
const dealershipNameInput = document.querySelector('#dealership-info input[placeholder="Dealership Name"]');
const dealerGroupInput = document.querySelector('#dealership-info input[placeholder="Dealer Group"]');
const dealershipDisplay = document.getElementById("dealershipNameDisplay");

function updateHeaderName() {
  const dealerGroup = (dealerGroupInput?.value || "").trim();
  const dealership = (dealershipNameInput?.value || "").trim();

  let exclude = ["n/a", "na", "none", "no", "i don't know"];
  let headerText = dealership || "Dealership Name";

  if (dealerGroup && !exclude.includes(dealerGroup.toLowerCase())) {
    headerText = `${dealerGroup} – ${dealership}`;
  }

  if (dealershipDisplay) dealershipDisplay.textContent = headerText;
}

dealershipNameInput?.addEventListener("input", updateHeaderName);
dealerGroupInput?.addEventListener("input", updateHeaderName);

// === PAGE COMPLETION TRACKER ===
function checkPageCompletion(section) {
  const inputs = section.querySelectorAll("input:not([type='date']), select, textarea");
  let total = 0;
  let filled = 0;
  inputs.forEach(i => {
    // Skip Notes sections
    if (i.closest("textarea") || i.closest(".comment-box") || i.closest("h2")?.textContent.toLowerCase().includes("notes")) return;
    total++;
    if (i.value.trim() !== "") filled++;
  });

  const pageComplete = section.querySelector(".page-complete");
  if (!pageComplete) return;

  if (filled > 0 && filled === total) {
    const now = new Date();
    const timeStr = now.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
    pageComplete.style.display = "inline-block";
    pageComplete.querySelector(".page-timestamp").textContent = `  (${timeStr})`;
  } else {
    pageComplete.style.display = "none";
  }
}

document.querySelectorAll(".page-section").forEach(section => {
  section.addEventListener("input", () => checkPageCompletion(section));
});

// === AUTO-FILL NOTES INTO SUMMARY ===
const noteMap = {
  pretraining: "pretrainingNotes",
  trainingChecklist: "tuesdayNotes",
  opcodesPricing: "thursdayNotes",
  dmsIntegration: "dmsNotes",
  postTraining: "postTrainingNotes"
};

Object.entries(noteMap).forEach(([pageId, summaryId]) => {
  const pageNotes = document.querySelector(`#${pageId} textarea`);
  const summaryField = document.getElementById(summaryId);
  if (pageNotes && summaryField) {
    pageNotes.addEventListener("input", () => {
      summaryField.value = pageNotes.value;
    });
  }
});

// === SUBMIT TO GOOGLE SHEETS ===
const submitSummaryBtn = document.getElementById("submitSummaryBtn");
if (submitSummaryBtn) {
  submitSummaryBtn.addEventListener("click", async () => {
    const leadTrainer = document.getElementById("leadTrainerSelect")?.value || "";
    const pretrainingNotes = document.getElementById("pretrainingNotes")?.value || "";
    const tuesdayNotes = document.getElementById("tuesdayNotes")?.value || "";
    const thursdayNotes = document.getElementById("thursdayNotes")?.value || "";
    const dmsNotes = document.getElementById("dmsNotes")?.value || "";
    const postNotes = document.getElementById("postTrainingNotes")?.value || "";
    const overallNotes = document.getElementById("overallNotes")?.value || "";

    const payload = {
      leadTrainer,
      pretrainingNotes,
      tuesdayNotes,
      thursdayNotes,
      dmsNotes,
      postNotes,
      overallNotes
    };

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwPRZ8t3_jqP-KMvFgo0dVK1aeWQero81RoOi9_h0luQMaCrRJ6wDBPwomk_d_GnoA9Gg/exec",
        {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify(payload)
        }
      );
      alert("Training Summary Submitted Successfully!");
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Error submitting summary. Please try again.");
    }
  });
}
