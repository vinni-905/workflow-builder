export function createNode(type) {
  const id = crypto.randomUUID();

  if (type === "action") {
    return {
      id,
      type,
      label: "New Action",
      children: { main: null }
    };
  }

  if (type === "branch") {
    return {
      id,
      type,
      label: "Condition",
      children: { true: null, false: null }
    };
  }

  if (type === "end") {
    return {
      id,
      type,
      label: "End",
      children: {}
    };
  }

  return null;
}
