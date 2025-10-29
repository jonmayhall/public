// Run only after DOM is fully ready
window.addEventListener("DOMContentLoaded", () => {
  // === SIDEBAR NAVIGATION ===
  const nav = document.getElementById("sidebar-nav");
  const sections = document.querySelectorAll(".page-section");

  if (nav) {
    nav.addEventListener("click", (e) => {
      const btn = e.target.closest(".nav-btn");
      if (!btn) return;

      // Get target section
      const target = btn.dataset.target;
      const section = document.getElementById(target);
      if (!section) return;

      // Toggle visible section
      sections.forEach((s) => s.classList.remove("active"));
      section.classList.add("active");

      // Highlight active button
      nav.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // === TRAINING TABLE GENERATION ===
  const roles = [
    { id: "technicians", title: "Technicians – Checklist", rows: 3, cols: ["DMS ID","Login","Workflow","Mobile App Menu","Search Bar","RO Assignment","Dispatch","RO History","Prev. Declines","OCR","Edit ASR","ShopChat / Parts","Adding Media","Status Change","Notifications","Filters"] },
    { id: "advisors", title: "Service Advisors – Checklist", rows: 3, cols: ["DMS ID","Login","Mobile App Menu","MCI","Workflow","Search Bar","RO Assignment","DMS History","Prev. Declines","OCR","Edit ASR","ShopChat","Status Change","MPI Send","SOP"] },
    { id: "parts", title: "Parts Representatives – Checklist", rows: 2, cols: ["DMS ID","Login","Web App","Workflow","Search Bar","Take Function","DMS History","Prev. Declines","Parts Tab","SOP","Edit ASR","ShopChat / Parts","Status Change","Notifications","Filters"] },
    { id: "bdc", title: "BDC Representatives – Checklist", rows: 2, cols: ["DMS ID","Login","Scheduler","Declined Services","ServiceConnect","Call Routing"] },
    { id: "pickup", title: "Pick Up & Delivery Drivers – Checklist", rows: 2, cols: ["DMS ID","Login","PU&D","Notifications"] }
  ];

  const container = document.getElementById("tables-container");
  if (container) {
    roles.forEach((role) => {
      const div = document.createElement("div");
      div.classList.add("section");

      div.innerHTML = `
        <div class="section-header">${role.title}</div>
        <div class="table-container">
          <div class="scroll-wrapper">
            <table id="${role.id}" class="training-table">
              <thead>
                <tr><th style="width:260px;">Name</th>${role.cols.map(c => `<th>${c}</th>`).join("")}</tr>
              </thead>
              <tbody>
                ${Array.from({ length: role.rows }).map(() => `
                  <tr>
                    <td><input type="text" placeholder="Name"></td>
                    ${role.cols.map(() => `
                      <td>
                        <select>
                          <option></option>
                          <option value="Yes">Yes</option>
                          <option value="Web Only">Web Only</option>
                          <option value="Mobile Only">Mobile Only</option>
                          <option value="No">No</option>
                          <option value="Not Trained">Not Trained</option>
                          <option value="N/A">N/A</option>
                        </select>
                      </td>`).join("")}
                  </tr>`).join("")}
              </tbody>
            </table>
          </div>
        </div>
        <div class="table-footer"><button class="add-row" data-target="${role.id}" type="button">+</button></div>
        <div class="section-block comment-box"><h2>Additional Comments</h2><textarea placeholder="Type here…"></textarea></div>
      `;
      container.appendChild(div);
    });
  }

  // === DROPDOWN COLOR CODING ===
  document.addEventListener("change", (e) => {
    if (e.target.tagName === "SELECT") {
      const v = e.target.value;
      const colors = {
        "Yes": "#c9f7c0",
        "Web Only": "#fff8b3",
        "Mobile Only": "#ffe0b3",
        "No": "#ffb3b3",
        "Not Trained": "#ffb3b3",
        "N/A": "#f2f2f2"
      };
      e.target.style.backgroundColor = colors[v] || "#f2f2f2";
    }
  });

  // === ADD ROW FUNCTION ===
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("add-row")) return;
    const id = e.target.dataset.target;
    const table = document.getElementById(id);
    if (!table) return;

    const first = table.querySelector("tbody tr");
    const clone = first.cloneNode(true);
    clone.querySelectorAll("input").forEach((i) => (i.value = ""));
    clone.querySelectorAll("select").forEach((s) => {
      s.selectedIndex = 0;
      s.style.backgroundColor = "#f2f2f2";
    });

    table.querySelector("tbody").appendChild(clone);
  });

  // === AUTO-EXPAND TEXTAREAS ===
  document.addEventListener("input", (e) => {
    if (e.target.tagName === "TEXTAREA") {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    }
  });

  // === PDF EXPORT ===
  const pdfBtn = document.getElementById("pdfButton");
  if (pdfBtn) {
    pdfBtn.addEventListener("click", () => {
      const active = document.querySelector(".page-section.active");
      import("https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js")
        .then((html2pdf) =>
          html2pdf.default().from(active).save(`${active.id}.pdf`)
        );
    });
  }
});
