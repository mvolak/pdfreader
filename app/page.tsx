import Image from "next/image";
import UploadForm from "./components/uploadForm";

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        PDF Processor
      </h1>
      <UploadForm />
    </main>
  );
}
