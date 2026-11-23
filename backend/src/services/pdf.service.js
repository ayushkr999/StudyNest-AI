import fs from 'fs';
import pdfParse from 'pdf-parse';
import { ApiError } from '../middleware/error.middleware.js';

export const extractPdfData = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new ApiError(404, 'PDF file not found on disk.');
  }

  const dataBuffer = fs.readFileSync(filePath);

  // Validate not empty
  if (dataBuffer.length === 0) {
    throw new ApiError(400, 'Uploaded PDF file is empty.');
  }

  try {
    const pages = [];
    const pageCollector = (pageData) => {
      const text = pageData.getTextContent();
      return text.then((textContent) => {
        let lastY, text = '';
        for (let item of textContent.items) {
          if (lastY == item.transform[5] || !lastY) {
            text += item.str;
          } else {
            text += '\n' + item.str;
          }
          lastY = item.transform[5];
        }
        pages.push({
          pageNumber: pageData.pageIndex + 1,
          text: text.trim(),
        });
        return text;
      });
    };

    const parsed = await pdfParse(dataBuffer, {
      pagerender: pageCollector,
    });

    // Fallback if pagerender yielded no items but parsed.text exists
    if (pages.length === 0 && parsed.text) {
      pages.push({
        pageNumber: 1,
        text: parsed.text.trim(),
      });
    }

    if (!parsed.text || parsed.text.trim().length === 0) {
      throw new ApiError(400, 'Could not extract text from this PDF. It may be scanned or image-only.');
    }

    return {
      totalPages: parsed.numpages || pages.length,
      info: parsed.info || {},
      pages,
      fullText: parsed.text,
    };
  } catch (err) {
    console.error('[PDF Parser Error]:', err.message);
    throw new ApiError(400, `Failed to parse PDF document: ${err.message}`);
  }
};
