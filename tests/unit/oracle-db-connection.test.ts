/**
 * Unit tests for OracleDBHelper Database Connection.
 * These tests verify that the database is actually running and accessible.
 * Useful for CI to confirm the database is deployed correctly.
 * 
 * Run with: npx tsx tests/unit/oracle-db-connection.test.ts
 */

import { OracleDBHelper } from '../../src/utils/oracle-db.helper';
import { config } from '../../src/config/env.config';

interface TestResult {
    passed: number;
    failed: number;
    errors: string[];
}

const result: TestResult = {
    passed: 0,
    failed: 0,
    errors: [],
};

async function assert(condition: boolean, message: string) {
    if (!condition) {
        result.failed++;
        result.errors.push(`FAIL: ${message}`);
        console.error(`[FAIL] ${message}`);
    } else {
        result.passed++;
        console.log(`[PASS] ${message}`);
    }
}

async function assertEqual<T>(actual: T, expected: T, message: string) {
    if (actual !== expected) {
        result.failed++;
        result.errors.push(`FAIL: ${message} - Expected ${expected}, got ${actual}`);
        console.error(`[FAIL] ${message} - Expected ${expected}, got ${actual}`);
    } else {
        result.passed++;
        console.log(`[PASS] ${message}`);
    }
}

async function runTests() {
    console.log('\n=== Oracle Database Connection Tests ===\n');

    let db: OracleDBHelper;

    try {
        // Test 1: Connect to Oracle Database
        console.log('Test 1: should connect to Oracle Database');
        db = new OracleDBHelper();
        try {
            await db.connect();
            await assert(true, 'Successfully connected to Oracle Database');
            await db.close();
        } catch (error) {
            await assert(false, `Failed to connect: ${error}`);
            process.exit(1);
        }

        // Test 2: Execute a simple query on database
        console.log('\nTest 2: should execute a simple query on database');
        db = new OracleDBHelper();
        try {
            await db.connect();
            const result = await db.query<{ BANNER: string }>(
                "SELECT * FROM v$version WHERE BANNER LIKE 'Oracle%' AND ROWNUM = 1"
            );
            await assert(result.length === 1, 'Query returned exactly 1 row');
            await assert(
                result[0].BANNER.includes('Oracle'),
                `Oracle Version: ${result[0].BANNER}`
            );
            await db.close();
        } catch (error) {
            await assert(false, `Query execution failed: ${error}`);
        }

        // Test 3: Get current date from database
        console.log('\nTest 3: should get current date from database');
        db = new OracleDBHelper();
        try {
            await db.connect();
            const queryResult = await db.query<{ CURRENT_DATE: string }>(
                'SELECT TRUNC(SYSDATE) AS CURRENT_DATE FROM DUAL'
            );
            await assert(queryResult.length === 1, 'Query returned exactly 1 row');
            await assert(
                queryResult[0].CURRENT_DATE.length > 0,
                `Database Date: ${queryResult[0].CURRENT_DATE}`
            );
            await db.close();
        } catch (error) {
            await assert(false, `Date query failed: ${error}`);
        }

        // Test 4: Verify connection string is properly configured
        console.log('\nTest 4: should verify connection string is properly configured');
        db = new OracleDBHelper();
        try {
            const connectionString = config.db.connectionString;
            await assert(
                connectionString.length > 0,
                `Connection String: ${connectionString}`
            );
            await assert(
                connectionString.includes(':'),
                'Connection string contains host:port format'
            );
            await assert(
                connectionString.includes(config.db.serviceName),
                `Service name configured: ${config.db.serviceName}`
            );
        } catch (error) {
            await assert(false, `Connection string verification failed: ${error}`);
        }

        // Test 5: Connect and disconnect without errors
        console.log('\nTest 5: should connect and disconnect without errors');
        db = new OracleDBHelper();
        try {
            await db.connect();
            await db.close();
            await assert(true, 'Successfully connected and disconnected');
        } catch (error) {
            await assert(false, `Connection lifecycle failed: ${error}`);
        }

        // Test 6: Handle multiple queries in sequence
        console.log('\nTest 6: should handle multiple queries in sequence');
        db = new OracleDBHelper();
        try {
            await db.connect();

            const versionResult = await db.query<{ BANNER: string }>(
                "SELECT * FROM v$version WHERE BANNER LIKE 'Oracle%' AND ROWNUM = 1"
            );
            await assert(versionResult.length > 0, 'Version query executed');

            const dateResult = await db.query<{ CURRENT_DATE: string }>(
                'SELECT TRUNC(SYSDATE) AS CURRENT_DATE FROM DUAL'
            );
            await assert(dateResult.length > 0, 'Date query executed');

            const userResult = await db.query<{ USERNAME: string }>(
                'SELECT USER AS USERNAME FROM DUAL'
            );
            await assert(userResult.length > 0, 'User query executed');

            await assert(true, 'All sequential queries executed successfully');
            await db.close();
        } catch (error) {
            await assert(false, `Sequential query execution failed: ${error}`);
        }

        // Test 7: Verify database is accessible with configured credentials
        console.log('\nTest 7: should verify database is accessible with configured credentials');
        db = new OracleDBHelper();
        try {
            await db.connect();
            const userResult = await db.query<{ USERNAME: string }>(
                'SELECT USER AS USERNAME FROM DUAL'
            );
            await assert(userResult.length === 1, 'User query returned 1 row');
            const connectedUser = userResult[0].USERNAME;
            await assert(true, `Connected as user: ${connectedUser}`);
            await db.close();
        } catch (error) {
            await assert(false, `Database access verification failed: ${error}`);
        }
    } catch (error) {
        console.error('\nUnexpected error during tests:', error);
        result.errors.push(`Unexpected error: ${error}`);
        process.exit(1);
    }

    // Print summary
    console.log('\n=== Test Summary ===');
    console.log(`Passed: ${result.passed}`);
    console.log(`Failed: ${result.failed}`);
    console.log(`Total: ${result.passed + result.failed}`);

    if (result.failed > 0) {
        console.log('\nFailed Tests:');
        result.errors.forEach((error) => console.log(`  - ${error}`));
        process.exit(1);
    } else {
        console.log('\n[PASS] All tests passed!');
        process.exit(0);
    }
}

// Run tests
runTests().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
