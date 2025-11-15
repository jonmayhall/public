// ================== SECTION NAVIGATION ==================

document.addEventListener("DOMContentLoaded", function () {
  const navButtons = document.querySelectorAll(".nav-button");
  const sections = document.querySelectorAll(".page-section");

  function showSection(targetId) {
    sections.forEach((section) => {
      section.classList.toggle("is-active", section.id === targetId);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      showSection(targetId);
    });
  });

  // ================== CLEAR ALL ==================

  const clearAllBtn = document.getElementById("clearAllBtn");

  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", () => {
      const ok = window.confirm(
        "Clear all fields in this checklist? This cannot be undone."
      );
      if (!ok) return;

      const inputs = document.querySelectorAll(
        "input, textarea, select"
      );

      inputs.forEach((el) => {
        const tag = el.tagName.toLowerCase();
        const type = (el.type || "").toLowerCase();

        if (tag === "select") {
          el.selectedIndex = 0;
        } else if (type === "checkbox" || type === "radio") {
          el.checked = false;
        } else if (type !== "button" && type !== "submit") {
          el.value = "";
        }
      });

      // Optional: clear only our own keys, if you choose to use them
      const keysToClear = ["mk_dealer_name"];
      keysToClear.forEach((key) => localStorage.removeItem(key));
    });
  }

  // ================== DEALERSHIP NAME PERSISTENCE ==================

  const DEALER_KEY = "mk_dealer_name";
  const dealershipInput = document.getElementById("dealershipName");

  if (dealershipInput) {
    const saved = localStorage.getItem(DEALER_KEY);
    if (saved) {
      dealershipInput.value = saved;
    }

    dealershipInput.addEventListener("input", () => {
      localStorage.setItem(DEALER_KEY, dealershipInput.value || "");
    });
  }
});
