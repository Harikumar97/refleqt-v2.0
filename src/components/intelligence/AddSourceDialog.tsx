"use client";

/**
 * Add Source Dialog Component
 * Beautiful modal dialog for adding new intelligence sources
 */

import { useState } from "react";

interface AddSourceDialogProps {
  userId: string;
}

export function AddSourceDialog({ userId }: AddSourceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sourceType, setSourceType] = useState<string>("rss");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [category, setCategory] = useState<string>("industry");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/intelligence/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          sourceType,
          sourceUrl,
          sourceName: sourceName || null,
          category,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error ?? "Failed to add source");
      }

      // Success - close dialog and reload
      setIsOpen(false);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add source");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <>
        <style jsx>{`
          .add-source-button {
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

          .add-source-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
          }
        `}</style>
        <button onClick={() => setIsOpen(true)} className="add-source-button">
          + Add Source
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
          max-width: 500px;
          padding: 32px;
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
        .form-select {
          width: 100%;
          padding: 12px 16px;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          color: #1e293b;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .form-input::placeholder {
          color: #94a3b8;
        }

        .form-input:focus,
        .form-select:focus {
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
            <h2 className="modal-title">Add Intelligence Source</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="close-button"
              type="button"
            >
              ×
            </button>
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
            {/* Source Type */}
            <div className="form-field">
              <label htmlFor="sourceType" className="form-label">
                Source Type
              </label>
              <select
                id="sourceType"
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
                className="form-select"
                required
              >
                <option value="rss">RSS Feed</option>
                <option value="twitter" disabled>
                  Twitter (Coming Soon)
                </option>
                <option value="blog" disabled>
                  Blog (Coming Soon)
                </option>
              </select>
            </div>

            {/* Source URL */}
            <div className="form-field">
              <label htmlFor="sourceUrl" className="form-label">
                Feed URL
              </label>
              <input
                id="sourceUrl"
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://hnrss.org/frontpage"
                className="form-input"
                required
              />
              <p className="form-hint">
                The RSS feed URL you want to track for intelligence
              </p>
            </div>

            {/* Source Name (Optional) */}
            <div className="form-field">
              <label htmlFor="sourceName" className="form-label">
                Source Name (Optional)
              </label>
              <input
                id="sourceName"
                type="text"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="e.g., Hacker News"
                className="form-input"
              />
              <p className="form-hint">
                A friendly name to identify this source
              </p>
            </div>

            {/* Category */}
            <div className="form-field">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
                required
              >
                <option value="competitor">Competitor Intelligence</option>
                <option value="industry">Industry News</option>
                <option value="geopolitical">Geopolitical Events</option>
                <option value="news">General News</option>
              </select>
              <p className="form-hint">
                Helps organize and filter your intelligence sources
              </p>
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
                    Adding...
                  </>
                ) : (
                  "Add Source"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
