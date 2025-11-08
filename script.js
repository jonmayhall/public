/* ==========================
   myKaarma – Interactive Training Checklist
   (Stable Build + Auto-Save + Clear All)
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

// === ADD ROW FUNCTIONALITY ===
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
    saveFormState();
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
    html2canvas: { scale: 0.7 }
  });
});

// === AUTO-SAVE & RESTORE ===
const STORAGE_KEY = "myKaarmaTrainingData_v20251107";

function saveFormState() {
  const data = {};
  document.querySelectorAll("input, select, textarea").forEach((el, i) => {
    const key = el.name || `${el.tagName}_${i}`;
    data[key] = el.type === "checkbox" ? el.checked : el.value;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadFormState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    document.querySelectorAll("input, select, textarea").forEach((el, i) => {
      const key = el.name || `${el.tagName}_${i}`;
      if (data[key] !== undefined) {
        if (el.type === "checkbox") el.checked = data[key];
        else el.value = data[key];
      }
    });
  } catch (err) {
    console.warn("Error loading saved form data:", err);
  }
}

["change", "input"].forEach(evt =>
  document.addEventListener(evt, e => {
    if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) saveFormState();
  })
);

document.addEventListener("DOMContentLoaded", loadFormState);

// === CLEAR ALL DATA BUTTON ===
const clearBtn = document.createElement("button");
clearBtn.id = "clearData";
clearBtn.className = "floating-btn clear-btn";
clearBtn.textContent = "Clear All Data";
clearBtn.style.right = "180px"; // sits beside Save as PDF
document.getElementById("training-summary")?.appendChild(clearBtn);

clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all saved data? This cannot be undone.")) {
    localStorage.removeItem(STORAGE_KEY);
    document.querySelectorAll("input, select, textarea").forEach(el => {
      if (el.type === "checkbox") el.checked = false;
      else el.value = "";
    });
    alert("All saved data has been cleared.");
  }
});
