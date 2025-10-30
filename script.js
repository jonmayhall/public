// =======================================================
// === FIXED SCRIPT FOR TRAINING CHECKLIST & TABLES ===
// =======================================================
window.addEventListener("DOMContentLoaded", () => {

  // === SIDEBAR NAVIGATION ===
  const nav = document.getElementById("sidebar-nav");
  const sections = document.querySelectorAll(".page-section");
  if (nav) {
    nav.addEventListener("click", (e) => {
      const btn = e.target.closest(".nav-btn");
      if (!btn) return;
      const target = btn.dataset.target;
      const section = document.getElementById(target);
      if (!section) return;
      document.querySelector(".page-section.active")?.classList.remove("active");
      section.classList.add("active");
      nav.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // === TRAINING CHECKLIST TABLE BUILDER ===
  const roles = [
    {id:"technicians",title:"Technicians – Checklist",cols:["DMS ID","Login","Workflow","Mobile App Menu","Search Bar","RO Assignment","Dispatch","RO History","Prev. Declines","OCR","Edit ASR","ShopChat / Parts","Adding Media","Status Change","Notifications","Filters"],rows:3},
    {id:"advisors",title:"Service Advisors – Checklist",cols:["DMS ID","Login","Mobile App Menu","MCI","Workflow","Search Bar","RO Assignment","DMS History","Prev. Declines","OCR","Edit ASR","ShopChat","Status Change","MPI Send","SOP"],rows:3},
    {id:"parts",title:"Parts Representatives – Checklist",cols:["DMS ID","Login","Web App","Workflow","Search Bar","Take Function","DMS History","Prev. Declines","Parts Tab","SOP","Edit ASR","ShopChat / Parts","Status Change","Notifications","Filters"],rows:2},
    {id:"bdc",title:"BDC Representatives – Checklist",cols:["DMS ID","Login","Scheduler","Declined Services","ServiceConnect","Call Routing"],rows:2},
    {id:"pickup",title:"Pick Up & Delivery Drivers – Checklist",cols:["DMS ID","Login","PU&D","Notifications"],rows:2}
  ];

  const container=document.getElementById("tables-container");
  if(container){
    roles.forEach(role=>{
      const section=document.createElement("div");
      section.classList.add("section");
      const table=`
        <div class="section-header">${role.title}</div>
        <div class="table-container">
          <div class="scroll-wrapper">
            <table id="${role.id}" class="training-table">
              <thead><tr>
                <th></th><th style="width:300px;">Name</th>
                ${role.cols.map(c=>`<th>${c}</th>`).join("")}
              </tr></thead>
              <tbody>
                ${Array.from({length:role.rows}).map(()=>`
                  <tr>
                    <td><input type="checkbox" class="verify"></td>
                    <td><input type="text" placeholder="Name"></td>
                    ${role.cols.map(()=>`
                      <td>
                        <select>
                          <option></option><option>Yes</option><option>Web Only</option>
                          <option>Mobile Only</option><option>No</option>
                          <option>Not Trained</option><option>N/A</option>
                        </select>
                      </td>`).join("")}
                  </tr>`).join("")}
              </tbody>
            </table>
          </div>
        </div>
        <div class="table-footer">
          <button class="add-row" data-target="${role.id}" type="button">+</button>
        </div>
        <div class="section-block comment-box">
          <h2>Additional Comments</h2>
          <textarea placeholder="Type here…"></textarea>
        </div>`;
      section.innerHTML=table;
      container.appendChild(section);
    });
  }

  // === ADD ROW ===
  document.addEventListener("click",(e)=>{
    if(!e.target.classList.contains("add-row"))return;
    const id=e.target.dataset.target;
    const table=document.getElementById(id);
    if(!table)return;
    const first=table.querySelector("tbody tr");
    const clone=first.cloneNode(true);
    clone.querySelectorAll("input").forEach(i=>i.value="");
    clone.querySelectorAll("select").forEach(s=>{s.value="";s.style.background="#f2f2f2";});
    table.querySelector("tbody").appendChild(clone);
  });

  // === SELECT COLOR CODING ===
  document.addEventListener("change",(e)=>{
    if(e.target.tagName!=="SELECT")return;
    const v=e.target.value;
    const colors={
      "Yes":"#c9f7c0",
      "Web Only":"#fff8b3",
      "Mobile Only":"#ffe0b3",
      "No":"#ffb3b3",
      "Not Trained":"#ffb3b3",
      "N/A":"#f2f2f2"
    };
    e.target.style.backgroundColor=colors[v]||"#f2f2f2";
  });

  // === PDF EXPORT ===
  const pdfButton=document.getElementById("pdfButton");
  if(pdfButton){
    pdfButton.addEventListener("click",()=>{
      const active=document.querySelector(".page-section.active");
      import("https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js")
      .then(html2pdf=>{html2pdf.default().from(active).save(`${active.id}.pdf`);});
    });
  }

});
