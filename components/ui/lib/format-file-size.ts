export function formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1000 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    // Round to at most 2 decimal places and ensure no more than 3 digits
    let formattedSize = size.toString();
    if (size >= 100) {
        formattedSize = Math.round(size).toString();
    } else if (size >= 10) {
        formattedSize = size.toFixed(1);
    } else {
        formattedSize = size.toFixed(2);
    }

    return `${formattedSize} ${units[unitIndex]}`;
} 