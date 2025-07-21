"use client"
import React, { useState } from "react";
import { extractText } from "../utils/parseFiles.js";

export default function ResumeScanner() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [processing, setProcessing] = useState(false);
  const [matchResults, setMatchResults] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
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

  const getGradientColor = (percent) => {
      const r = percent < 50 ? 255 : Math.floor(255 - (percent - 50) * 5.1);
      const g = percent > 50 ? 255 : Math.floor(percent * 5.1);
      return `rgb(${r}, ${g}, 0)`;
  };

  const handleDeleteResult = (index) => {
    setMatchResults((prev) => prev.filter((_, i) => i !== index));
  };

  const getAverageSimilarity = () => {
    if (!matchResults?.length) return 0;
    const sum = matchResults.reduce((acc, cur) => acc + cur.similarityPercent, 0);
    return sum / matchResults.length;
  };

  const handleMatch = async () => {
    if (!file || !jobDescription.trim()) {
      alert("Upload your resume and enter a job description.");
      return;
    }

    setProcessing(true);

    try {
      const resumeText = await extractText(file);

      // Split JD text into sentences for comparison
      const jdSentences = jobDescription
        .split(/[.\n]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const response = await fetch("https://api.leonardonigro.com/combine-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume: resumeText,
          jobSentences: jdSentences,
        }),
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
        <p className="text-gray-300 mb-6">
          Upload your resume, enter a job description, and see how well they match.
        </p>

        {/* Resume Upload */}
        <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/50 transition-colors duration-300 mb-4">
          <input
            id="fileUpload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="fileUpload"
            className="cursor-pointer flex flex-col items-center justify-center space-y-2"
          >
            {file ? (
              <>
                <svg
                  className="w-12 h-12 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white">{file.name}</span>
              </>
            ) : (
              <>
                <svg
                  className="w-12 h-12 text-white/50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4h10v12m-5 4v-4m0 0H8m4 0h4" />
                </svg>
                <span className="text-white/70">Upload Resume</span>
              </>
            )}
          </label>
        </div>

        {/* Job Description Textarea */}
        <div className="mb-6">
          <textarea
            placeholder="Paste or type the job description here..."
            className="w-full bg-black/20 text-white p-4 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={6}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        <div className="space-y-4 mb-6">
          <button
            onClick={handleMatch}
            disabled={processing}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50"
          >
            {processing ? "Processing..." : "Compare to Job Description"}
          </button>

          {file && !processing && (
            <button
              onClick={handleDownload}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Download Original Resume
            </button>
          )}
        </div>

        {/* Match Results */}
        {matchResults && (
          <div className="bg-black/30 rounded-xl p-4 space-y-4 mt-6">
            <h2 className="text-xl text-white font-semibold mb-2">Matching Results</h2>

            {/* Overall Average Score */}
            <div className="text-white font-bold text-lg">
              Overall Match:{" "}
              <span
                style={{ backgroundColor: getGradientColor(getAverageSimilarity()) }}
                className="text-black px-2 py-1 rounded"
              >
                {getAverageSimilarity().toFixed(1)}%
              </span>
            </div>

            {matchResults.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 p-4 rounded-lg border border-white/10 relative"
              >
                <button
                  onClick={() => handleDeleteResult(idx)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
                <h3 className="text-white font-medium">Job Requirement:</h3>
                <p className="text-gray-300 mb-2">{item.jobSentence}</p>
                <h3 className="text-white font-medium">Best Matching Resume Sentence:</h3>
                <p className="text-gray-300 mb-2">{item.bestMatchSentence}</p>
                <span
                  className="text-sm text-black px-2 py-1 rounded"
                  style={{ backgroundColor: getGradientColor(item.similarityPercent) }}
                >
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
