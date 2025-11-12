// =========================================================
// === myKaarma Interactive Training Checklist JS ===
// =========================================================

// Wait until DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".page-section");
  const menuButtons = document.querySelectorAll(".menu-button");

  // Hide all pages initially except the first one
  pages.forEach((page, index) => {
    page.style.display = index === 0 ? "block" : "none";
  });

  // Menu button click handling
  menuButtons.forEach(button => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const targetPage = document.querySelector(`#${targetId}`);

      // Hide all pages
      pages.forEach(page => {
        page.style.display = "none";
      });

      // Show target page
      if (targetPage) {
        targetPage.style.display = "block";
        window.scrollTo(0, 0); // scroll to top of page
      }

      // Update active button styling
      menuButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
    });
  });

  // =========================================================
  // === Dynamic Add Buttons (for Trainers & POC fields) ===
  // =========================================================
  const addButtons = document.querySelectorAll(".add-btn");

  addButtons.forEach(button => {
    button.addEventListener("click", () => {
      const parent = button.closest(".form-row");
      if (parent) {
        const clone = parent.cloneNode(true);
        const input = clone.querySelector("input");
        if (input) input.value = "";
        parent.parentNode.insertBefore(clone, parent.nextSibling);
      }
    });
  });
});
