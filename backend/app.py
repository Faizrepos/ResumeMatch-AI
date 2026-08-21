import os
import json

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
from PyPDF2 import PdfReader

load_dotenv()

app = Flask(__name__)

CORS(app)


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set in the .env file.")

client = genai.Client(api_key=GEMINI_API_KEY)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "success",
        "message": "Flask backend is running!"
    })

@app.route("/api/extract-pdf", methods=["POST"])
def extract_pdf():
    try:
        if "file" not in request.files:
            return jsonify({
                "status": "error",
                "message": "No PDF file received."
            }), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({
                "status": "error",
                "message": "No PDF file selected."
            }), 400

        if not file.filename.lower().endswith(".pdf"):
            return jsonify({
                "status": "error",
                "message": "Only PDF files are allowed."
            }), 400

        reader = PdfReader(file)

        extracted_text = ""

        for page in reader.pages:
            page_text = page.extract_text()

            if page_text:
                extracted_text += page_text + "\n"

        extracted_text = extracted_text.strip()

        if not extracted_text:
            return jsonify({
                "status": "error",
                "message": "Could not extract text from this PDF."
            }), 400

        return jsonify({
            "status": "success",
            "resumeText": extracted_text
        })

    except Exception as error:
        print("PDF extraction error:", error)

        return jsonify({
            "status": "error",
            "message": "Unable to read the PDF."
        }), 500

@app.route("/api/analyze", methods=["POST"])
def analyze_resume():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "status": "error",
                "message": "No data received."
            }), 400

        resume_text = data.get("resumeText", "").strip()

        job_description = data.get("jobDescription", "").strip()

        if not resume_text:
            return jsonify({
                "status": "error",
                "message": "Resume text is required."
            }), 400


        if not job_description:
            return jsonify({
                "status": "error",
                "message": "Job description is required."
            }), 400

        prompt = f"""
You are an expert resume reviewer and job-matching assistant.

Your task is to compare a candidate's resume against
the provided job description.

Do not assume that the candidate has a skill simply
because it is common for the role.

Only consider a skill as present when it is clearly
mentioned or demonstrated in the resume.

If a job requirement is not found in the resume,
describe it as "not found in the resume".

Do not say that the candidate definitely does not
know that skill.

====================
RESUME
====================

{resume_text}


====================
JOB DESCRIPTION
====================

{job_description}


====================
ANALYSIS
====================

Return ONLY valid JSON.

Use exactly this structure:

{{
  "matchScore": 0,
  "resumeScore": 0,

  "skillsScore": 0,
  "experienceScore": 0,
  "projectsScore": 0,
  "formattingScore": 0,

  "matchedSkills": [],
  "missingSkills": [],

  "matchedKeywords": [],
  "missingKeywords": [],

  "strengths": [],
  "weaknesses": [],

  "suggestions": []
}}

SCORING:

matchScore:
How closely the resume matches the job description.

resumeScore:
Overall quality of the resume.

skillsScore:
How well the candidate's listed skills match
the job requirements.

experienceScore:
How relevant and well-presented the experience is.

projectsScore:
How relevant the projects are to the job.

formattingScore:
How clear, structured and readable the resume is.

IMPORTANT:

- All scores must be integers from 0 to 100.
- Do not invent candidate experience.
- Do not invent skills.
- Do not claim the candidate lacks a skill.
- Use "not found in the resume" when appropriate.
- matchedSkills should contain skills clearly found
  in both the resume and job description.
- missingSkills should contain important job skills
  that are not clearly found in the resume.
- matchedKeywords should contain important job-related
  keywords found in the resume.
- missingKeywords should contain important keywords
  from the job description that are not clearly found
  in the resume.
- strengths should describe genuine strengths.
- weaknesses should describe genuine weaknesses.
- suggestions should give practical improvements.
"""

        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt
        )

        response_text = response.text.strip()

        # Remove Markdown code fences if Gemini adds them.
        if response_text.startswith("```"):
            response_text = response_text.replace("```json", "")
            response_text = response_text.replace("```", "")
            response_text = response_text.strip()

        analysis = json.loads(response_text)

        return jsonify({
            "status": "success",
            "data": analysis
        })

    except json.JSONDecodeError:
        return jsonify({
            "status": "error",
            "message": "Gemini returned an invalid response format."
        }), 500

    except Exception as error:
        print("Gemini error:", error)

        return jsonify({
            "status": "error",
            "message": "Unable to analyze the resume right now."
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)