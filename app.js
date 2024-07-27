console.log("File Import & Exporter")

if (location.pathname === "/dashboard/files") {
  var table = document.querySelector("tbody");
  var tableRows = table.querySelectorAll("tr");

  function saveFileButtons() {
    tableRows.forEach(async (row) => {
      const fileId = row.querySelector('[data-id]').getAttribute("data-id");
      const dropdown = row.querySelector(".dropdown");
      const dropdownGroup = dropdown.querySelector("div");
  
      const button = document.createElement("button");
      button.textContent = "Save File JSON";
      button.classList = "p-1.5 px-2 hover:bg-foreground/5 transition-all rounded-md flex items-center text-sm capitalize";
  
      button.addEventListener("click", async () => {
        const response = await fetch(`http://82.3.164.159:25565/api/file/${fileId}`);
        const fileData = await response.json();
        console.log(fileData);
      });
      
      dropdownGroup.appendChild(button);
    })
  }

  document.addEventListener("fileSort", () => {
    saveFileButtons();
  })

  saveFileButtons();
}
