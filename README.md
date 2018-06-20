# react-nodesy

[![Greenkeeper badge](https://badges.greenkeeper.io/christianalfoni/react-nodesy.svg)](https://greenkeeper.io/)

[![Build Status](https://img.shields.io/travis/christianalfoni/react-nodesy/master.svg)](https://travis-ci.org/christianalfoni/react-nodesy)
[![Coverage Status](https://img.shields.io/coveralls/christianalfoni/react-nodesy/master.svg)](https://coveralls.io/github/christianalfoni/react-nodesy?branch=master)
[![Dependency Status](https://img.shields.io/david/christianalfoni/react-nodesy.svg)](https://david-dm.org/christianalfoni/react-nodesy)
[![devDependency Status](https://img.shields.io/david/dev/christianalfoni/react-nodesy.svg)](https://david-dm.org/christianalfoni/react-nodesy?type=dev)

`npm install react-nodesy`

## Render a hierarchy of nodes

```js
import React from 'react'
import Nodesy from 'react-nodesy'

const Folder = ({ key, data, state, setNodeState, children }) => {
  return (
    <div className="folder" key={key}>
      <div className="name">{data.name}</div>
      <div
        className="folder-files"
        onClick={() => setNodeState({ isExpanded: !state.isExpanded })}
      >
        {state.isExpanded ? children : null}
      </div>
    </div>
  )
}

const File = ({ key, data }) => {
  return (
    <div className="file" key={key}>
      {data.name}
    </div>
  )
}

class Hierarchy extends React.Component {
  state = {
    nodes: [{
      type: 'folder',
      data: { id: '123', name: 'whatup' },
      state: {
        isExpanded: false
      },
      children: [{
        type: 'file',
        data: { id: '456', name: 'someName' }
      }]
    }]
  }
  render () {
    return (
      <Nodesy
        data={this.state.nodes}
        types={{
          folder: Folder,
          file: File
        }}
        onChange={(nodes) => this.setState({
          nodes
        })}
      />
    )
  }
}

export default Hierarchy
```

**Note!** Each node requires data with an "id" property related to them!

The following properties are passed to each node:

- **key**: They key to be used with the root element
- **setNodeState**: Callback to change the state of the node
- **data**: The data related to the node
- **state**: The state related to the node
- **children**: The child nodes of the node, think of it as component props
- **parent**: The parent node,
- **depth**: The depth of the node (0, 1, 2 etc.). Typically used for indenting

## Typescript

```ts
import React from 'react'
import { factory, NodeProps, HierarchyData } from 'react-nodesy'

type NodeData = {
  name: string
}

type NodeState = {
  isExpanded: boolean
}

type TreeNodeProps = NodeProps<NodeData, NodeState>

type TreeHierarchy = HierarchyData<NodeData, NodeState>

const Nodesy = factory<NodeData, NodeState>()

const Folder: React.SFC<TreeNodeProps> = ({ key, data, state, setNodeState, children }) => {
  return (
    <div className="folder" key={key}>
      <div className="name">{data.name}</div>
      <div
        className="folder-files"
        onClick={() => setNodeState({ isExpanded: !state.isExpanded })}
      >
        {state.isExpanded ? children : null}
      </div>
    </div>
  )
}

const File: React.SFC<TreeNodeProps> = ({ key, data }) => {
  return (
    <div className="file" key={key}>
      {data.name}
    </div>
  )
}

type Props = {}

type State = {
  nodes: TreeHierarchy
}

class Hierarchy extends React.Component<Props, State> {
  state = {
    nodes: [{
      type: 'folder',
      data: { id: '123', name: 'whatup' },
      state: {
        isExpanded: false
      },
      children: [{
        type: 'file',
        data: { id: '456', name: 'someName' }
      }]
    }]
  }
  render () {
    return (
      <Nodesy
        data={this.state.nodes}
        types={{
          folder: Folder,
          file: File
        }}
        onChange={(nodes) => this.setState({
          nodes
        })}
      />
    )
  }
}

export default Hierarchy
```