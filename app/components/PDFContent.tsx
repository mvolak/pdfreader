// app/components/PDFContent.tsx
interface PDFContentProps {
    text: string;
    metadata: {
      title?: string;
      author?: string;
      creator?: string;
      producer?: string;
      fileSize?: string;
    };
    pageCount: number;
  }
  
  export default function PDFContent({ text, metadata, pageCount }: PDFContentProps) {
    return (
      <div className="mt-6 space-y-4">
        {/* Metadata Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Document Info</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Title</div>
            <div>{metadata.title || 'Not available'}</div>
            <div>Author</div>
            <div>{metadata.author || 'Not available'}</div>
            <div>Pages</div>
            <div>{pageCount}</div>
            <div>File Size</div>
            <div>{metadata.fileSize}</div>
          </div>
        </div>
  
        {/* Content Section */}
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Document Content</h3>
          <div className="max-h-96 overflow-y-auto">
            {text.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="mb-2 text-sm">
                  {paragraph}
                </p>
              )
            ))}
          </div>
        </div>
      </div>
    )
  }