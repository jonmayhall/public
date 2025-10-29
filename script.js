// === SIDEBAR NAVIGATION ===
window.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("sidebar-nav");
  const sections = document.querySelectorAll(".page-section");

  if (nav) {
    nav.addEventListener("click", (e) => {
      const btn = e.target.closest(".nav-btn");
      if (!btn) return;

      const target = btn.dataset.target;
      const section = document.getElementById(target);
      if (!section) return;

      const active = document.querySelector(".page-section.active");
      if (active) {
        active.classList.remove("active");
        active.classList.add("fade-out");
        setTimeout(() => {
          active.classList.remove("fade-out");
        }, 250);
      }

      setTimeout(() => {
        sections.forEach((s) => s.classList.remove("active"));
        section.classList.add("active", "fade-in");
        setTimeout(() => section.classList.remove("fade-in"), 250);
      }, 150);

      nav.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // === SORTABLEJS ===
  const sortableScript = document.createElement("script");
  sortableScript.src = "https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js";
  document.head.appendChild(sortableScript);

  sortableScript.onload = () => {
    document.querySelectorAll(".draggable-table tbody").forEach((tbody) => {
      new Sortable(tbody, {
        animation: 150,
        handle: "td",
        ghostClass: "dragging",
      });
    });
  };

  // === ADD ROW FUNCTION ===
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("add-row")) return;
    const id = e.target.dataset.target;
    const table = document.getElementById(id);
    if (!table) return;

    const firstRow = table.querySelector("tbody tr");
    const clone = firstRow.cloneNode(true);

    clone.querySelectorAll("input").forEach((input) => (input.value = ""));
    clone.querySelectorAll("select").forEach((select) => {
      select.selectedIndex = 0;
      select.style.backgroundColor = "#f2f2f2";
    });

    table.querySelector("tbody").appendChild(clone);
  });

  // === AUTO EXPAND TEXTAREAS ===
  document.addEventListener("input", (e) => {
    if (e.target.tagName === "TEXTAREA") {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    }
  });

  // === PDF EXPORT ===
  const pdfButton = document.getElementById("pdfButton");
  if (pdfButton) {
    pdfButton.addEventListener("click", () => {
      const active = document.querySelector(".page-section.active");
      import("https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js")
        .then((html2pdf) => {
          html2pdf.default().from(active).save(`${active.id}.pdf`);
        });
    });
  }
});
