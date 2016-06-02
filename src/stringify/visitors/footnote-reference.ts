import {Visitor} from '../visitor'

const visitor: Visitor = (compiler, node) => `[^${node.identifier}]`

export default visitor
