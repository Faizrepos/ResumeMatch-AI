function ResumeInput({ resumeText, setResumeText }) {
  const maxCharacters = 10000;

  const handleChange = (event) => {
    const value = event.target.value;

    if (value.length <= maxCharacters) {
      setResumeText(value);
    }
  };

  return (
    <div className="text-input-container">
      <label htmlFor="resume-text">Paste your resume</label>

      <textarea
        id="resume-text"
        value={resumeText}
        onChange={handleChange}
        placeholder="Paste your resume text here..."
        rows="12"
      />

      <div className="character-count">
        {resumeText.length} / {maxCharacters} characters
      </div>
    </div>
  );
}

export default ResumeInput;
