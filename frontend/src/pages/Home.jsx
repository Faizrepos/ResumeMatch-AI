import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import ResumeUpload from "../components/ResumeUpload";
import ResumeInput from "../components/ResumeInput";
import AnalyzeButton from "../components/AnalyzeButton";
import AnalysisResult from "../components/AnalysisResult";
import JobDescriptionInput from "../components/JobDescriptionInput";

import {
  analyzeResume,
  extractResumeFromPDF,
} from "../services/api";


function Home() {

  const [resumeText, setResumeText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
  if (analysis) {
    setTimeout(() => {
      document
        .getElementById("analysis")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          });
      }, 100);
    }
  }, [analysis]);
  /* =========================================
     CHECK INPUTS
  ========================================= */

  const hasResume =
    resumeText.trim().length > 0 ||
    selectedFile !== null;

  const hasJobDescription =
    jobDescription.trim().length > 0;

  const canAnalyze =
    hasResume &&
    hasJobDescription &&
    !loading;


  /* =========================================
     ANALYZE RESUME
  ========================================= */

  const handleAnalyze = async () => {

    setError("");
    setAnalysis(null);

    if (!hasResume) {
      setError(
        "Please upload your resume or paste your resume text."
      );
      return;
    }

    if (!hasJobDescription) {
      setError(
        "Please paste the job description."
      );
      return;
    }


    try {

      setLoading(true);

      let finalResumeText = resumeText.trim();


      /* =====================================
         PDF → TEXT
      ===================================== */

      if (selectedFile) {

        const pdfResult =
          await extractResumeFromPDF(selectedFile);

        finalResumeText =
          pdfResult.resumeText?.trim() || "";


        if (!finalResumeText) {
          throw new Error(
            "Could not extract any text from the PDF."
          );
        }


        /*
          Put extracted PDF text into the
          resume textarea.
        */
        setResumeText(finalResumeText);
      }


      /* =====================================
         CHECK RESUME TEXT
      ===================================== */

      if (!finalResumeText) {

        throw new Error(
          "Resume text could not be found."
        );
      }


      /* =====================================
         SEND TO GEMINI
      ===================================== */

      const result = await analyzeResume(
        finalResumeText,
        jobDescription.trim()
      );


      /* =====================================
         SAVE ANALYSIS
      ===================================== */

      setAnalysis(result.data);

    } catch (err) {

      console.error(
        "Resume analysis error:",
        err
      );

      setError(
        err.message ||
        "Unable to analyze the resume."
      );

    } finally {

      setLoading(false);

    }
  };


  /* =========================================
     UI
  ========================================= */

  return (
    <div className="app">

      <Navbar />


      <main
        className="home"
        id="top"
      >

        {/* =================================
            HERO
        ================================= */}

        <section className="hero" id="how-it-works" >

          <p className="eyebrow">
            AI-POWERED RESUME ANALYZER
          </p>


          <h1>
            Make your resume
            <span> stronger.</span>
          </h1>


          <p className="hero-description">
            Upload your resume or paste your resume
            text and get AI-powered feedback, scores,
            missing skills, and improvement suggestions.
          </p>

        </section>


        {/* =================================
            RESUME
        ================================= */}

        <section className="resume-section" id="analyzer">

          <ResumeUpload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />


          {/* OR */}

          <div className="divider">
            <span>OR</span>
          </div>


          {/* PASTE RESUME */}

          <ResumeInput
            resumeText={resumeText}
            setResumeText={setResumeText}
          />


          {/* =================================
              JOB DESCRIPTION
          ================================= */}

          <JobDescriptionInput
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
          />


          {/* =================================
              ANALYZE BUTTON
          ================================= */}

          <AnalyzeButton
            canAnalyze={canAnalyze}
            onAnalyze={handleAnalyze}
          />


          {/* =================================
              LOADING
          ================================= */}

          {loading && (
            <div className="status-message">
              Reading resume and analyzing with AI...
            </div>
          )}


          {/* =================================
              ERROR
          ================================= */}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}


          {/* =================================
              RESULT
          ================================= */}

          {analysis && !loading && (
            <AnalysisResult
              analysis={analysis}
            />
          )}

        </section>

      </main>

    </div>
  );
}


export default Home;