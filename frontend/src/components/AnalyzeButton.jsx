function AnalyzeButton({ canAnalyze, onAnalyze }) {
  return (
    <button
      className="analyze-button"
      disabled={!canAnalyze}
      onClick={onAnalyze}
    >
      Analyze Resume
    </button>
  );
}

export default AnalyzeButton;
