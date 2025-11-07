/* =======================================================
   myKaarma Interactive Training Checklist
   Restored JS – Working Navigation, Add Rows, and Completion
   ======================================================= */

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script loaded and running.");

  // === SIDEBAR NAVIGATION ===
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".page-section");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");

      // Update button state
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Switch pages
      sections.forEach((s) => s.classList.remove("active"));
      const targetSection = document.getElementById(target);
      if (targetSection) targetSection.classList.add("active");

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // === ADD ROW FUNCTIONALITY ===
  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-row") || e.target.classList.contains("add-btn")) {
      const table = e.target.closest(".section-block").querySelector(".training-table tbody");
      if (!table) return;

      const firstRow = table.querySelector("tr");
      if (!firstRow) return;

      const newRow = firstRow.cloneNode(true);
      newRow.querySelectorAll("input, select").forEach((input) => {
        if (input.tagName === "SELECT") {
          input.selectedIndex = 0;
        } else {
          input.value = "";
        }
      });

      table.appendChild(newRow);
    }
  });

  // === PAGE COMPLETION TRACKER ===
  const sectionsToTrack = document.querySelectorAll(".page-section");
  sectionsToTrack.forEach((section) => {
    const inputs = section.querySelectorAll("input, select, textarea");
    if (inputs.length === 0) return;

    const completionBanner = document.createElement("div");
    completionBanner.classList.add("page-complete");
    completionBanner.textContent = "Page Incomplete";
    completionBanner.style.display = "block";
    completionBanner.style.background = "#eee";
    completionBanner.style.padding = "6px 12px";
    completionBanner.style.marginBottom = "10px";
    completionBanner.style.borderRadius = "8px";
    completionBanner.style.fontSize = "13px";
    completionBanner.style.fontWeight = "500";
    completionBanner.style.width = "fit-content";
    section.insertBefore(completionBanner, section.children[1]);

    inputs.forEach((el) => {
      el.addEventListener("change", () => {
        checkCompletion(section, completionBanner);
      });
    });
  });

  function checkCompletion(section, banner) {
    const inputs = Array.from(section.querySelectorAll("input, select, textarea"))
      .filter(el => el.tagName !== "TEXTAREA" || !el.closest(".comment-box"));

    const allFilled = inputs.every((el) => {
      if (el.type === "text" || el.tagName === "TEXTAREA") {
        return el.value.trim() !== "";
      } else if (el.tagName === "SELECT") {
        return el.selectedIndex > 0;
      }
      return true;
    });

    if (allFilled) {
      const now = new Date();
      const timeString = now.toLocaleString("en-US", {
        dateStyle: "short",
        timeStyle: "short",
      });
      banner.textContent = `✅ Page Complete — ${timeString}`;
      banner.style.background = "#d6f5d6";
      banner.style.color = "#000";
    } else {
      banner.textContent = "Page Incomplete";
      banner.style.background = "#eee";
      banner.style.color = "#000";
    }
  }

  // === UPDATE DEALERSHIP HEADER DYNAMICALLY ===
  const dealerGroupInput = document.querySelector('input[placeholder="Dealer Group"]');
  const dealerNameInput = document.querySelector('input[placeholder="Dealership Name"]');
  const display = document.getElementById("dealershipNameDisplay");

  function updateHeader() {
    let group = dealerGroupInput?.value.trim() || "";
    let name = dealerNameInput?.value.trim() || "";

    if (group.match(/^(N\/A|none|no|unknown|don’t|na)$/i)) group = "";

    if (name) {
      display.textContent = group ? `${group} – ${name}` : name;
    } else {
      display.textContent = "Dealership Name";
    }
  }

  [dealerGroupInput, dealerNameInput].forEach((input) => {
    if (input) input.addEventListener("input", updateHeader);
  });

  // === SUBMIT TRAINING SUMMARY ===
  const submitBtn = document.getElementById("submitSummaryBtn");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const summary = {
        overall: document.getElementById("overallNotes")?.value || "",
        pretraining: document.getElementById("pretrainingNotes")?.value || "",
        tuesday: document.getElementById("tuesdayNotes")?.value || "",
        thursday: document.getElementById("thursdayNotes")?.value || "",
        dms: document.getElementById("dmsNotes")?.value || "",
        post: document.getElementById("postTrainingNotes")?.value || "",
      };

      console.log("Submitting summary:", summary);
      alert("✅ Training Summary Submitted Successfully!");
    });
  }
});
