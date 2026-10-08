/** Triggers a browser download for a Blob, then releases the temporary object URL. */
export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke after the click has been processed so the download is not cancelled.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
