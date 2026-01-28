# Workflow Builder (Frontend Assignment)

A visual workflow builder built using **React + Vite**, allowing users to create dynamic workflows with actions, branches, undo/redo functionality, and exportable JSON output.

This project was built as part of a frontend assignment and focuses on **clean state management**, **recursive rendering**, and **user-friendly interaction**.

---

## ✨ Features

- Start, Action, Branch, and End nodes
- Conditional branching (true / false paths)
- Recursive workflow rendering
- Delete node with automatic relinking
- Undo & Redo support (bonus feature)
- Save workflow as JSON (bonus feature)
- Clean, modular React architecture

---

## 🧠 Workflow Model

The workflow is stored as a **graph-like JSON structure**:

- Each node has a unique ID
- Nodes reference children via IDs
- Branch nodes support `true` and `false` paths
- The entire workflow is serializable and backend-ready

Example (simplified):

```json
{
  "rootId": "start",
  "nodes": {
    "start": {
      "type": "start",
      "children": {
        "main": "node-1"
      }
    }
  }
}
