
// app/components/UploadForm.tsx
'use client'

import { useState } from 'react'
import { processPDF } from '../actions/processPdf'
import PDFContent from './PDFContent'

export default function UploadForm() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    try {
      setLoading(true)
      setError(null)
      const result = await processPDF(formData)
      
      if (result.error) {
        setError(result.error)
      } else {
        setResult(result)
      }
    } catch (error) {
      setError('Failed to process PDF')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <form action={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <input 
            type="file"
            name="pdf"
            accept=".pdf"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 text-white py-2 px-4 rounded-lg
            hover:bg-violet-700 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Upload PDF'}
        </button>

        {error && (
          <div className="text-red-500 text-center p-2">
            {error}
          </div>
        )}

        {result && !error && (
          <PDFContent 
            text={result.text}
            metadata={result.metadata}
            pageCount={result.pageCount}
          />
        )}
      </form>
    </div>
  )
}

// // app/components/UploadForm.tsx
// 'use client'

// import { useState } from 'react'
// import { processPDF } from '../actions/processPdf'

// export default function UploadForm() {
//   const [result, setResult] = useState<any>(null)
//   const [loading, setLoading] = useState(false)

//   async function handleSubmit(formData: FormData) {
//     try {
//       setLoading(true)
//       const result = await processPDF(formData)
//       setResult(result)
//     } catch (error) {
//       console.error('Error:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="max-w-xl mx-auto p-4">
//       <form action={handleSubmit} className="space-y-4">
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
//           <input 
//             type="file"
//             name="pdf"
//             accept=".pdf"
//             className="block w-full text-sm text-gray-500
//               file:mr-4 file:py-2 file:px-4
//               file:rounded-full file:border-0
//               file:text-sm file:font-semibold
//               file:bg-violet-50 file:text-violet-700
//               hover:file:bg-violet-100"
//           />
//         </div>
        
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-violet-600 text-white py-2 px-4 rounded-lg
//             hover:bg-violet-700 disabled:bg-gray-400"
//         >
//           {loading ? 'Processing...' : 'Upload PDF'}
//         </button>

//         {result && (
//           <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//             <h3 className="font-medium mb-2">Results:</h3>
//             <pre className="text-sm whitespace-pre-wrap">
//               {JSON.stringify(result, null, 2)}
//             </pre>
//           </div>
//         )}
//       </form>
//     </div>
//   )
// }