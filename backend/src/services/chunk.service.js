import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

export const createDocumentChunks = async ({ pages, documentId, documentName, userId }) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    separators: ['\n\n', '\n', '. ', ' ', ''],
  });

  const allChunks = [];
  let chunkGlobalIndex = 0;

  for (const page of pages) {
    if (!page.text || page.text.trim().length === 0) continue;

    const pageSplits = await splitter.splitText(page.text);

    for (let i = 0; i < pageSplits.length; i++) {
      const chunkText = pageSplits[i].trim();
      if (!chunkText) continue;

      allChunks.push({
        id: `${documentId}_${chunkGlobalIndex}`,
        chunkIndex: chunkGlobalIndex,
        text: chunkText,
        metadata: {
          userId: userId.toString(),
          documentId: documentId.toString(),
          documentName,
          pageNumber: page.pageNumber,
          chunkIndex: chunkGlobalIndex,
        },
      });

      chunkGlobalIndex++;
    }
  }

  return allChunks;
};
