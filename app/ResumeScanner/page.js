"use client"
import React, { useState } from "react";
import { extractText, parseResumeSections, computeMatchPercentage } from '../utils/parseFiles.js';


export default function ResumeScanner() {
  const [jdKeywords, setJdKeywords] = useState(null);
  const [file, setFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [matchResults, setMatchResults] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setParsedData(null);
      setMatchResults(null);
    }
  };

  const handleJdFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setJdFile(selectedFile);
      setMatchResults(null);
    }
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

  const handleComment = (section) => {
    alert(`Comment on "${section}" clicked! (Replace with your own logic)`);
  };

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
  
    const resumeText = await extractText(file);
    const parsedSections = parseResumeSections(resumeText);
  
    setParsedData(parsedSections);
    setProcessing(false);
  };
  
  const handleJdKeywordsUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
  
    const text = await selectedFile.text();
    try {
      const json = JSON.parse(text);
      setJdKeywords(json);
    } catch (err) {
      alert("Invalid JSON file");
    }
  };

  const handleMatch = async () => {
  if (!file || !jdFile) {
    alert("Upload both files first.");
    return;
  }

  setProcessing(true);

  const resumeText = await extractText(file);
  const jdText = await extractText(jdFile);

  // Split JD into sentences for comparison
  const jdSentences = jdText.split(/[.\n]+/).map(s => s.trim()).filter(Boolean);

  try {
    const response = await fetch("http://api.leonardonigro.com/combine-match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume: resumeText,
        jobSentences: jdSentences
      })
    });

    if (!response.ok) {
      throw new Error("Error from server");
    }

    const result = await response.json();
    setMatchResults(result);
  } catch (err) {
    console.error(err);
    alert("Error processing match");
  } finally {
    setProcessing(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex items-center justify-center p-6">
      <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-3xl w-full border border-white/10 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

        <h1 className="text-3xl font-bold text-white mb-4">Resume Scanner</h1>
        <p className="text-gray-300 mb-6">Upload your resume, process it, and compare to a job description.</p>

        {/* Resume Upload */}
        <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/50 transition-colors duration-300 mb-4">
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
                <span className="text-white/70">Upload Resume</span>
              </>
            )}
          </label>
        </div>

        {file && (
          <div className="space-y-4 mb-6">
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
                Download Original Resume
              </button>
            )}
          </div>
        )}

        {/* Job Description Upload Loose*/}
        <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/50 transition-colors duration-300 mb-6">
          <input
            id="jdUpload"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleJdFileChange}
            className="hidden"
          />
          <label htmlFor="jdUpload" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
            {jdFile ? (
              <>
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white">{jdFile.name}</span>
              </>
            ) : (
              <>
                <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4h10v12m-5 4v-4m0 0H8m4 0h4" />
                </svg>
                <span className="text-white/70">Upload Job Description</span>
              </>
            )}
          </label>
              </div>
              <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/50 transition-colors duration-300 mb-6">
        <input
          id="jdKeywordsUpload"
          type="file"
          accept=".json"
          onChange={handleJdKeywordsUpload}
          className="hidden"
        />
        <label htmlFor="jdKeywordsUpload" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
          <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4h10v12m-5 4v-4m0 0H8m4 0h4" />
          </svg>
          <span className="text-white/70">Upload JD Keywords JSON</span>
        </label>
      </div>

        {parsedData && (
          <button
            onClick={handleMatch}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg transition-colors duration-300 mb-6"
          >
            Compare to Job Description
          </button>
        )}

        {/* Parsed Resume with Match Results */}
        {matchResults && (
          <div className="bg-black/30 rounded-xl p-4 space-y-4 mt-6">
            <h2 className="text-xl text-white font-semibold mb-2">Matching Results</h2>
            {matchResults.map((item, idx) => (
              <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h3 className="text-white font-medium">Job Requirement:</h3>
                <p className="text-gray-300 mb-2">{item.jobSentence}</p>
                <h3 className="text-white font-medium">Best Matching Resume Sentence:</h3>
                <p className="text-gray-300 mb-2">{item.bestMatchSentence}</p>
                <span className="text-sm bg-green-600 text-white px-2 py-1 rounded">
                  {item.similarityPercent}% similarity
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
