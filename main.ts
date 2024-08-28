import fetch, { RequestInit, Headers } from 'node-fetch';

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

async function runTestCase(testCase: TestCase): Promise<void> {
	try {
		const headers = new Headers();
		headers.set('Content-type', testCase.method !== 'GET' && testCase.contentType? testCase.contentType : 'application/json');
		if (testCase.headers) {
			for (const key in testCase.headers) {
				headers.set(key, testCase.headers[key]);
			}
		}

		const options: RequestInit = {
			method: testCase.method,
			headers: headers
		};

		if (testCase.method === 'POST' || testCase.method === 'PUT') {
			options.body = JSON.stringify(testCase.body);
		}

		const response = await fetch(testCase.queryString, options);
		const actualResponseCode = response.status;

		if (actualResponseCode === testCase.expectedResponseCode) {
			console.log(`Test passed for ${testCase.method} request: "${testCase.queryString}"`);
		} else {
			console.error(
				`Test failed for ${testCase.method} request: "${testCase.queryString}". ` +
					`Expected: ${testCase.expectedResponseCode}, ` +
					`but got: ${actualResponseCode}`
			);
		}
	} catch (error) {
		console.error(`Test failed for ${testCase.method} request: "${testCase.queryString}". Error: ${error}`);
	}
}

async function runAllTestCases(testCases: TestCase[]): Promise<void> {
	for (const testCase of testCases) {
		await runTestCase(testCase);
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

runAllTestCases(testCases);
