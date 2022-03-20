/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	setupFilesAfterEnv: ['./jest.setup.js'],
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
}
