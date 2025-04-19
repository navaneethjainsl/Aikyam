import React, { useState } from "react";
import { FileText, X, Loader2, Copy } from "lucide-react";
import Tesseract from "tesseract.js";
import { toast } from "sonner";

const OCRModal = ({ onClose, setSharedText }) => {
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setImageSrc(URL.createObjectURL(f));
    }
  };

  const extractText = () => {
    if (!file) return toast.error("Upload an image first");
    setLoading(true);
    toast.info("Processing...");
    Tesseract.recognize(file, 'eng', { logger: m => console.log(m) })
      .then(({ data: { text } }) => {
        setText(text);
        setLoading(false);
        toast.success("Text extracted");
      })
      .catch(() => {
        setLoading(false);
        toast.error("Failed OCR");
      });
  };

  const copyToSharedWorkspace = () => {
    if (text && setSharedText) {
      setSharedText(text);
      toast.success("Copied to shared workspace");
    } else {
      toast.error("No text to copy");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1F2C] text-white p-6 rounded-lg w-full max-w-4xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full">
          <X className="h-5 w-5" />
        </button>
        
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <h2 className="text-xl font-bold">OCR Technology</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <p className="text-gray-300">Upload an image to extract text</p>
            <input type="file" accept="image/*" onChange={handleFile} className="w-full p-2 bg-white/5 rounded" />
            <button
              onClick={extractText}
              className="flex items-center px-4 py-2 bg-[#7E69AB] rounded hover:bg-[#6E59A5] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Extract Text"}
            </button>
            {imageSrc && <img src={imageSrc} alt="upload" className="max-h-64 object-contain" />}
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-300">Extracted text:</p>
            <div className="bg-white/10 p-4 rounded text-gray-300 whitespace-pre-wrap h-64 overflow-auto">
              {text || "Text will appear here after extraction..."}
            </div>
            <button
              onClick={copyToSharedWorkspace}
              disabled={!text}
              className="flex items-center px-4 py-2 bg-[#7E69AB] rounded hover:bg-[#6E59A5] disabled:opacity-50"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy to Shared Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OCRModal;
