function JobDescriptionInput({
  jobDescription,
  setJobDescription
}) {
  const maxCharacters = 15000;

  const handleChange = (event) => {
    const value = event.target.value;

    if (value.length <= maxCharacters) {
      setJobDescription(value);
    }
  };

  return (
    <div className="job-description-container">
      <div className="section-heading">
        <h2>Job Description</h2>

        <span>Required</span>
      </div>

      <p className="input-description">
        Paste the job description for the position you're
        applying for.
      </p>

      <textarea
        value={jobDescription}
        onChange={handleChange}
        placeholder="Example: We are looking for a Frontend Developer with experience in React, JavaScript, REST APIs..."
        rows="12"
      />

      <div className="character-count">
        {jobDescription.length} / {maxCharacters} characters
      </div>
    </div>
  );
}

export default JobDescriptionInput;