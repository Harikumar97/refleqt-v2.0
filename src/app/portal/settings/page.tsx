"use client";

/**
 * Settings/Profile Page
 * Manage user profile, company info, and obsession score
 */

import { useUser } from "@/contexts/UserContext";
import { useGlobalState } from "@/contexts/GlobalStateContext";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { user, profile, loading: userLoading, refetch } = useUser();
  const { updateObsessionScore } = useGlobalState();
  const userId = user?.id ?? "demo-user";

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [obsessionScore, setObsessionScore] = useState(5);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setCompanyName(profile.companyName || "");
      setIndustry(profile.industry || "");
      setObsessionScore(profile.obsessionScore || 5);
    }
  }, [profile]);

  async function handleSaveProfile() {
    setSaving(true);

    try {
      // Update profile
      const profileResponse = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          industry,
        }),
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to update profile");
      }

      // Update obsession score
      const obsessionResponse = await fetch("/api/user/obsession-score", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          obsessionScore,
        }),
      });

      if (!obsessionResponse.ok) {
        throw new Error("Failed to update obsession score");
      }

      // Update global state
      updateObsessionScore(
        obsessionScore - (profile?.obsessionScore || 5),
        "Settings update"
      );

      // Refresh user context
      await refetch();

      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  function getObsessionLevel(score: number): string {
    if (score >= 9) return "🔥 EXTREME";
    if (score >= 7) return "⚡ HIGH";
    if (score >= 4) return "💡 MEDIUM";
    return "🌙 LOW";
  }

  function getUpdateFrequency(score: number): string {
    if (score >= 9) return "Every 5 minutes";
    if (score >= 7) return "Every 15 minutes";
    if (score >= 4) return "Every hour";
    return "Daily";
  }

  function getMaxInsights(score: number): number {
    if (score >= 9) return 10;
    if (score >= 7) return 9;
    if (score >= 4) return 7;
    return 5;
  }

  return (
    <>
      <style jsx global>{`
        .settings-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%);
          padding: 40px;
        }

        .settings-header {
          margin-bottom: 32px;
        }

        .settings-title {
          font-size: 36px;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
        }

        .settings-subtitle {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.9);
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }

        .settings-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .card-title {
          font-size: 22px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .card-icon {
          font-size: 28px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.2s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }

        .obsession-score-slider {
          margin-bottom: 12px;
        }

        .slider {
          width: 100%;
          height: 8px;
          border-radius: 10px;
          background: linear-gradient(
            to right,
            #3b82f6 0%,
            #10b981 50%,
            #f59e0b 75%,
            #ef4444 100%
          );
          outline: none;
          -webkit-appearance: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          border: none;
        }

        .score-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .score-value {
          font-size: 32px;
          font-weight: 800;
          color: #7c3aed;
        }

        .score-level {
          font-size: 16px;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: 20px;
          background: #f3f4f6;
          color: #374151;
        }

        .score-info {
          background: #f9fafb;
          padding: 16px;
          border-radius: 12px;
          margin-top: 12px;
        }

        .score-info-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
          color: #4b5563;
        }

        .score-info-label {
          font-weight: 600;
        }

        .score-info-value {
          color: #7c3aed;
          font-weight: 600;
        }

        .save-button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 24px;
        }

        .save-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.3);
        }

        .save-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .account-info {
          display: grid;
          gap: 16px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          background: #f9fafb;
          border-radius: 10px;
        }

        .info-label {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
        }

        .info-value {
          font-size: 14px;
          color: #1f2937;
          font-weight: 500;
        }

        .loading-state {
          text-align: center;
          padding: 80px 20px;
          color: white;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(255, 255, 255, 0.3);
          border-top: 5px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div className="settings-container">
        <div className="settings-header">
          <h1 className="settings-title">Settings & Profile</h1>
          <p className="settings-subtitle">
            Manage your account, company info, and obsession preferences
          </p>
        </div>

        {userLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <div>Loading settings...</div>
          </div>
        ) : (
          <div className="settings-grid">
            {/* Company Profile */}
            <div className="settings-card">
              <h2 className="card-title">
                <span className="card-icon">🏢</span>
                Company Profile
              </h2>

              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your company name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Industry</label>
                <input
                  type="text"
                  className="form-input"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g., SaaS, E-commerce, FinTech"
                />
              </div>
            </div>

            {/* Obsession Score */}
            <div className="settings-card">
              <h2 className="card-title">
                <span className="card-icon">🎯</span>
                Obsession Score
              </h2>

              <div className="score-display">
                <div className="score-value">{obsessionScore}</div>
                <div className="score-level">
                  {getObsessionLevel(obsessionScore)}
                </div>
              </div>

              <div className="obsession-score-slider">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={obsessionScore}
                  onChange={(e) => setObsessionScore(Number(e.target.value))}
                  className="slider"
                />
              </div>

              <div className="score-info">
                <div className="score-info-item">
                  <span className="score-info-label">Update Frequency</span>
                  <span className="score-info-value">
                    {getUpdateFrequency(obsessionScore)}
                  </span>
                </div>
                <div className="score-info-item">
                  <span className="score-info-label">Max Insights</span>
                  <span className="score-info-value">
                    {getMaxInsights(obsessionScore)} per tracker
                  </span>
                </div>
                <div className="score-info-item">
                  <span className="score-info-label">Monitoring Level</span>
                  <span className="score-info-value">
                    {obsessionScore >= 9
                      ? "Realtime"
                      : obsessionScore >= 7
                        ? "Hourly"
                        : "Daily"}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="settings-card">
              <h2 className="card-title">
                <span className="card-icon">👤</span>
                Account Information
              </h2>

              <div className="account-info">
                <div className="info-row">
                  <span className="info-label">Name</span>
                  <span className="info-value">{user?.name || "Not set"}</span>
                </div>

                <div className="info-row">
                  <span className="info-label">Email</span>
                  <span className="info-value">{user?.email || "Not set"}</span>
                </div>

                <div className="info-row">
                  <span className="info-label">Account Created</span>
                  <span className="info-value">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">Profile ID</span>
                  <span className="info-value">
                    {profile?.id?.substring(0, 8) || "Not set"}...
                  </span>
                </div>
              </div>
            </div>

            {/* API & Usage */}
            <div className="settings-card">
              <h2 className="card-title">
                <span className="card-icon">🔑</span>
                API & Usage
              </h2>

              <div className="account-info">
                <div className="info-row">
                  <span className="info-label">LLM Providers</span>
                  <span className="info-value">Claude, GPT, Gemini</span>
                </div>

                <div className="info-row">
                  <span className="info-label">API Status</span>
                  <span className="info-value" style={{ color: "#10b981" }}>
                    ✓ Connected
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">Current Plan</span>
                  <span className="info-value">Professional</span>
                </div>

                <div className="info-row">
                  <span className="info-label">Research Swarms</span>
                  <span className="info-value">Unlimited</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!userLoading && (
          <button
            className="save-button"
            onClick={handleSaveProfile}
            disabled={saving}
          >
            {saving ? "Saving..." : "💾 Save Settings"}
          </button>
        )}
      </div>
    </>
  );
}
