import {Parser, Decoder, SimpleParser} from './parser' // tslint:disable-line
import Tokenizer from './tokenizer'; // tslint:disable-line
import runAsync from 'babel-run-async'
import {Node} from '../node' // tslint:disable-line

const tryTokenize = (parser: Parser, tokenizerName: string, subvalue: string, silent: boolean): Promise<boolean> =>
 runAsync(parser.blockTokenizers.find(t => t.name === tokenizerName).func)(parser, subvalue, silent)

export default tryTokenize
