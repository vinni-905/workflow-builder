import React, { useState } from "react";
import WorkflowNode from "./components/WorkflowNode";
import { initialWorkflow } from "./data/initialWorkflow";
import { createNode } from "./utils/nodeFactory";
import "./App.css";

export default function App() {
  const [workflow, setWorkflow] = useState(initialWorkflow);

  // Undo / Redo stacks
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  /**
   * Commit helper (ONLY for user actions)
   */
  const commit = (newWorkflow) => {
    setPast((p) => [...p, workflow]);
    setWorkflow(newWorkflow);
    setFuture([]); // clear redo on new action
  };

  /**
   * Add node (append at end of path)
   */
  const addNode = (parentId, type, branchKey = "main") => {
    const newNode = createNode(type);

    const newWorkflow = (() => {
      const nodes = { ...workflow.nodes };

      let currentId = parentId;
      let currentNode = nodes[currentId];

      while (
        currentNode.children &&
        currentNode.children[branchKey]
      ) {
        currentId = currentNode.children[branchKey];
        currentNode = nodes[currentId];
      }

      nodes[newNode.id] = newNode;
      nodes[currentId] = {
        ...nodes[currentId],
        children: {
          ...nodes[currentId].children,
          [branchKey]: newNode.id
        }
      };

      return { ...workflow, nodes };
    })();

    commit(newWorkflow);
  };

  /**
   * Edit node label
   */
  const editNode = (nodeId, label) => {
    commit({
      ...workflow,
      nodes: {
        ...workflow.nodes,
        [nodeId]: {
          ...workflow.nodes[nodeId],
          label
        }
      }
    });
  };

  /**
   * Delete node and reconnect flow
   */
  const deleteNode = (nodeId) => {
    if (nodeId === "start") return;

    const newWorkflow = (() => {
      const nodes = { ...workflow.nodes };
      const target = nodes[nodeId];

      const parentId = Object.keys(nodes).find((id) =>
        Object.values(nodes[id].children || {}).includes(nodeId)
      );

      if (!parentId) return workflow;

      const parent = nodes[parentId];

      Object.keys(parent.children).forEach((key) => {
        if (parent.children[key] === nodeId) {
          parent.children[key] =
            target.children?.main ??
            target.children?.true ??
            target.children?.false ??
            null;
        }
      });

      delete nodes[nodeId];

      return { ...workflow, nodes };
    })();

    commit(newWorkflow);
  };

  /**
   * UNDO
   */
  const undo = () => {
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [workflow, ...f]);
    setWorkflow(previous);
  };

  /**
   * REDO
   */
  const redo = () => {
    if (future.length === 0) return;

    const next = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, workflow]);
    setWorkflow(next);
  };

  /**
   * SAVE (console log)
   */
  const saveWorkflow = () => {
    console.log("Workflow JSON:");
    console.log(JSON.stringify(workflow, null, 2));
    alert("Workflow saved to console");
  };

  return (
    <div className="canvas">
      {/* TOP BAR */}
      <div className="save-bar">
        <button onClick={undo} disabled={!past.length}>
          Undo
        </button>
        <button onClick={redo} disabled={!future.length}>
          Redo
        </button>
        <button onClick={saveWorkflow}>
          Save
        </button>
      </div>

      {/* WORKFLOW CANVAS */}
      <WorkflowNode
        nodeId={workflow.rootId}
        workflow={workflow}
        onAdd={addNode}
        onDelete={deleteNode}
        onEdit={editNode}
      />
    </div>
  );
}
