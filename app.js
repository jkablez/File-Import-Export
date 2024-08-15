this.sideBarEdit("File Import & Export", [{
    label: "Import JSON",
    button: true,
    id: "import-file-json",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 -mt-[1px]"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"/><path d="M8 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"/></svg>`,
  }]);
  
fileDropdownLinks([
    {
      label: "Export as JSON",
      button: true,
      dataId: "export-as-json",
      multi: false,
      onclick: exportAsJSON
    }
]);

async function exportAsJSON(file) {
    if (file.id) {
        const response = await fetch(`/api/file/${file.id}`);
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
}
  
document.querySelector('#import-file-json').addEventListener("click", () => {
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.style.display = "none";
document.body.appendChild(fileInput);

fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                var json = JSON.parse(e.target.result);
            }
            catch {
                var json = false;
            }

            function convertKeysToUpperCase(obj) {
                if (typeof obj !== 'object' || obj === null) {
                return obj;
                }
            
                if (Array.isArray(obj)) {
                return obj.map(convertKeysToUpperCase);
                }
            
                return Object.keys(obj).reduce((acc, key) => {
                let newKey;
                if (key === 'uploaded_size') {
                    newKey = 'UploadedSize';
                } else if (key === 'url' || key === 'size') {
                    newKey = key;
                } else {
                    newKey = key.charAt(0).toUpperCase() + key.slice(1);
                }
                acc[newKey] = convertKeysToUpperCase(obj[key]);
                return acc;
                }, {});
            }

            if (json) {
                json = convertKeysToUpperCase(json);
                json.Timestamp = null;
                json.UserId = null;
                json.GlobalExpiry = 0;
                showAlert(`Importing '${json.Filename}'`, "success");
                const response = await fetch(`/api/create/files`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(json)
                })

                var data = await response.json();

                if (response.status === 200) {
                showAlert(`Imported '${json.Filename}'`, "success");
                pushPath("/dashboard/files");
                }
                else {
                showAlert(data.error || "Unknown Error", "error");
                }
            }
            else {
                showAlert("JSON is not valid!", "error");
            }
        };
        reader.readAsText(file);
    }
});

fileInput.click();
});
