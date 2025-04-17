import React, { useState } from "react";
import { VideoIcon, Newspaper } from "lucide-react";
import MultimediaContent from "./MultimediaContent";
import ToolsContent from "./ToolsContent";

const Accessibility = ({setSidebar}) => {
  const [activeTab, setActiveTab] = useState("tools");
  setSidebar(true)

  return (
    <div className="min-h-screen bg-navy-blue flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-6xl flex-grow">
        <div className="mb-8">
          <h1
            className={`text-3xl md:text-4xl font-bold text-center mb-4 text-[#9b87f5]`
            }
          >
            {activeTab === "multimedia" ? "Multimedia" : "Accessibility Tools"}
          </h1>
          <p className="text-center text-gray-300 max-w-2xl mx-auto">
            {activeTab === "multimedia"
              ? "Explore podcasts, articles, and news with enhanced accessibility features"
              : "Discover innovative tools designed to enhance digital accessibility"}
          </p>
        </div>

        {/* Custom Tab Buttons */}
        <div className="w-full max-w-4xl mx-auto mb-10 grid grid-cols-2 rounded-md bg-white/10 border border-white/20 overflow-hidden">
          <button
            onClick={() => setActiveTab("tools")}
            className={`flex items-center justify-center gap-2 px-4 py-3 text-white transition-colors ${
              activeTab === "tools" ? "bg-[#7E69AB]" : "hover:bg-white/5"
            }`}
          >
            <Newspaper size={18} />
            Tools
          </button>
          <button
            onClick={() => setActiveTab("multimedia")}
            className={`flex items-center justify-center gap-2 px-4 py-3 text-white transition-colors ${
              activeTab === "multimedia" ? "bg-[#7E69AB]" : "hover:bg-white/5"
            }`}
          >
            <VideoIcon size={18} />
            Multimedia
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "multimedia" && <MultimediaContent />}
          {activeTab === "tools" && <ToolsContent />}
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
