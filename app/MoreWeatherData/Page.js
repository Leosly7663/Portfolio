"use client";
import React, { useState } from "react";

export default function ResumeScanner() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleProcess = () => {
    if (!file) return;
    setProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      setProcessing(false);
    }, 2000);
  };

  const handleDownload = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex items-center justify-center p-6">
      <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-2xl w-full border border-white/10 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
        <h1 className="text-3xl font-bold text-white mb-4">Resume Scanner</h1>
        <p className="text-gray-300 mb-6">Upload your resume to process and re-download it.</p>

        <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/50 transition-colors duration-300">
          <input
            id="fileUpload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
            {file ? (
              <>
                <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white">{file.name}</span>
              </>
            ) : (
              <>
                <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4h10v12m-5 4v-4m0 0H8m4 0h4" />
                </svg>
                <span className="text-white/70">Drag & drop or click to upload</span>
              </>
            )}
          </label>
        </div>

        {file && (
          <div className="mt-6 space-y-4">
            <button
              onClick={handleProcess}
              disabled={processing}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50"
            >
              {processing ? "Processing..." : "Process Resume"}
            </button>

            {processing && (
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-green-400 to-green-600 h-full animate-pulse w-full"></div>
              </div>
            )}

            {!processing && (
              <button
                onClick={handleDownload}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Download Resume
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
