// app/actions/processPdf.ts
'use server'

// import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist'
// import { getDocument, PDFDocumentProxy } from 'pdfjs-dist'
import { PDFDocument } from 'pdf-lib'
import PDFParser from 'pdf2json'


// Define return type for the PDF processing
interface ProcessPDFResult {
  text: string;
  pageCount: number;
  metadata: {
    title?: string;
    author?: string;
    creator?: string;
    producer?: string;
    fileSize?: string;
  };
  error?: string;
}

interface PDFParserOptions {
  skipImages?: boolean;
  skipFonts?: boolean;
  skipBackground?: boolean;
  maxContentLength?: number;
}

export async function processPDF(formData: FormData): Promise<ProcessPDFResult> {
  try {
    const file = formData.get('pdf') as File
    if (!file) {
      return {
        text: '',
        pageCount: 0,
        metadata: {},
        error: 'No file provided'
      }
    }

    // Check file size (3MB limit)
    const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      return {
        text: '',
        pageCount: 0,
        metadata: {},
        error: `File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`
      }
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Get metadata using pdf-lib
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const title = await pdfDoc.getTitle()
    const author = await pdfDoc.getAuthor()
    const creator = await pdfDoc.getCreator()
    const producer = await pdfDoc.getProducer()
    const pageCount = pdfDoc.getPageCount()

    // Configure PDF parser with optimizations
    const parserOptions: PDFParserOptions = {
      skipImages: true,        // Skip image processing
      skipFonts: true,         // Skip font processing
      skipBackground: true,    // Skip background elements
      maxContentLength: MAX_FILE_SIZE
    }

    const pdfParser = new PDFParser(null, true); // parserOptions);

    const pdfText = await new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        try {
          // Process text in chunks to handle large files
          const text = pdfData.Pages.map(page => {
            return page.Texts
              .filter(text => text.R && text.R.length > 0) // Filter out empty text elements
              .map(text => {
                try {
                  return decodeURIComponent(text.R.map(r => r.T).join(' '))
                } catch (e) {
                  // Handle malformed URI encoding
                  return text.R.map(r => r.T).join(' ')
                }
              })
              .join(' ')
          }).join('\n\nPage Break\n\n')
          
          resolve(text)
        } catch (e) {
          reject(e)
        }
      })

      pdfParser.on("pdfParser_dataError", (errData) => {
        reject(errData)
      })

      // Add timeout handling
      const PARSER_TIMEOUT = 30000 // 30 seconds
      const timeoutId = setTimeout(() => {
        reject(new Error('PDF parsing timeout'))
      }, PARSER_TIMEOUT)

      pdfParser.on("pdfParser_dataReady", () => {
        clearTimeout(timeoutId)
      })

      try {
        pdfParser.parseBuffer(buffer)
      } catch (e) {
        clearTimeout(timeoutId)
        reject(e)
      }
    })

    return {
      text: pdfText,
      pageCount,
      metadata: {
        title: title || undefined,
        author: author || undefined,
        creator: creator || undefined,
        producer: producer || undefined,
        fileSize: formatFileSize(arrayBuffer.byteLength)
      }
    }

  } catch (error) {
    console.error('PDF processing error:', error)
    return {
      text: '',
      pageCount: 0,
      metadata: {},
      error: 'Failed to process PDF'
    }
  }
}

export async function processPDF2(formData: FormData): Promise<ProcessPDFResult> {
  try {
    const file = formData.get('pdf') as File
    if (!file) {
      return {
        text: '',
        pageCount: 0,
        metadata: {},
        error: 'No file provided'
      }
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Get metadata using pdf-lib (this part is working)
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const title = await pdfDoc.getTitle()
    const author = await pdfDoc.getAuthor()
    const creator = await pdfDoc.getCreator()
    const producer = await pdfDoc.getProducer()
    const pageCount = pdfDoc.getPageCount()

    // Extract text using pdf2json
    const pdfParser = new PDFParser(null, true);

    const pdfText = await new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        try {
          const text = pdfData.Pages.map(page => {
            return page.Texts.map(text => 
              decodeURIComponent(text.R.map(r => r.T).join(' '))
            ).join(' ')
          }).join('\n\nPage Break\n\n')
          
          resolve(text)
        } catch (e) {
          reject(e)
        }
      })

      pdfParser.on("pdfParser_dataError", (errData) => {
        reject(errData)
      })

      pdfParser.parseBuffer(buffer)
    })

    return {
      text: pdfText,
      pageCount,
      metadata: {
        title: title || undefined,
        author: author || undefined,
        creator: creator || undefined,
        producer: producer || undefined,
        fileSize: formatFileSize(arrayBuffer.byteLength)
      }
    }

  } catch (error) {
    console.error('PDF processing error:', error)
    return {
      text: '',
      pageCount: 0,
      metadata: {},
      error: 'Failed to process PDF'
    }
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}


export async function processPDF1(formData: FormData): Promise<ProcessPDFResult> {
  console.log('Server action started: processPDF')
  console.log('Current timestamp:', new Date().toISOString())
  
  try {
    const file = formData.get('pdf') as File
    if (!file) {
      return {
        text: '',
        pageCount: 0,
        metadata: {},
        error: 'No file provided'
      }
    }
    
    // Log file details
    console.log('Processing file:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Convert File to ArrayBuffer
    const buffer = await file.arrayBuffer()
        
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(buffer)
    console.log('PDF document loaded successfully')
    
    // Get basic metadata
    const pageCount = pdfDoc.getPageCount()
    const title = await pdfDoc.getTitle()
    const author = await pdfDoc.getAuthor()
    const creator = await pdfDoc.getCreator()
    const producer = await pdfDoc.getProducer()

     // Log extracted metadata
     console.log('Extracted metadata:', {
      pageCount,
      title,
      author,
      creator,
      producer
    })
    console.log('processPDF data: ', title, ' , ', pageCount, ' , ',author, ' , ', creator);

    // For this example, we're returning basic metadata
    // Note: Getting text content requires additional libraries 
    // like pdf-parse or pdfjs-dist for more complete text extraction
    
    return {
      text: 'Text extraction requires additional setup with pdf-parse or pdfjs-dist',
      pageCount,
      metadata: {
        title: title || undefined,
        author: author || undefined,
        creator: creator || undefined,
        producer: producer || undefined
      }
    }
  } catch (error) {
    console.error('Error processing PDF:', error)
    return {
      text: '',
      pageCount: 0,
      metadata: {},
      error: 'Failed to process PDF'
    }
  } finally {
    console.log('Server action completed: processPDF')
  }

}