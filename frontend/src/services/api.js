const API_BASE_URL = "http://127.0.0.1:5000/api";

export async function analyzeResume(
  resumeText,
  jobDescription
) {
  const response = await fetch(
    `${API_BASE_URL}/analyze`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        resumeText,
        jobDescription,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong."
    );
  }

  return data;
}

export async function extractResumeFromPDF(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/extract-pdf`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to extract PDF."
    );
  }

  return data;
}