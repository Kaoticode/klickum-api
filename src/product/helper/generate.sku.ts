export function generateSKU(
  productName: string,
  size: string,
  //color: string,
): string {
  const productCode = productName
    .replace(/\s+/g, '') // Remove spaces
    .substring(0, 3) // Take first 3 letters
    .toUpperCase(); // Capitalize

  //const colorCode = color.substring(0, 3).toUpperCase();
  const sizeCode = size.toUpperCase();

  const randomNumber = Math.floor(Math.random() * 1000);

  //return `${productCode}-${colorCode}-${sizeCode}`;
  return `${productCode}-${sizeCode}-${randomNumber}`;
}
