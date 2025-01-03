import { CompilerConfig } from '@ton/blueprint';

// blueprint build 会在 wrappers 目录查询 *.compile.ts 文件
export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/NOT_EXIST.fc'],
};
