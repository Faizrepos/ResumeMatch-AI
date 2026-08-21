function ResumeUpload({ selectedFile, setSelectedFile }) {

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };


  const removeFile = () => {
    setSelectedFile(null);
  };


  return (
    <div className="upload-module">

      <div className="upload-module-header">

        <div>
          <span className="upload-eyebrow">
            RESUME INPUT
          </span>

          <h2>
            Add your resume
          </h2>

          <p>
            Upload a PDF to use it for your AI analysis.
          </p>
        </div>

        <span className="upload-required">
          REQUIRED
        </span>

      </div>


      {!selectedFile ? (

        <div className="upload-dropzone">

          <div className="upload-symbol">
            <span>↑</span>
          </div>


          <div className="upload-copy">

            <h3>
              Upload your resume
            </h3>

            <p>
              Choose a PDF file from your computer
            </p>

          </div>


          <label className="browse-button">

            Browse PDF

            <input
              type="file"
              accept=".pdf,application/pdf"
              hidden
              onChange={handleFileChange}
            />

          </label>


          <div className="upload-meta">

            <span>PDF only</span>

            <span className="meta-dot">
              •
            </span>

            <span>Maximum 5 MB</span>

          </div>

        </div>

      ) : (

        <div className="selected-file-card">

          <div className="file-icon">
            PDF
          </div>


          <div className="selected-file-info">

            <span className="selected-label">
              RESUME READY
            </span>

            <strong>
              {selectedFile.name}
            </strong>

            <small>
              PDF document selected
            </small>

          </div>


          <button
            type="button"
            className="remove-file-button"
            onClick={removeFile}
          >
            Remove
          </button>

        </div>

      )}

    </div>
  );
}


export default ResumeUpload;