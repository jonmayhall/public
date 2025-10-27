// === Sidebar Navigation ===
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");

    // Activate section
    document.querySelectorAll(".page-section").forEach(s => s.classList.remove("active"));
    document.getElementById(target).classList.add("active");

    // Highlight button
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Scroll top
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// === PDF Export ===
document.getElementById("pdfButton").addEventListener("click", () => {
  const active = document.querySelector(".page-section.active");
  import("https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js")
    .then(html2pdf => html2pdf.default().from(active).save(`${active.id}.pdf`));
});
