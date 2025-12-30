"use client";

/**
 * Configure Research Goal Dialog
 * Replaces "Add Source" - allows users to create goal-based research
 * with Smart Tracker integration
 */

import { useState } from "react";

interface ConfigureResearchGoalDialogProps {
  userId: string;
  obsessionScore: number;
}

export function ConfigureResearchGoalDialog({
  userId,
  obsessionScore,
}: ConfigureResearchGoalDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalQuery, setGoalQuery] = useState("");
  const [goalType, setGoalType] = useState<string>("competitive");
  const [enableTracking, setEnableTracking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate monitoring preview based on obsession score
  const getMonitoringPreview = () => {
    if (obsessionScore >= 9)
      return { interval: "Every 5 minutes", maxItems: 10 };
    if (obsessionScore >= 7)
      return { interval: "Every 15 minutes", maxItems: 9 };
    if (obsessionScore >= 4) return { interval: "Hourly", maxItems: 7 };
    return { interval: "Daily", maxItems: 5 };
  };

  const monitoringPreview = getMonitoringPreview();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/research-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          goalTitle,
          goalQuery,
          goalType,
          enableTracking,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error ?? "Failed to create research goal");
      }

      // Success - close dialog and reload
      setIsOpen(false);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create goal");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <>
        <style jsx>{`
          .configure-goal-button {
            padding: 14px 24px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          }

          .configure-goal-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
          }
        `}</style>
        <button
          onClick={() => setIsOpen(true)}
          className="configure-goal-button"
        >
          ⚡ Configure Research Goal
        </button>
      </>
    );
  }

  return (
    <>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.75);
          padding: 16px;
          backdrop-filter: blur(4px);
        }

        .modal-container {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          padding: 32px;
          overflow-y: auto;
          animation: modalSlideIn 0.3s ease;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .modal-title {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .close-button {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 32px;
          line-height: 1;
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          color: #1e293b;
        }

        .info-banner {
          background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%);
          border: 2px solid #3b82f6;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .info-banner-content {
          display: flex;
          gap: 12px;
        }

        .info-icon {
          width: 20px;
          height: 20px;
          color: #3b82f6;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .info-text {
          color: #1e40af;
          font-size: 14px;
          line-height: 1.6;
        }

        .info-text strong {
          font-weight: 600;
        }

        .form-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          color: #1e293b;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #94a3b8;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #4facfe;
          background: white;
          box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
        }

        .form-hint {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
        }

        .example-queries {
          background: #f8fafc;
          border-radius: 8px;
          padding: 12px;
          margin-top: 8px;
        }

        .example-queries-title {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 8px;
        }

        .example-query {
          font-size: 12px;
          color: #64748b;
          padding: 4px 0;
          cursor: pointer;
          transition: color 0.2s;
        }

        .example-query:hover {
          color: #3b82f6;
        }

        .checkbox-field {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 2px solid #22c55e;
          border-radius: 12px;
        }

        .checkbox-input {
          width: 20px;
          height: 20px;
          cursor: pointer;
          margin-top: 2px;
        }

        .checkbox-content {
          flex: 1;
        }

        .checkbox-label {
          font-size: 14px;
          font-weight: 600;
          color: #166534;
          margin-bottom: 4px;
        }

        .checkbox-description {
          font-size: 12px;
          color: #15803d;
          line-height: 1.5;
        }

        .monitoring-preview {
          background: #fef3c7;
          padding: 8px 12px;
          border-radius: 6px;
          margin-top: 8px;
          font-size: 12px;
          color: #92400e;
          font-weight: 600;
        }

        .error-message {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          border: 2px solid #ef4444;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .error-content {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .error-icon {
          width: 20px;
          height: 20px;
          color: #dc2626;
          flex-shrink: 0;
        }

        .error-text {
          color: #7f1d1d;
          font-size: 14px;
          font-weight: 500;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .submit-button {
          flex: 1;
          padding: 14px 24px;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cancel-button {
          flex: 1;
          padding: 14px 24px;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          color: #475569;
          border: 2px solid #cbd5e1;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-button:hover {
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
          border-color: #94a3b8;
        }

        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2 className="modal-title">Configure Research Goal ⚡</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="close-button"
              type="button"
            >
              ×
            </button>
          </div>

          <div className="info-banner">
            <div className="info-banner-content">
              <svg
                className="info-icon"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="info-text">
                <strong>New Intelligence System:</strong> Instead of adding RSS
                feeds, describe what you want to research in natural language.
                AI swarms will gather and synthesize insights for you
                automatically.
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <div className="error-content">
                <svg
                  className="error-icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="error-text">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-container">
            {/* Goal Title */}
            <div className="form-field">
              <label htmlFor="goalTitle" className="form-label">
                Research Goal Title
              </label>
              <input
                id="goalTitle"
                type="text"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="e.g., Competitor Sustainability Strategy"
                className="form-input"
                required
              />
              <p className="form-hint">
                A short, descriptive name for this research goal
              </p>
            </div>

            {/* Goal Query */}
            <div className="form-field">
              <label htmlFor="goalQuery" className="form-label">
                Research Question (Natural Language)
              </label>
              <textarea
                id="goalQuery"
                value={goalQuery}
                onChange={(e) => setGoalQuery(e.target.value)}
                placeholder="e.g., How are my competitors responding to new AI regulations? What strategies are they using?"
                className="form-textarea"
                required
              />
              <p className="form-hint">
                Describe what you want to research in natural language
              </p>
              <div className="example-queries">
                <div className="example-queries-title">Example queries:</div>
                <div
                  className="example-query"
                  onClick={() =>
                    setGoalQuery(
                      "How are competitors responding to sustainability regulations?"
                    )
                  }
                >
                  • "How are competitors responding to sustainability
                  regulations?"
                </div>
                <div
                  className="example-query"
                  onClick={() =>
                    setGoalQuery(
                      "What pricing strategies are market leaders using for SaaS products?"
                    )
                  }
                >
                  • "What pricing strategies are market leaders using for SaaS
                  products?"
                </div>
                <div
                  className="example-query"
                  onClick={() =>
                    setGoalQuery(
                      "What are customers saying about our product vs competitors?"
                    )
                  }
                >
                  • "What are customers saying about our product vs
                  competitors?"
                </div>
              </div>
            </div>

            {/* Goal Type */}
            <div className="form-field">
              <label htmlFor="goalType" className="form-label">
                Research Type
              </label>
              <select
                id="goalType"
                value={goalType}
                onChange={(e) => setGoalType(e.target.value)}
                className="form-select"
                required
              >
                <option value="competitive">Competitive Intelligence</option>
                <option value="market">Market Trends & Analysis</option>
                <option value="customer">Customer Intelligence</option>
                <option value="industry">Industry News & Events</option>
              </select>
              <p className="form-hint">
                Helps AI agents focus on the right data sources
              </p>
            </div>

            {/* Smart Tracker Toggle */}
            <div className="checkbox-field">
              <input
                type="checkbox"
                id="enableTracking"
                checked={enableTracking}
                onChange={(e) => setEnableTracking(e.target.checked)}
                className="checkbox-input"
              />
              <div className="checkbox-content">
                <label htmlFor="enableTracking" className="checkbox-label">
                  Enable Smart Tracker (Continuous Monitoring)
                </label>
                <p className="checkbox-description">
                  Automatically run AI swarms on schedule to keep insights
                  fresh. Updates based on your Obsession Score.
                </p>
                {enableTracking && (
                  <div className="monitoring-preview">
                    📊 Will update {monitoringPreview.interval} with max{" "}
                    {monitoringPreview.maxItems} insights (Obsession Score:{" "}
                    {obsessionScore}/10)
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Creating Goal...
                  </>
                ) : (
                  "Create Research Goal"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
