import toast from "react-hot-toast";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jsonToClipboard = (jsonData: Array<any>) => {
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    toast.error("No data to copy!");
    return;
  }

  // Extract headers (keys)
  const headers = Object.keys(jsonData[0]);

  if (headers.length === 0) {
    toast.error("Invalid data format!");
    return;
  }

  // Convert JSON to TSV format (Tab-Separated Values)
  let tsv = headers.join("\t") + "\n"; // Header row
  tsv += jsonData.map(row => headers.map(field => row[field] ?? "").join("\t")).join("\n");

  // Copy to clipboard
  navigator.clipboard.writeText(tsv).then(() => {
    toast.success("Copied to clipboard!");
  }).catch(err => {
    toast.error("Failed to copy: " + err.message);
  });
}

export default jsonToClipboard;
