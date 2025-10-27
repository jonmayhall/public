// === Sidebar Navigation ===
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");
    document.querySelectorAll(".page-section").forEach(s => s.classList.remove("active"));
    document.getElementById(target).classList.add("active");
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// === Table Generation ===
const roles = [
  {id:"technicians", title:"Technicians – Checklist", rows:3, cols:["DMS ID","Login","Workflow","Mobile App Menu","Search Bar","RO Assignment","Dispatch","RO History","Prev. Declines","OCR","Edit ASR","ShopChat / Parts","Adding Media","Status Change","Notifications","Filters"]},
  {id:"advisors",
