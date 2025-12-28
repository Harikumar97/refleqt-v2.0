"use client";

import { useState, useEffect } from "react";

/**
 * KnowledgeTraverseHierarchy Component
 * Displays hierarchical knowledge structure: Strategic → Tactical → Operational
 * Helps users navigate insights by priority and scope
 */

interface KnowledgeNode {
  id: string;
  nodeTitle: string;
  nodeContent: string;
  hierarchyLevel: "strategic" | "tactical" | "operational";
  depth: number;
  insightIds: string[];
  relevanceScore: number;
  parentNodeId: string | null;
}

interface KnowledgeTraverseHierarchyProps {
  userId: string;
  swarmId?: string;
  onNodeSelect?: (node: KnowledgeNode) => void;
}

export function KnowledgeTraverseHierarchy({
  userId,
  swarmId,
  onNodeSelect,
}: KnowledgeTraverseHierarchyProps) {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedLevel, setSelectedLevel] = useState<
    "all" | "strategic" | "tactical" | "operational"
  >("all");

  useEffect(() => {
    fetchHierarchy();
  }, [userId, swarmId]);

  async function fetchHierarchy() {
    try {
      const url = swarmId
        ? `/api/knowledge-hierarchy?userId=${userId}&swarmId=${swarmId}`
        : `/api/knowledge-hierarchy?userId=${userId}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch hierarchy");
      }

      const data = await response.json();
      if (data.success) {
        setNodes(data.data.nodes);
        // Auto-expand strategic level
        const strategicIds = data.data.nodes
          .filter((n: KnowledgeNode) => n.hierarchyLevel === "strategic")
          .map((n: KnowledgeNode) => n.id);
        setExpandedNodes(new Set(strategicIds));
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching hierarchy:", err);
      setError("Failed to load knowledge hierarchy");
    } finally {
      setLoading(false);
    }
  }

  function toggleNode(nodeId: string) {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  }

  function getNodesByLevel(level: "strategic" | "tactical" | "operational") {
    return nodes.filter((n) => n.hierarchyLevel === level);
  }

  function getChildNodes(parentId: string) {
    return nodes.filter((n) => n.parentNodeId === parentId);
  }

  function getLevelConfig(level: string) {
    switch (level) {
      case "strategic":
        return {
          color: "#667eea",
          bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          icon: "🎯",
          label: "Strategic",
          description: "High-level insights and direction",
        };
      case "tactical":
        return {
          color: "#f5576c",
          bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          icon: "⚡",
          label: "Tactical",
          description: "Mid-level recommendations",
        };
      case "operational":
        return {
          color: "#00f2fe",
          bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          icon: "🔧",
          label: "Operational",
          description: "Actionable tasks and steps",
        };
      default:
        return {
          color: "#9ca3af",
          bgGradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
          icon: "📊",
          label: "Unknown",
          description: "",
        };
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Building knowledge hierarchy...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            gap: 16px;
          }

          .spinner {
            width: 48px;
            height: 48px;
            border: 4px solid rgba(102, 126, 234, 0.1);
            border-top-color: #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .loading-container p {
            color: #9ca3af;
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button onClick={fetchHierarchy} className="retry-button">
          Retry
        </button>
        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 20px;
            gap: 12px;
          }

          .error-icon {
            font-size: 48px;
          }

          .error-container p {
            color: #ef4444;
            font-size: 14px;
          }

          .retry-button {
            padding: 8px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  const strategicNodes = getNodesByLevel("strategic");
  const tacticalNodes = getNodesByLevel("tactical");
  const operationalNodes = getNodesByLevel("operational");

  return (
    <div className="hierarchy-container">
      <div className="hierarchy-header">
        <div className="header-title">
          <span className="header-icon">🌳</span>
          <h2>Knowledge Traverse</h2>
        </div>
        <p className="header-subtitle">
          Navigate insights by strategic priority
        </p>
      </div>

      {/* Level Filter */}
      <div className="level-filter">
        {["all", "strategic", "tactical", "operational"].map((level) => {
          const config = level === "all"
            ? { icon: "🌐", label: "All Levels" }
            : getLevelConfig(level);

          return (
            <button
              key={level}
              className={`filter-button ${selectedLevel === level ? "active" : ""}`}
              onClick={() => setSelectedLevel(level as any)}
            >
              <span className="filter-icon">{config.icon}</span>
              <span className="filter-label">{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Hierarchy Tree */}
      <div className="hierarchy-tree">
        {/* Strategic Level */}
        {(selectedLevel === "all" || selectedLevel === "strategic") && (
          <div className="level-section">
            <div className="level-header strategic-header">
              <span className="level-icon">🎯</span>
              <span className="level-title">Strategic</span>
              <span className="level-count">{strategicNodes.length}</span>
            </div>
            <div className="nodes-list">
              {strategicNodes.map((node) => (
                <NodeCard
                  key={node.id}
                  node={node}
                  isExpanded={expandedNodes.has(node.id)}
                  onToggle={() => toggleNode(node.id)}
                  onClick={() => onNodeSelect?.(node)}
                  childNodes={getChildNodes(node.id)}
                  config={getLevelConfig(node.hierarchyLevel)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tactical Level */}
        {(selectedLevel === "all" || selectedLevel === "tactical") && (
          <div className="level-section">
            <div className="level-header tactical-header">
              <span className="level-icon">⚡</span>
              <span className="level-title">Tactical</span>
              <span className="level-count">{tacticalNodes.length}</span>
            </div>
            <div className="nodes-list">
              {tacticalNodes.map((node) => (
                <NodeCard
                  key={node.id}
                  node={node}
                  isExpanded={expandedNodes.has(node.id)}
                  onToggle={() => toggleNode(node.id)}
                  onClick={() => onNodeSelect?.(node)}
                  childNodes={getChildNodes(node.id)}
                  config={getLevelConfig(node.hierarchyLevel)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Operational Level */}
        {(selectedLevel === "all" || selectedLevel === "operational") && (
          <div className="level-section">
            <div className="level-header operational-header">
              <span className="level-icon">🔧</span>
              <span className="level-title">Operational</span>
              <span className="level-count">{operationalNodes.length}</span>
            </div>
            <div className="nodes-list">
              {operationalNodes.map((node) => (
                <NodeCard
                  key={node.id}
                  node={node}
                  isExpanded={expandedNodes.has(node.id)}
                  onToggle={() => toggleNode(node.id)}
                  onClick={() => onNodeSelect?.(node)}
                  childNodes={getChildNodes(node.id)}
                  config={getLevelConfig(node.hierarchyLevel)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .hierarchy-container {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }

        .hierarchy-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .header-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .header-icon {
          font-size: 36px;
        }

        .hierarchy-header h2 {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .header-subtitle {
          color: #6b7280;
          font-size: 14px;
          margin: 0;
        }

        .level-filter {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
          padding: 16px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow-x: auto;
        }

        .filter-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .filter-button:hover {
          border-color: #8b5cf6;
          transform: translateY(-2px);
        }

        .filter-button.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
          color: white;
          box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.3);
        }

        .filter-icon {
          font-size: 18px;
        }

        .hierarchy-tree {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .level-section {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .level-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 16px;
          font-weight: 700;
          font-size: 16px;
        }

        .strategic-header {
          background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
          color: #667eea;
        }

        .tactical-header {
          background: linear-gradient(135deg, #f093fb15 0%, #f5576c15 100%);
          color: #f5576c;
        }

        .operational-header {
          background: linear-gradient(135deg, #4facfe15 0%, #00f2fe15 100%);
          color: #00f2fe;
        }

        .level-icon {
          font-size: 24px;
        }

        .level-title {
          flex: 1;
        }

        .level-count {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: white;
          border-radius: 50%;
          font-size: 13px;
          font-weight: 700;
        }

        .nodes-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        @media (max-width: 768px) {
          .level-filter {
            flex-wrap: nowrap;
            overflow-x: auto;
          }

          .filter-button {
            min-width: 140px;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * NodeCard Component
 * Displays individual knowledge node with expansion
 */
interface NodeCardProps {
  node: KnowledgeNode;
  isExpanded: boolean;
  onToggle: () => void;
  onClick: () => void;
  childNodes: KnowledgeNode[];
  config: {
    color: string;
    bgGradient: string;
    icon: string;
    label: string;
  };
}

function NodeCard({
  node,
  isExpanded,
  onToggle,
  onClick,
  childNodes,
  config,
}: NodeCardProps) {
  return (
    <div className="node-card">
      <div className="node-main" onClick={onClick}>
        <div className="node-header">
          <button
            className="expand-button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {isExpanded ? "▼" : "▶"}
          </button>
          <span className="node-icon">{config.icon}</span>
          <h4 className="node-title">{node.nodeTitle}</h4>
        </div>
        <p className="node-content">{node.nodeContent}</p>
        <div className="node-footer">
          <div className="node-badge">
            <span className="badge-label">Insights:</span>
            <span className="badge-value">{node.insightIds.length}</span>
          </div>
          <div className="node-badge">
            <span className="badge-label">Relevance:</span>
            <span className="badge-value">
              {(node.relevanceScore * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {isExpanded && childNodes.length > 0 && (
        <div className="child-nodes">
          {childNodes.map((child) => (
            <div key={child.id} className="child-node">
              <span className="child-icon">└─</span>
              <span className="child-title">{child.nodeTitle}</span>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .node-card {
          border-left: 4px solid ${config.color};
          background: white;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s;
        }

        .node-card:hover {
          box-shadow: 0 8px 12px -2px rgba(0, 0, 0, 0.1);
          transform: translateX(4px);
        }

        .node-main {
          padding: 16px;
          cursor: pointer;
        }

        .node-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .expand-button {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border: none;
          border-radius: 6px;
          font-size: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .expand-button:hover {
          background: ${config.bgGradient};
          color: white;
        }

        .node-icon {
          font-size: 20px;
        }

        .node-title {
          flex: 1;
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .node-content {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 12px 0;
          padding-left: 36px;
        }

        .node-footer {
          display: flex;
          gap: 16px;
          padding-left: 36px;
        }

        .node-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          border-radius: 8px;
        }

        .badge-label {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 500;
        }

        .badge-value {
          font-size: 13px;
          color: #111827;
          font-weight: 700;
        }

        .child-nodes {
          padding: 12px 16px 16px 52px;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          border-top: 1px solid #e5e7eb;
        }

        .child-node {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          color: #6b7280;
          font-size: 13px;
        }

        .child-icon {
          color: ${config.color};
          font-family: monospace;
          font-weight: 700;
        }

        .child-title {
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
