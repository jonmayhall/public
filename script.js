// Navigation
document.querySelectorAll(".nav-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const target=btn.getAttribute("data-target");
    document.querySelectorAll(".page-section").forEach(s=>s.classList.remove("active"));
    document.getElementById(target).classList.add("active");
    window.scrollTo({top:0});
  });
});

const roles=[
  {id:"technicians",title:"Technicians – Checklist",rows:5,cols:["DMS ID","Login","Workflow","Mobile App","Search Bar","Dispatch","RO History","Prev. Declines","OCR","Edit ASR","ShopChat","Adding Media","Status Change","Notifications","Filters"]},
  {id:"advisors",title:"Service Advisors – Checklist",rows:5,cols:["DMS ID","Login","MCI","Workflow","Search Bar","RO Assignment","Prev. Declines","OCR","Edit ASR","ShopChat","Status Change","MPI Send","SOP"]},
  {id:"parts",title:"Parts Reps – Checklist",rows:5,cols:["DMS ID","Login","Web App","Workflow","Search Bar","DMS History","Parts Tab","Edit ASR","ShopChat","Status Change","Filters"]},
];

const container=document.getElementById("tables-container");

roles.forEach(role=>{
  const wrapper=document.createElement("div");
  wrapper.classList.add("section");
  wrapper.innerHTML=`
    <div class="section-header">${role.title}</div>
    <div class="table-wrapper">
      <div class="table-scroll">
        <table id="${role.id}" class="training-table">
          <thead><tr><th>Name</th>${role.cols.map(c=>`<th>${c}</th>`).join("")}</tr></thead>
          <tbody>
            ${Array.from({length:role.rows}).map(()=>`
              <tr>
                <td><input type="text" placeholder="Name"></td>
                ${role.cols.map(()=>`
                  <td><select>
                    <option></option>
                    <option>Yes</option>
                    <option>No</option>
                    <option>Not Trained</option>
                    <option>N/A</option>
                  </select></td>`).join("")}
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="table-footer"><button class="add-row" data-target="${role.id}">+</button></div>
    </div>
    <div class="section-block comment-box">
      <h2>Additional Comments</h2>
      <textarea placeholder="Type here…"></textarea>
    </div>
  `;
  container.appendChild(wrapper);
});

document.addEventListener("click",e=>{
  if(e.target.classList.contains("add-row")){
    const id=e.target.dataset.target;
    const table=document.getElementById(id);
    const first=table.querySelector("tbody tr");
    const clone=first.cloneNode(true);
    clone.querySelectorAll("input").forEach(i=>i.value="");
    clone.querySelectorAll("select").forEach(s=>s.selectedIndex=0);
    table.querySelector("tbody").appendChild(clone);
  }
});
