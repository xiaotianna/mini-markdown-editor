import html2pdf from "html2pdf.js";

export const exportPdf = (element: HTMLElement, filename: string) => {
  return new Promise((resolve) => {
    const options = {
      margin: 10,
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: 2100,
        windowHeight: 2970,
        includeShadowDom: true,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(options).save();
    resolve({});
  });
};
