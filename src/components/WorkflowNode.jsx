import React from "react";

export default function WorkflowNode({
  nodeId,
  workflow,
  onAdd,
  onDelete,
  onEdit
}) {
  const node = workflow.nodes[nodeId];
  if (!node) return null;

  return (
    <div className="node-wrapper">
      {/* NODE CARD */}
      <div className={`node-card ${node.type}`}>
        <strong>{node.type.toUpperCase()}</strong>

        <input
          value={node.label}
          onChange={(e) => onEdit(node.id, e.target.value)}
        />

        <div className="btn-group">
          {node.type !== "end" && (
            <>
              <button onClick={() => onAdd(node.id, "action")}>
                + Action
              </button>
              <button onClick={() => onAdd(node.id, "branch")}>
                + Branch
              </button>
              <button onClick={() => onAdd(node.id, "end")}>
                + End
              </button>
            </>
          )}

          {node.id !== "start" && (
            <button onClick={() => onDelete(node.id)}>
              Delete
            </button>
          )}
        </div>
      </div>

      {/* START & ACTION → single outgoing path */}
      {(node.type === "start" || node.type === "action") &&
        node.children?.main && (
          <WorkflowNode
            nodeId={node.children.main}
            workflow={workflow}
            onAdd={onAdd}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        )}

      {/* BRANCH → two outgoing paths */}
      {node.type === "branch" && (
        <div className="branch-row">
          {/* TRUE PATH */}
          <div>
            <strong>TRUE</strong>
            <button onClick={() => onAdd(node.id, "action", "true")}>
              + Action
            </button>

            {node.children?.true && (
              <WorkflowNode
                nodeId={node.children.true}
                workflow={workflow}
                onAdd={onAdd}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            )}
          </div>

          {/* FALSE PATH */}
          <div>
            <strong>FALSE</strong>
            <button onClick={() => onAdd(node.id, "action", "false")}>
              + Action
            </button>

            {node.children?.false && (
              <WorkflowNode
                nodeId={node.children.false}
                workflow={workflow}
                onAdd={onAdd}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
