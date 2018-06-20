import * as React from 'react'

export type HierarchyData<NodeData, NodeState> = {
  type: string
  state: NodeState
  data: { id: string } & NodeData
  children: HierarchyData<NodeData, NodeState>[]
}

export type NodeProps<NodeData, NodeState> = {
  key: string
  setNodeState: (state: Partial<NodeState>) => void
  state: NodeState
  data: { id: string } & NodeData
  children: React.ReactNode[]
  parent: HierarchyData<NodeData, NodeState>
  depth: number
}

export type Props<NodeData, NodeState> = {
  data: HierarchyData<NodeData, NodeState>[]
  types: {
    [type: string]: (props: NodeProps<NodeData, NodeState>) => React.ReactNode
  }
  onChange: (data: HierarchyData<NodeData, NodeState>[]) => void
}

function renderChildren(parent, types, setNodeState, depth) {
  if (!parent.children) {
    return null
  }

  return parent.children.map((child) => {
    return types[child.type]({
      key: child.data.id,
      setNodeState: setNodeState.bind(null, child.data.id),
      data: child.data,
      state: child.state,
      children: renderChildren(child, types, setNodeState, depth + 1),
      parent,
      depth,
    })
  })
}

// Will change out references for the whole hierarchy. Just
// cleaner code and does not matter. Components can check if
// they should rerender based on node state
function updateHierarchy(data, id, state) {
  return data.reduce((children, node) => {
    return children.concat({
      ...node,
      state:
        node.data.id === id ? Object.assign(node.state, state) : node.state,
      children: updateHierarchy(node.children, id, state),
    })
  }, [])
}

export function factory<NodeData = {}, NodeState = {}>() {
  const Hierarchy: React.SFC<Props<NodeData, NodeState>> = ({
    data,
    types,
    onChange,
  }) => {
    const setNodeState = (id, state: NodeState) => {
      onChange(updateHierarchy(data, id, state))
    }

    return renderChildren(
      {
        type: 'root',
        children: data,
      },
      types,
      setNodeState,
      0
    )
  }

  return Hierarchy
}

export default ({ data, types, onChange }) => {
  const setNodeState = (id, state) => {
    onChange(updateHierarchy(data, id, state))
  }

  return renderChildren(
    {
      type: 'root',
      children: data,
    },
    types,
    setNodeState,
    0
  )
}
