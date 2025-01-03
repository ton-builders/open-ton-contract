// 计算字符串的 CRC32c 并以 16 进制返回
import { crc32c } from '@ton/core';
// 显式字节翻转函数
function reverseBytes(buffer: Buffer): Buffer {
    return Buffer.from(buffer).reverse();
}

// 计算字符串的 CRC32c 并进行字节翻转
export function crc32cHex(input: string): string {
    const buffer = Buffer.from(input, 'utf-8');
    const crcBuffer = crc32c(buffer);
    const reversed = reverseBytes(crcBuffer); // 翻转字节顺序
    return '0x' + reversed.toString('hex');
}

// 示例用法
const opIncrease = "op::increase";
const opDecrease = "op::decrease";

console.log(`${opIncrease} = ${crc32cHex(opIncrease)}`);
console.log(`${opDecrease} = ${crc32cHex(opDecrease)}`);