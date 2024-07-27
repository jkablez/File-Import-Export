fileDropdownLinks([
  {
    label: "Export as JSON",
    button: true,
    dataId: "export-as-json",
  }
])

document.querySelector(".content").addEventListener('filesLinksInit', (event) => {
  console.log('filesLinksInit event triggered', event.detail);
});