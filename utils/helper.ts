export const formatSize = (size: number): string => {
  if (size >= 1e9) {
    return (size / 1e9).toFixed(2) + ' GB';
  } else if (size >= 1e6) {
    return (size / 1e6).toFixed(2) + ' MB';
  } else if (size >= 1e3) {
    return (size / 1e3).toFixed(2) + ' KB';
  } else {
    return size + ' B';
  }
}