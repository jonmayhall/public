<script>
// === PAGE NAVIGATION ===
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    // Remove active class from all buttons
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Hide all sections
    document.querySelectorAll(".page-section").forEach(sec => sec.classList.remove("active"));

    // Show the target section
    const target = btn.getAttribute("data-target");
    const section = document.getElementById(target);
    if (section) section.classList.add("active");
  });
});

// === ADD ROW BUTTONS ===
document.querySelectorAll(".add-row").forEach(button => {
  button.addEventListener("click", () => {
    const targetTable = button.dataset.target
      ? document.getElementById(button.dataset.target)
      : button.closest("table");
    if (!targetTable) return;

    const tbody = targetTable.querySelector("tbody");
    if (!tbody || !tbody.rows.length) return;

    const newRow = tbody.rows[0].cloneNode(true);

    // Clear cloned row inputs/selects
    newRow.querySelectorAll("input, select").forEach(el => {
      if (el.type === "checkbox") el.checked = false;
      else el.value = "";
    });

    tbody.appendChild(newRow);
  });
});
</script>
