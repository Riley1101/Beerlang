/**
 * @param {number} line - report the line number
 * @param {string} message - report the message
 */
export function error(line: number, message: string): never{
    report(line, "", message, "error");
    throw new Error(message);
}

export function info(line: number, message: string) {
    report(line, "", message, "info");
}

type Log = "error" | "info";

/**
 * @param {number} line - report the line number
 * @param {string} where - report where the issue is
 * @param {string} message - report the message
 */
export function report(
    line: number,
    where: string,
    message: string,
    type: Log
) {
    console.log(`[${type}] --> [line ${line}] Error ${where}: ${message}`);
}
