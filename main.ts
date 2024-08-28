import fs from 'fs';

interface GetRequest {
	queryString: string;
	expectedResponseCode: number;
	method: 'GET';
	headers?: Record<string, string>; // Optional headers
}

interface PostOrPutRequest {
	queryString: string;
	expectedResponseCode: number;
	method: 'POST' | 'PUT';
	body: any; // Required request body
	headers?: Record<string, string>; // Optional headers
	contentType?: string; // Optional content type
}

type TestCase = GetRequest | PostOrPutRequest;

function toBrunoString(testCase: TestCase): string {
	let result = `${testCase.method.toLowerCase()} {\n\turl: ${testCase.queryString}\n}\n\n`;

	if (testCase.headers) {
		result += `headers {\n`;

		if ((testCase.method === "POST" || testCase.method === "PUT") && testCase.contentType) {
			result += `\tcontent-type: ${testCase.contentType}\n`;
		}

		for (const key in testCase.headers) {
			result += `\t${key}: ${testCase.headers[key]}\n`;
		}

		result += '}\n\n';
	}

	if (testCase.method === "POST" || testCase.method === "PUT") {
		const bodyStringFormattedForBruno = JSON.stringify(testCase.body, null, 2).split('\n').map(line => '\t' + line).join('\n');
		result += `body {\n${bodyStringFormattedForBruno}\n}\n\n`;
	}

	return result;
}

function writeTestCasesInBruMarkdown(testCases: TestCase[], outputDirectory: string): void {
	for (let i = 0; i < testCases.length; ++i) {
		fs.writeFileSync(`${outputDirectory}/testcase-${i}.bru`, toBrunoString(testCases[i]));
	}
}

// Example usage:
const testCases: TestCase[] = [
	{
		queryString: 'https://jsonplaceholder.typicode.com/posts/1',
		expectedResponseCode: 200,
		method: 'GET',
		headers: { 'Authorization': 'Bearer some-token' }
	},
	{
		queryString: 'https://jsonplaceholder.typicode.com/posts',
		expectedResponseCode: 201,
		method: 'POST',
		body: { title: 'foo', body: 'bar', userId: 1 },
		headers: { 'Authorization': 'Bearer some-token' },
		contentType: 'application/json'
	},
	{
		queryString: 'https://jsonplaceholder.typicode.com/posts/1',
		expectedResponseCode: 200,
		method: 'PUT',
		body: { id: 1, title: 'updated', body: 'bar', userId: 1 },
		contentType: 'application/json'
	}
];

writeTestCasesInBruMarkdown(testCases, "TestCases");
