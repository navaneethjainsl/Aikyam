import React, { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Headphones,
  Languages,
  Mic,
  Upload,
  Copy,
  Printer
} from "lucide-react";
import { toast } from "sonner";

import OCRModal from "./modals/OCRModal";
import TextToSpeechModal from "./modals/TextToSpeechModal";
import SpeechToTextModal from "./modals/SpeechToTextModal";
import InteractiveLearningModal from "./modals/InteractiveLearningModal";
import BrailleModal from "./modals/BrailleModal";
// import TranslateModal from "./modals/TranslateModal";

const tools = [
  {
    id: 1,
    title: "OCR Technology",
    description: "Extract text from images and documents effortlessly",
    icon: FileText
  },
  {
    id: 2,
    title: "Text to Speech",
    description: "Convert written text to spoken words",
    icon: Headphones
  },
  {
    id: 3,
    title: "Speech to Text",
    description: "Convert spoken words to written text instantly",
    icon: Mic
  },
  {
    id: 4,
    title: "Interactive Learning",
    description: "Access educational resources with interactive features",
    icon: BookOpen
  },
  {
    id: 5,
    title: "Braille Converter",
    description: "Convert text to Braille code for accessibility",
    icon: FileText
  },
  // {
  //   id: 6,
  //   title: "Language Translator",
  //   description: "Translate text between different languages",
  //   icon: Languages
  // }
];

const ToolCard = ({ title, description, icon: Icon, onClick }) => (
  <div
    onClick={onClick}
    className="p-6 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 shadow-sm hover:bg-white/15 cursor-pointer"
  >
    <div className="h-12 w-12 bg-[#7E69AB]/25 flex items-center justify-center rounded-lg mb-4">
      <Icon className="h-6 w-6 text-[#9b87f5]" />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-300 mb-4">{description}</p>
    <button className="inline-flex items-center text-[#9b87f5] hover:text-[#7E69AB]" onClick={onClick}>
      <span>Explore</span>
      <ArrowRight className="ml-1 h-4 w-4" />
    </button>
  </div>
);

const SharedTextArea = ({ text, onTextChange, onFileUpload }) => {
  const handleCopyText = () => {
    if (!text) {
      toast.error("No text to copy");
      return;
    }

    navigator.clipboard.writeText(text)
      .then(() => toast.success("Text copied to clipboard"))
      .catch(() => toast.error("Failed to copy text"));
  };

  const handlePrintText = () => {
    if (!text) {
      toast.error("No text to print");
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Popup blocked. Please allow popups for this site.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Aikyam</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              line-height: 1.6;
            }
            h1 {
              text-align: center;
              margin-bottom: 30px;
              color: #333;
            }
            .content {
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>
          <h1>Aikyam</h1>
          <div class="content">${text.replace(/\n/g, "<br>")}</div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);

    toast.success("Print dialog opened");
  };

  return (
    <div className="p-6 my-6 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 shadow-sm hover:bg-white/15 cursor-pointer">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-white" />
            <h3 className="text-white font-medium">Shared Workspace</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyText}
              className="flex items-center px-3 py-1.5 bg-[#7E69AB] rounded hover:bg-[#6E59A5] text-white text-sm"
            >
              <Copy className="h-4 w-4 text-white mr-2" />
              Copy
            </button>

            <button
              onClick={handlePrintText}
              className="flex items-center px-3 py-1.5 bg-[#7E69AB] rounded hover:bg-[#6E59A5] text-white text-sm"
            >
              <Printer className="h-4 w-4 text-white mr-2" />
              Print
            </button>

            <label className="flex items-center px-3 py-1.5 bg-[#7E69AB] rounded hover:bg-[#6E59A5] cursor-pointer text-white text-sm">
              <Upload className="h-4 w-4 text-white mr-2" />
              <span>Upload</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onFileUpload(file);
                }}
                accept="image/*"
              />
            </label>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          className="w-full h-32 p-4 bg-white/5 rounded-lg border border-white/10 text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#7E69AB]"
          placeholder="Your text will appear here..."
        />
      </div>
    </div>
  );
};

const ToolsContent = () => {
  const [sharedText, setSharedText] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {tools.map(tool => (
          <ToolCard
            key={tool.id}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            onClick={() => setActiveModal(tool.id)}
          />
        ))}
      </div>

      {activeModal === 1 && (
        <OCRModal
          onClose={() => setActiveModal(null)}
          setSharedText={setSharedText}
        />
      )}
      {activeModal === 2 && (
        <TextToSpeechModal
          onClose={() => setActiveModal(null)}
          sharedText={sharedText}
        />
      )}
      {activeModal === 3 && (
        <SpeechToTextModal
          onClose={() => setActiveModal(null)}
          setSharedText={setSharedText}
        />
      )}
      {activeModal === 4 && (
        <InteractiveLearningModal
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 5 && (
        <BrailleModal
          onClose={() => setActiveModal(null)}
          text={sharedText}
          onCopyToBraille={setSharedText}
        />
      )}
      {/* {activeModal === 6 && (
        <TranslateModal
          onClose={() => setActiveModal(null)}
          text={sharedText}
          onCopyToShared={setSharedText}
        />
      )} */}

      <SharedTextArea
        text={sharedText}
        onTextChange={setSharedText}
        onFileUpload={setUploadedFile}
      />
    </div>
  );
};

export default ToolsContent;
