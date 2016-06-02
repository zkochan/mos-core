import runAsync from 'babel-run-async'

export default (parser, tokenizerName, subvalue, silent) =>
 runAsync(parser.blockTokenizers.find(t => t.name === tokenizerName).func)(parser, subvalue, silent)
