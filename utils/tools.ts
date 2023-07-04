import { BinaryExpr, } from "./ast";
import { Token } from "./token";

/** 
 * @todo testing on BinaryExpr
 */
export function inOrderTraverseBinaryExpr(tokens: BinaryExpr[], arr: Token[]): Token[] {
    if (tokens.length === 0) return arr;
    let current = tokens.shift() as BinaryExpr;
    if (current?.left) {
        arr = inOrderTraverseBinaryExpr(current.left as any, arr);
    }
    arr.push(current?.operator)
    if (current?.right) {
        arr = inOrderTraverseBinaryExpr(current.right as any, arr);
    }
    return arr
}
