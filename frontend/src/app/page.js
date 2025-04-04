import Image from "next/image";
import Navbar from "@/components/Navbar";
import Cards from "@/components/Cards";
import FileUploadForm from "@/components/FileUploadForm";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-gray-50"> {/* Fondo gris claro */}
        <Navbar />
        <main className="container mx-auto p-4">
          <Cards />
          <FileUploadForm />
        </main>
      </div>
    </>
  );
}
