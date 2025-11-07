/* ==========================
   myKaarma – Interactive Training Checklist
   ========================== */

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

// === ADD ROW FUNCTIONALITY FOR ALL TABLES ===
document.querySelectorAll(".add-row").forEach(button => {
  button.addEventListener("click", e => {
    const table = e.target.closest(".section, .section-block").querySelector("table");
    if (!table) return;

    const firstRow = table.querySelector("tbody tr");
    if (!firstRow) return;

    const clone = firstRow.cloneNode(true);
    clone.querySelectorAll("input, select").forEach(el => {
      if (el.type === "checkbox") el.checked = false;
      else el.value = "";
    });

    table.querySelector("tbody").appendChild(clone);
  });
});

// === SAVE AS PDF ===
document.getElementById("savePDF")?.addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });

  const content = document.getElementById("content");
  await pdf.html(content, {
    callback: pdfDoc => pdfDoc.save("Training_Checklist.pdf"),
    margin: [20, 20, 20, 20],
    autoPaging: "text",
    x: 0,
    y: 0,
    html2canvas: { scale: 0.7 }
  });
});
