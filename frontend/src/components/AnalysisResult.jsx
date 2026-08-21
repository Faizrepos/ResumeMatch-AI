function clampScore(score) {
  return Math.min(
    100,
    Math.max(0, Number(score) || 0)
  );
}


function getScoreLabel(score) {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Strong";
  if (score >= 50) return "Moderate";
  return "Needs Work";
}


function ScoreRing({ score, label, variant }) {
  const safeScore = clampScore(score);

  return (
    <div className={`score-ring-card ${variant}`}>
      <div
        className="score-ring"
        style={{
          "--score": `${safeScore * 3.6}deg`,
        }}
      >
        <div className="score-ring-inner">
          <strong>{safeScore}</strong>
          <span>/100</span>
        </div>
      </div>

      <div className="score-ring-label">
        <span>{label}</span>
        <small>{getScoreLabel(safeScore)}</small>
      </div>
    </div>
  );
}


function MetricBar({ label, score }) {
  const safeScore = clampScore(score);

  return (
    <div className="metric-row">

      <div className="metric-header">
        <span>{label}</span>
        <strong>{safeScore}</strong>
      </div>

      <div className="metric-track">
        <div
          className="metric-fill"
          style={{
            width: `${safeScore}%`,
          }}
        />
      </div>

    </div>
  );
}


function TagList({
  items,
  variant = "default",
  emptyText = "None identified",
}) {

  if (!items || items.length === 0) {
    return (
      <p className="empty-message">
        {emptyText}
      </p>
    );
  }

  return (
    <div className="tag-list">

      {items.map((item, index) => (
        <span
          className={`analysis-tag ${variant}`}
          key={`${item}-${index}`}
        >
          {item}
        </span>
      ))}

    </div>
  );
}


function InsightCard({
  eyebrow,
  title,
  items,
  variant,
}) {

  return (
    <article className={`insight-card ${variant}`}>

      <div className="insight-header">

        <div>
          <span className="insight-eyebrow">
            {eyebrow}
          </span>

          <h3>{title}</h3>
        </div>

      </div>

      {items && items.length > 0 ? (
        <ul className="insight-list">

          {items.map((item, index) => (
            <li key={`${item}-${index}`}>
              {item}
            </li>
          ))}

        </ul>
      ) : (
        <p className="empty-message">
          Nothing specific identified.
        </p>
      )}

    </article>
  );
}


function AnalysisResult({ analysis }) {

  if (!analysis) {
    return null;
  }


  const matchScore = clampScore(
    analysis.matchScore
  );

  const resumeScore = clampScore(
    analysis.resumeScore
  );


  return (
    <section
      className="analysis-result"
      id="analysis"
    >

      {/* =====================================
          RESULT HEADER
      ===================================== */}

      <div className="analysis-heading">

        <div>

          <span className="analysis-kicker">
            AI ANALYSIS COMPLETE
          </span>

          <h2>
            Your Resume Intelligence Report
          </h2>

          <p>
            Gemini compared your resume directly
            against the job description and identified
            your strongest matches and improvement areas.
          </p>

        </div>

        <div className="analysis-status">
          <span className="status-dot" />
          Analysis ready
        </div>

      </div>


      {/* =====================================
          PRIMARY SCORES
      ===================================== */}

      <div className="primary-score-grid">

        <ScoreRing
          score={matchScore}
          label="Job Match"
          variant="match"
        />

        <ScoreRing
          score={resumeScore}
          label="Resume Quality"
          variant="resume"
        />

      </div>


      {/* =====================================
          BREAKDOWN
      ===================================== */}

      <section className="analysis-panel">

        <div className="panel-heading">

          <div>
            <span className="panel-kicker">
              PERFORMANCE
            </span>

            <h3>
              Resume Breakdown
            </h3>
          </div>

          <span className="panel-caption">
            4 key signals
          </span>

        </div>


        <div className="metrics-grid">

          <MetricBar
            label="Skills Alignment"
            score={analysis.skillsScore}
          />

          <MetricBar
            label="Experience Relevance"
            score={analysis.experienceScore}
          />

          <MetricBar
            label="Project Relevance"
            score={analysis.projectsScore}
          />

          <MetricBar
            label="Formatting & Clarity"
            score={analysis.formattingScore}
          />

        </div>

      </section>


      {/* =====================================
          SKILLS
      ===================================== */}

      <div className="analysis-two-column">

        <section className="analysis-panel">

          <div className="panel-heading">

            <div>
              <span className="panel-kicker">
                SKILL MATCH
              </span>

              <h3>
                Matched Skills
              </h3>
            </div>

          </div>

          <TagList
            items={analysis.matchedSkills}
            variant="matched"
            emptyText="No matching skills identified."
          />

        </section>


        <section className="analysis-panel">

          <div className="panel-heading">

            <div>
              <span className="panel-kicker">
                SKILL GAP
              </span>

              <h3>
                Missing Skills
              </h3>
            </div>

          </div>

          <TagList
            items={analysis.missingSkills}
            variant="missing"
            emptyText="No important missing skills identified."
          />

        </section>

      </div>


      {/* =====================================
          KEYWORDS
      ===================================== */}

      <div className="analysis-two-column">

        <section className="analysis-panel">

          <div className="panel-heading">

            <div>
              <span className="panel-kicker">
                ATS SIGNAL
              </span>

              <h3>
                Matched Keywords
              </h3>
            </div>

          </div>

          <TagList
            items={analysis.matchedKeywords}
            variant="keyword"
            emptyText="No important matching keywords identified."
          />

        </section>


        <section className="analysis-panel">

          <div className="panel-heading">

            <div>
              <span className="panel-kicker">
                ATS GAP
              </span>

              <h3>
                Missing Keywords
              </h3>
            </div>

          </div>

          <TagList
            items={analysis.missingKeywords}
            variant="missing"
            emptyText="No important missing keywords identified."
          />

        </section>

      </div>


      {/* =====================================
          AI INSIGHTS
      ===================================== */}

      <div className="insights-grid">

        <InsightCard
          eyebrow="POSITIVE SIGNALS"
          title="Strengths"
          items={analysis.strengths}
          variant="strengths"
        />

        <InsightCard
          eyebrow="ATTENTION NEEDED"
          title="Areas to Improve"
          items={analysis.weaknesses}
          variant="weaknesses"
        />

        <InsightCard
          eyebrow="AI RECOMMENDATIONS"
          title="Suggestions"
          items={analysis.suggestions}
          variant="suggestions"
        />

      </div>


      {/* =====================================
          FOOTER
      ===================================== */}

      <div className="analysis-footer">

        <span>
          AI-powered analysis
        </span>

        <span className="footer-divider">
          •
        </span>

        <span>
          Resume + Job Description comparison
        </span>

        <span className="footer-divider">
          •
        </span>

        <span>
          Google Gemini
        </span>

      </div>

    </section>
  );
}


export default AnalysisResult;