// === Sidebar Navigation ===
const navButtons = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".page-section");

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");
    sections.forEach((sec) => {
      sec.classList.remove("active");
      sec.style.display = "none";
    });
    document.getElementById(target).classList.add("active");
    document.getElementById(target).style.display = "block";
    window.scrollTo({ top: 0 });
  });
});

// === Save & Restore Inputs ===
document.querySelectorAll("input, select, textarea").forEach((el) => {
  const key = `${el.closest("section")?.id || "global"}_${el.previousElementSibling?.textContent || el.placeholder}`;
  // Load stored value
  if (localStorage.getItem(key)) el.value = localStorage.getItem(key);
  // Save on change
  el.addEventListener("input", () => localStorage.setItem(key, el.value));
});

// === Workflow Color Logic ===
function setWorkflowColor(el) {
  const v = el.value.toLowerCase();
  if (v.includes("both")) el.style.background = "#c7f5c1"; // green
  else if (v.includes("desktop")) el.style.background = "#ffd79a"; // orange
  else if (v.includes("mobile")) el.style.background = "#fff59d"; // yellow
  else if (v.includes("not")) el.style.background = "#f7b2b2"; // red
  else el.style.background = "white";
}

document.querySelectorAll("#workflow select").forEach((el) => {
  setWorkflowColor(el);
  el.addEventListener("change", () => setWorkflowColor(el));
});

// === PDF Export (current page) ===
document.getElementById("pdfButton").addEventListener("click", () => {
  const activePage = document.querySelector(".page-section.active");
  import("https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js")
    .then((html2pdf) => {
      const opt = {
        margin: 0.3,
        filename: `${activePage.id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      html2pdf.default().from(activePage).set(opt).save();
    });
});

// === JSON Export (all data) ===
document.getElementById("exportButton").addEventListener("click", () => {
  const data = {};
  document.querySelectorAll("input, select, textarea").forEach((el) => {
    const key = `${el.closest("section")?.id || "global"}_${el.previousElementSibling?.textContent || el.placeholder}`;
    data[key] = el.value;
  });
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "mykaarma-training-data.json";
  a.click();
});
// === TRAINING CHECKLIST INTERACTIONS ===
// Color coding for dropdowns across all checklist tables
document.addEventListener("change", (e) => {
  if (e.target.tagName === "SELECT" && e.target.closest(".training-table")) {
    const v = e.target.value;
    e.target.classList.remove("green", "yellow", "red", "gray");

    if (v === "Yes") e.target.classList.add("green");
    else if (v === "Web Only" || v === "Mobile Only") e.target.classList.add("yellow");
    else if (v === "No") e.target.classList.add("red");
    else if (v === "N/A") e.target.classList.add("gray");
  }
});
