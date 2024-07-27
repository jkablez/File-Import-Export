fileDropdownLinks([
  {
    label: "Export as JSON",
    button: true,
    dataId: "export-as-json",
  }
])

document.querySelector(".content").addEventListener('filesLinksInit', () => {
  try {
    var table = document.querySelector("tbody");
    var tableRows = table.querySelectorAll("tr");

    tableRows.forEach((row) => {
      try {
        if (row) {   
          const exportButton = row.querySelector('[data-id="export-as-json"]');
          exportButton.addEventListener("click", async () => {
            const fileId = row.getAttribute("data-id") || false;
            if (fileId) {
              const response = await fetch(`/api/file/${fileId}`);
              const fileData = await response.json();
    
              const jsonString = JSON.stringify(fileData, null, 4);
              const blob = new Blob([jsonString], { type: "application/json" });
    
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = fileData.Filename.replace(/\.[^/.]+$/, ".json");
    
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
    
              URL.revokeObjectURL(url);
    
              showAlert(`Downloaded '${fileData.Filename}' as a raw JSON file`, "success");
  
              return;
            }
          })
        }
      }
      catch { };
    })
  }
  catch { };
});