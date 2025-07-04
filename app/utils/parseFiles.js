export async function extractTextFromPDF(file) {
  const pdfjsLib = await import("pdfjs-dist/build/pdf");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";
  for (let i = 0; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i + 1);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(" ");
    text += pageText + "\n";
  }
  return text;
}

export async function extractTextFromDocx(file) {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

export async function extractText(file) {
  if (file.name.endsWith(".pdf")) {
    return await extractTextFromPDF(file);
  } else if (file.name.endsWith(".docx")) {
    return await extractTextFromDocx(file);
  } else {
    return await file.text();
  }
}

export function computeMatchPercentage(sectionText, jdText) {
  if (!sectionText || !jdText) return 0;
  const sectionWords = new Set(sectionText.toLowerCase().split(/\W+/).filter(w => w));
  const jdWords = new Set(jdText.toLowerCase().split(/\W+/).filter(w => w));

  let overlap = 0;
  sectionWords.forEach(word => {
    if (jdWords.has(word)) overlap++;
  });

  return Math.round((overlap / sectionWords.size) * 100);
}

export function parseResumeSections(text) {
  const sections = {
    contactInformation: text.match(/Name:.+\nEmail:.+\nPhone:.+/i)?.[0] || "",
    summary: (text.match(/Summary([\s\S]*?)(Experience|Education|Skills)/i) || [])[1]?.trim() || "",
    experience: (text.match(/Experience([\s\S]*?)(Education|Skills)/i) || [])[1]?.trim() || "",
    education: (text.match(/Education([\s\S]*?)(Skills|$)/i) || [])[1]?.trim() || "",
    skills: (text.match(/Skills([\s\S]*)/i) || [])[1]?.trim() || "",
  };
  return sections;
}
