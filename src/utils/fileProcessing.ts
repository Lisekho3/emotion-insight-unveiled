
// Utility functions for processing different file types

export interface ProcessedFileData {
  texts: string[];
  fileName: string;
  fileType: string;
}

export async function processCSVFile(file: File): Promise<ProcessedFileData> {
  const content = await file.text();
  const lines = content.split('\n');
  
  // Skip header row and extract text from first column
  const texts = lines
    .slice(1)
    .map(line => {
      // Simple CSV parsing - handles basic cases
      const columns = line.split(',');
      return columns[0]?.replace(/"/g, '').trim();
    })
    .filter(text => text && text.length > 0);

  return {
    texts,
    fileName: file.name,
    fileType: 'CSV'
  };
}

export async function processJSONFile(file: File): Promise<ProcessedFileData> {
  const content = await file.text();
  
  try {
    const data = JSON.parse(content);
    let texts: string[] = [];
    
    // Handle different JSON structures
    if (Array.isArray(data)) {
      // Array of objects or strings
      texts = data.map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null) {
          // Look for common text fields
          return item.text || item.content || item.message || item.review || item.comment || JSON.stringify(item);
        }
        return String(item);
      }).filter(text => text && text.length > 0);
    } else if (typeof data === 'object' && data !== null) {
      // Single object - extract text values
      Object.values(data).forEach(value => {
        if (typeof value === 'string' && value.length > 10) {
          texts.push(value);
        }
      });
    }
    
    return {
      texts,
      fileName: file.name,
      fileType: 'JSON'
    };
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}

export async function processPDFFile(file: File): Promise<ProcessedFileData> {
  // For PDF processing, we'll simulate text extraction
  // In a real implementation, you'd use a library like pdf-parse or pdf2pic
  
  // Simulate PDF text extraction
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock extracted text - in reality this would come from PDF parsing
  const mockTexts = [
    "This is extracted text from page 1 of the PDF document.",
    "Another paragraph of text extracted from the PDF file.",
    "Customer feedback: The product quality is excellent and delivery was fast.",
    "Review comment: Had some issues with the packaging but overall satisfied."
  ];
  
  return {
    texts: mockTexts,
    fileName: file.name,
    fileType: 'PDF'
  };
}

export async function processTextFile(file: File): Promise<ProcessedFileData> {
  const content = await file.text();
  const texts = content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return {
    texts,
    fileName: file.name,
    fileType: 'TXT'
  };
}
