async function testImports() {
  try {
    const html2canvasModule = await import('html2canvas');
    console.log('html2canvas keys:', Object.keys(html2canvasModule));
    console.log('html2canvas default:', typeof html2canvasModule.default);

    const jspdfModule = await import('jspdf');
    console.log('jspdf keys:', Object.keys(jspdfModule));
    console.log('jspdf.jsPDF:', typeof jspdfModule.jsPDF);
    console.log('jspdf.default:', typeof jspdfModule.default);
  } catch (err) {
    console.error('Error during import:', err);
  }
}

testImports();
