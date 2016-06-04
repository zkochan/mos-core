import {Parser, Decoder, SimpleParser} from './parser'
import Tokenizer from './tokenizer';
import runAsync from 'babel-run-async'
import {Node} from '../node'

const tryTokenize = (parser: Parser, tokenizerName: string, subvalue: string, silent: boolean): Promise<boolean> =>
 runAsync(parser.blockTokenizers.find(t => t.name === tokenizerName).func)(parser, subvalue, silent)

export default tryTokenize
