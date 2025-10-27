document.addEventListener("DOMContentLoaded", () => {
  // Sidebar navigation
  const nav = document.getElementById("sidebar-nav");
  nav.addEventListener("click", e => {
    const btn = e.target.closest(".nav-btn");
    if (!btn) return;
    const targetId = btn.dataset.target;
    document.querySelectorAll(".page-section").forEach(s => s.classList.remove("active"));
    document.getElementById(targetId).classList.add("active");
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Table generation
  const roles = [
    {id:"technicians", title:"Technicians – Checklist", rows:3, cols:["DMS ID","Login","Workflow","Mobile App Menu","Search Bar","RO Assignment","Dispatch","RO History","Prev. Declines","OCR","Edit ASR","ShopChat / Parts","Adding Media","Status Change","Notifications","Filters"]},
    {id:"advisors", title:"Service Advisors – Checklist", rows:3, cols:["DMS ID","Login","Mobile App Menu","MCI","Workflow","Search Bar","RO Assignment","DMS History","Prev. Declines","OCR","Edit ASR","ShopChat","Status Change","MPI Send","SOP"]},
    {id:"parts", title:"Parts Representatives – Checklist", rows:2, cols:["DMS ID","Login","Web App","Workflow","Search Bar","Take Function","DMS History","Prev. Declines","Parts Tab","SOP","Edit ASR","ShopChat / Parts","Status Change","Notifications","Filters"]},
    {id:"bdc", title:"BDC Representatives – Checklist", rows:2, cols:["DMS ID","Login","Scheduler","Declined Services","ServiceConnect","Call Routing"]},
    {id:"pickup", title:"Pick Up & Delivery Drivers – Checklist", rows:2, cols:["DMS ID","Login","PU&D","Notifications"]}
  ];

  const container = document.getElementById("tables-container");
  roles.forEach(role => {
    const div = document.createElement("div");
    div.classList.add("section");
    div.innerHTML = `
      <div class="section-header">${role.title}</div>
      <div class="table-container">
        <div class="scroll-wrapper">
          <table id="${role.id}" class="training-table">
            <thead>
              <tr><th style="width:260px;">Name</th>${role.cols.map(c=>`<th>${c}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${Array.from({length:role.rows}).map(()=>`
                <tr>
                  <td><input type="text" placeholder="Name"></td>
                  ${role.cols.map(()=>`
                    <td><select>
                      <option></option>
                      <option>Yes</option>
                      <option>Web Only</option>
                      <option>Mobile Only</option>
                      <option>No</option>
                      <option>Not Trained</option>
                      <option>N/A</option>
                    </select></td>`).join("")}
                </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
      <div class="table-footer"><button class="add-row" data-target="${role.id}" type="button">+</button></div>
      <div class="section-block comment-box"><h2>Additional Comments</h2><textarea placeholder="Type here…"></textarea></div>`;
    container.appendChild(div);
  });

  // Color-coded dropdowns
  function colorSelect(sel) {
    const colors = {
      "Yes": "#c9f7c0",
      "Web Only": "#fff8b3",
      "Mobile Only": "#ffe0b3",
      "No": "#ffb3b3",
      "Not Trained": "#ffb3b3",
      "N/A": "#f2f2f2"
    };
    sel.style.backgroundColor = colors[sel.value] || "#f2f2f2";
  }
  document.addEventListener("change", e => {
    if (e.target.tagName === "SELECT") colorSelect(e.target);
  });

  // Add row
  document.addEventListener("click", e => {
    if (!e.target.classList.contains("add-row")) return;
    const id = e.target.dataset.target;
    const table = document.getElementById(id);
    const first = table.querySelector("tbody tr");
    const clone = first.cloneNode(true);
    clone.querySelectorAll("input").forEach(i => i.value = "");
    clone.querySelectorAll("select").forEach(s => {
      s.selectedIndex = 0;
      s.style.backgroundColor = "#f2f2f2";
    });
    table.querySelector("tbody").appendChild(clone);
  });

  // Auto-expand textarea
  document.addEventListener("input", e => {
    if (e.target.tagName === "TEXTAREA") {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    }
  });

  // PDF export
  document.getElementById("pdfButton").addEventListener("click", () => {
    const active = document.querySelector(".page-section.active");
    import("https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf
