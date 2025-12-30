"use client";

/**
 * Portal Dashboard - Main Landing Page
 * Beautiful welcome dashboard with feature cards and quick actions
 */

import { useUser } from "@/contexts/UserContext";
import { useGlobalState } from "@/contexts/GlobalStateContext";
import Link from "next/link";

export default function PortalDashboard() {
  const { user, profile, loading: userLoading } = useUser();
  const { state } = useGlobalState();

  const userName = user?.name?.split(" ")[0] ?? "there";
  const companyName = profile?.companyName ?? "your company";

  return (
    <>
      <style jsx global>{`
        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 0;
          margin: -32px;
        }

        .welcome-header {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          padding: 40px;
          margin-bottom: 30px;
          position: relative;
          overflow: hidden;
        }

        .welcome-header::before {
          content: "";
          position: absolute;
          top: -50%;
          right: -20%;
          width: 100%;
          height: 200%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="10" fill="rgba(255,255,255,0.1)"/></svg>');
          animation: float 20s infinite linear;
          opacity: 0.7;
        }

        @keyframes float {
          0% {
            transform: translateX(-100px) rotate(0deg);
          }
          100% {
            transform: translateX(100px) rotate(360deg);
          }
        }

        .welcome-content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
        }

        .welcome-title {
          font-size: 42px;
          font-weight: 900;
          margin-bottom: 12px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .welcome-subtitle {
          font-size: 18px;
          opacity: 0.95;
          font-weight: 400;
        }

        .obsession-highlight {
          display: inline-block;
          background: rgba(255, 255, 255, 0.25);
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 700;
          margin-left: 8px;
        }

        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px 60px 40px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
          border-color: #4facfe;
        }

        .stat-icon {
          font-size: 32px;
          margin-bottom: 16px;
        }

        .stat-value {
          font-size: 36px;
          font-weight: 900;
          color: #2d3748;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          font-size: 14px;
          color: #718096;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-change {
          font-size: 13px;
          color: #48bb78;
          margin-top: 8px;
          font-weight: 600;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .feature-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          display: block;
          border: 2px solid transparent;
        }

        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
          border-color: #764ba2;
        }

        .feature-card.primary:hover {
          border-color: #4facfe;
        }

        .feature-card.brewery:hover {
          border-color: #f5576c;
        }

        .feature-card.funnel:hover {
          border-color: #00f2fe;
        }

        .feature-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .feature-icon {
          font-size: 40px;
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .feature-card.primary .feature-icon {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .feature-card.brewery .feature-icon {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .feature-card.funnel .feature-icon {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .feature-title {
          font-size: 22px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 4px;
        }

        .feature-badge {
          display: inline-block;
          background: #10b981;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-left: 8px;
        }

        .feature-badge.beta {
          background: #f59e0b;
        }

        .feature-description {
          font-size: 15px;
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .feature-meta {
          display: flex;
          gap: 20px;
          font-size: 13px;
          color: #718096;
        }

        .feature-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .quick-actions {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }

        .quick-actions-title {
          font-size: 20px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 24px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .action-btn {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          border: none;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          text-decoration: none;
          display: block;
          box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
        }

        .action-btn.secondary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 4px 12px rgba(118, 75, 162, 0.3);
        }

        .action-btn.secondary:hover {
          box-shadow: 0 6px 20px rgba(118, 75, 162, 0.4);
        }

        .action-btn.brewery {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
        }

        .action-btn.brewery:hover {
          box-shadow: 0 6px 20px rgba(245, 87, 108, 0.4);
        }

        .loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 6px solid rgba(255, 255, 255, 0.3);
          border-top: 6px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
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

      {userLoading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="dashboard-container">
          {/* Welcome Header */}
          <div className="welcome-header">
            <div className="welcome-content">
              <h1 className="welcome-title">Welcome back, {userName}! 👋</h1>
              <p className="welcome-subtitle">
                {companyName}'s intelligence is ready. Let's obsess smart today.
                <span className="obsession-highlight">
                  Score: {state.obsessionScore.toFixed(1)}
                </span>
              </p>
            </div>
          </div>

          <div className="dashboard-content">
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-value">21</div>
                <div className="stat-label">Intelligence Items</div>
                <div className="stat-change">↑ 5 new today</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-value">3</div>
                <div className="stat-label">Active Analyses</div>
                <div className="stat-change">2 in progress</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🍺</div>
                <div className="stat-value">12</div>
                <div className="stat-label">Content Pieces</div>
                <div className="stat-change">4 brewing</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-value">
                  {state.obsessionScore.toFixed(1)}
                </div>
                <div className="stat-label">Obsession Score</div>
                <div className="stat-change">{state.obsessionLevel}</div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="features-grid">
              <Link
                href="/portal/intelligence-feed"
                className="feature-card primary"
              >
                <div className="feature-header">
                  <div className="feature-icon">📡</div>
                  <div>
                    <h3 className="feature-title">
                      Intelligence Feed
                      <span className="feature-badge">LIVE</span>
                    </h3>
                  </div>
                </div>
                <p className="feature-description">
                  Track competitive intelligence from RSS feeds, blogs, and news
                  sources in real-time.
                </p>
                <div className="feature-meta">
                  <div className="feature-meta-item">
                    <span>📊</span>
                    <span>21 items</span>
                  </div>
                  <div className="feature-meta-item">
                    <span>🔔</span>
                    <span>3 alerts</span>
                  </div>
                </div>
              </Link>

              <Link href="/portal/strategy-cohorts" className="feature-card">
                <div className="feature-header">
                  <div className="feature-icon">🎯</div>
                  <div>
                    <h3 className="feature-title">Strategy Cohorts</h3>
                  </div>
                </div>
                <p className="feature-description">
                  AI-powered competitive analysis for multi-competitor strategy
                  insights.
                </p>
                <div className="feature-meta">
                  <div className="feature-meta-item">
                    <span>⚡</span>
                    <span>Analysis running</span>
                  </div>
                </div>
              </Link>

              <Link
                href="/portal/psychographics"
                className="feature-card funnel"
              >
                <div className="feature-header">
                  <div className="feature-icon">🧠</div>
                  <div>
                    <h3 className="feature-title">Funnel-lytics</h3>
                  </div>
                </div>
                <p className="feature-description">
                  Deep psychographic analysis and customer segment intelligence.
                </p>
                <div className="feature-meta">
                  <div className="feature-meta-item">
                    <span>👥</span>
                    <span>4 segments</span>
                  </div>
                </div>
              </Link>

              <Link href="/portal/brewery" className="feature-card brewery">
                <div className="feature-header">
                  <div className="feature-icon">🍺</div>
                  <div>
                    <h3 className="feature-title">
                      The Brewery
                      <span className="feature-badge">NEW</span>
                    </h3>
                  </div>
                </div>
                <p className="feature-description">
                  Distill intelligence into actionable content: newsletters,
                  briefs, and more.
                </p>
                <div className="feature-meta">
                  <div className="feature-meta-item">
                    <span>🍺</span>
                    <span>4 brewing</span>
                  </div>
                  <div className="feature-meta-item">
                    <span>✅</span>
                    <span>8 ready</span>
                  </div>
                </div>
              </Link>

              <Link href="/portal/research-swarms" className="feature-card">
                <div className="feature-header">
                  <div className="feature-icon">🔬</div>
                  <div>
                    <h3 className="feature-title">
                      Research Swarms
                      <span className="feature-badge">LIVE</span>
                    </h3>
                  </div>
                </div>
                <p className="feature-description">
                  Multi-agent research teams for deep competitive and market
                  intelligence.
                </p>
                <div className="feature-meta">
                  <div className="feature-meta-item">
                    <span>🤖</span>
                    <span>AI-powered</span>
                  </div>
                </div>
              </Link>

              <Link href="/portal/smart-trackers" className="feature-card">
                <div className="feature-header">
                  <div className="feature-icon">📊</div>
                  <div>
                    <h3 className="feature-title">
                      Smart Trackers
                      <span className="feature-badge">LIVE</span>
                    </h3>
                  </div>
                </div>
                <p className="feature-description">
                  Automated monitoring for research goals based on your
                  Obsession Score.
                </p>
                <div className="feature-meta">
                  <div className="feature-meta-item">
                    <span>⚡</span>
                    <span>Auto-monitor</span>
                  </div>
                </div>
              </Link>

              <Link href="/portal/settings" className="feature-card">
                <div className="feature-header">
                  <div className="feature-icon">⚙️</div>
                  <div>
                    <h3 className="feature-title">Settings</h3>
                  </div>
                </div>
                <p className="feature-description">
                  Manage your profile, company info, and Obsession Score
                  preferences.
                </p>
                <div className="feature-meta">
                  <div className="feature-meta-item">
                    <span>🎯</span>
                    <span>Customize</span>
                  </div>
                </div>
              </Link>

              <div
                className="feature-card"
                style={{ opacity: 0.6, cursor: "not-allowed" }}
              >
                <div className="feature-header">
                  <div className="feature-icon">✍️</div>
                  <div>
                    <h3 className="feature-title">
                      Expert Writers
                      <span className="feature-badge beta">PRO</span>
                    </h3>
                  </div>
                </div>
                <p className="feature-description">
                  AI writing team for high-quality content creation. Coming
                  soon!
                </p>
                <div className="feature-meta">
                  <div className="feature-meta-item">
                    <span>🔒</span>
                    <span>Upgrade required</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h2 className="quick-actions-title">Quick Actions</h2>
              <div className="actions-grid">
                <Link href="/portal/research-swarms" className="action-btn">
                  🔬 Create Research Goal
                </Link>
                <Link
                  href="/portal/strategy-cohorts"
                  className="action-btn secondary"
                >
                  🎯 Quick Analysis
                </Link>
                <Link
                  href="/portal/smart-trackers"
                  className="action-btn secondary"
                >
                  📊 View Trackers
                </Link>
                <Link href="/portal/settings" className="action-btn secondary">
                  ⚙️ Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
