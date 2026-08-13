import fs from "fs";
import pdfParse from "pdf-parse";

class PdfService {
  async extractText(filePath) {
    const buffer = fs.readFileSync(filePath);

    const data = await pdfParse(buffer);

    return data.text;
  }
}

export default new PdfService();