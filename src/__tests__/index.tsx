import Nodesy, { factory } from '..'
import * as React from 'react'
import * as renderer from 'react-test-renderer'

const TypedHierarchy = factory()

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

type Props = {
  isExpanded: boolean
  typed?: boolean
}

class Hierarchy extends React.Component<Props> {
  state = {
    nodes: [
      {
        type: 'folder',
        data: { id: '123', name: 'whatup' },
        state: {
          isExpanded: this.props.isExpanded,
        },
        children: [
          {
            type: 'file',
            data: { id: '456', name: 'someName' },
          },
        ],
      },
    ],
  }
  render() {
    const Component = this.props.typed ? TypedHierarchy : Nodesy

    return (
      <Component
        data={this.state.nodes}
        types={{
          folder: Folder,
          file: File,
        }}
        onChange={(nodes) =>
          this.setState({
            nodes,
          })
        }
      />
    )
  }
}

it('renders correctly', () => {
  const tree = renderer.create(<Hierarchy isExpanded={false} />).toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders correctly with different state', () => {
  const tree = renderer.create(<Hierarchy isExpanded />).toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders correctly with factory', () => {
  const tree = renderer.create(<Hierarchy isExpanded typed />).toJSON()
  expect(tree).toMatchSnapshot()
})
