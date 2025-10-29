window.addEventListener("DOMContentLoaded", () => {

  /* Sidebar nav */
  const nav=document.getElementById("sidebar-nav");
  const sections=document.querySelectorAll(".page-section");
  nav.addEventListener("click",e=>{
    const btn=e.target.closest(".nav-btn"); if(!btn) return;
    const target=btn.dataset.target,section=document.getElementById(target);
    if(!section) return;
    document.querySelector(".page-section.active")?.classList.remove("active");
    section.classList.add("active");
    nav.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    window.scrollTo({top:0,behavior:"smooth"});
  });

  /* Auto-generate training tables */
  const roles=[
    {id:"technicians",title:"Technicians – Checklist",rows:3,cols:["DMS ID","Login","Workflow","Mobile App","Search Bar","RO Assign","Dispatch","RO History","Prev. Declines","OCR","Edit ASR","ShopChat","Adding Media","Status","Notifications","Filters"]},
    {id:"advisors",title:"Service Advisors – Checklist",rows:3,cols:["DMS ID","Login","Mobile App","MCI","Workflow","Search","RO Assign","DMS History","Prev. Declines","OCR","Edit ASR","ShopChat","Status","MPI Send","SOP"]},
    {id:"parts",title:"Parts Reps – Checklist",rows:2,cols:["DMS ID","Login","Web App","Workflow","Search","Take Function","DMS History","Prev. Declines","Parts Tab","SOP","Edit ASR","ShopChat","Status","Notifications","Filters"]},
    {id:"bdc",title:"BDC Reps – Checklist",rows:2,cols:["DMS ID","Login","Scheduler","Declined Services","ServiceConnect","Call Routing"]},
    {id:"pickup",title:"Pick Up & Delivery Drivers – Checklist",rows:2,cols:["DMS ID","Login","PU&D","Notifications"]}
  ];

  const container=document.getElementById("tables-container");
  roles.forEach(role=>{
    const div=document.createElement("div");div.classList.add("section");
    div.innerHTML=`
      <div class="section-header">${role.title}</div>
      <div class="table-container">
        <div class="scroll-wrapper">
          <table id="${role.id}" class="training-table draggable-table">
            <thead><tr><th style="width:260px;">Name</th>${role.cols.map(c=>`<th>${c}</th>`).join("")}</tr></thead>
            <tbody>${Array.from({length:role.rows}).map(()=>`
              <tr><td><input type="text" placeholder="Name"></td>
              ${role.cols.map(()=>`<td><select><option></option><option>Yes</option><option>No</option><option>N/A</option></select></td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
      <div class="table-footer"><button class="add-row" data-target="${role.id}">+</button></div>
      <div class="section-block"><h2>Additional Comments</h2><textarea></textarea></div>`;
    container.appendChild(div);
  });

  /* Add-row */
  document.addEventListener("click",e=>{
    if(!e.target.classList.contains("add-row"))return;
    const id=e.target.dataset.target,table=document.getElementById(id);
    const clone=table.querySelector("tbody tr").cloneNode(true);
    clone.querySelectorAll("input").forEach(i=>i.value="");
    clone.querySelectorAll("select").forEach(s=>{s.selectedIndex=0;s.style.background="#f2f2f2"});
    table.querySelector("tbody").appendChild(clone);
    if(id==="mpi-opcodes")updateRowNumbers();
  });

  /* Color-code selects */
  document.addEventListener("change",e=>{
    if(e.target.tagName!=="SELECT")return;
    const colors={Yes:"#c9f7c0",No:"#ffb3b3","N/A":"#f2f2f2"};
    e.target.style.background=colors[e.target.value]||"#f2f2f2";
  });

  /* Auto expand textareas */
  document.addEventListener("input",e=>{
    if(e.target.tagName==="TEXTAREA"){e.target.style.height="auto";e.target.style.height=e.target.scrollHeight+"px";}
  });

  /* SortableJS for drag/drop */
  const script=document.createElement("script");
  script.src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js";
  document.head.appendChild(script);
  script.onload=()=>{
    document.querySelectorAll(".draggable-table tbody").forEach(tbody=>{
      const table=tbody.closest("table");
      new Sortable(tbody,{
        animation:150,ghostClass:"dragging",
        onEnd:()=>{if(table.id==="mpi-opcodes")updateRowNumbers();}
      });
    });
  };

  /* MPI order reset + numbering */
  const reset=document.getElementById("resetMpiOrder");
  if(reset)reset.addEventListener("click",()=>updateRowNumbers());
  function updateRowNumbers(){
    const mpi=document.getElementById("mpi-opcodes");if(!mpi)return;
    mpi.querySelectorAll("tbody tr").forEach((r,i)=>r.querySelector(".row-number").textContent=i+1);
  }

  /* PDF export */
  const pdfButton=document.getElementById("pdfButton");
  if(pdfButton)pdfButton.addEventListener("click",()=>{
    const active=document.querySelector(".page-section.active");
    import("https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js")
      .then(m=>m.default().from(active).save(`${active.id}.pdf`));
  });
});

