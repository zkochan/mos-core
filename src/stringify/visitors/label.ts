import {Node} from '../../node';

export default function label (node: Node): string {
  let value = ''

  if (node.referenceType === 'full') {
    value = node.identifier
  }

  if (node.referenceType !== 'shortcut') {
    value = `[${value}]`
  }

  return value
};
