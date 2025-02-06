import toast from "react-hot-toast";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jsonToClipboard = (jsonData: Array<any>) => {
  // Convert JSON to an array of objects (if not already)
  const data = Array.isArray(jsonData) ? jsonData : [jsonData];

  // Extract headers (keys)
  const headers = Object.keys(data[0]);

  // Convert JSON to TSV format (Tab-Separated Values)
  let tsv = headers.join("\t") + "\n"; // Header row
  tsv += data.map(row => headers.map(field => row[field]).join("\t")).join("\n");

  // Copy to clipboard
  navigator.clipboard.writeText(tsv).then(() => {
      toast.success("Copied to clipboard!")
  }).catch(err => {
      toast.error("Failed to copy: ", err);
  });
}

export default jsonToClipboard;