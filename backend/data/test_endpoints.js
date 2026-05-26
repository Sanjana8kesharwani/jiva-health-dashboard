import http from 'http';
import app from '../server.js';
import User from '../models/User.js';

// Configuration for testing
const TEST_PORT = 5002;
let serverInstance;
let adminToken = '';
let patientToken = '';
let patientId = '';

const startServer = () => {
  return new Promise((resolve) => {
    serverInstance = app.listen(TEST_PORT, () => {
      console.log(`\n--- Test Server started on port ${TEST_PORT} ---`);
      resolve();
    });
  });
};

const closeServer = () => {
  return new Promise((resolve) => {
    if (serverInstance) {
      serverInstance.close(() => {
        console.log('--- Test Server stopped ---\n');
        resolve();
      });
    } else {
      resolve();
    }
  });
};

// Helper function to make HTTP requests
const makeRequest = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: parsed,
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
};

const runTests = async () => {
  try {
    console.log('Starting endpoint tests...');

    // Test 1: Public Test Endpoint
    console.log('\nTest 1: GET /api/test (Public Connection Check)');
    const testRes = await makeRequest({
      hostname: 'localhost',
      port: TEST_PORT,
      path: '/api/test',
      method: 'GET',
    });
    console.log(`Status: ${testRes.statusCode}`);
    console.log(`Body:`, testRes.body);
    if (testRes.statusCode !== 200 || !testRes.body.success) {
      throw new Error('Test 1 Failed');
    }

    // Test 2: Admin Login
    console.log('\nTest 2: POST /api/auth/login (Admin User)');
    const adminLoginRes = await makeRequest(
      {
        hostname: 'localhost',
        port: TEST_PORT,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      {
        email: 'admin@jivahealth.com',
        password: 'adminpassword123',
      }
    );
    console.log(`Status: ${adminLoginRes.statusCode}`);
    console.log(`Role: ${adminLoginRes.body.data.role}`);
    console.log(`Token received: ${adminLoginRes.body.data.token ? 'Yes' : 'No'}`);
    if (adminLoginRes.statusCode !== 200 || !adminLoginRes.body.data.token) {
      throw new Error('Test 2 Failed');
    }
    adminToken = adminLoginRes.body.data.token;

    // Test 3: Patient Login
    console.log('\nTest 3: POST /api/auth/login (Patient User)');
    const patientLoginRes = await makeRequest(
      {
        hostname: 'localhost',
        port: TEST_PORT,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      {
        email: 'john.doe@example.com',
        password: 'patientpassword123',
      }
    );
    console.log(`Status: ${patientLoginRes.statusCode}`);
    console.log(`Role: ${patientLoginRes.body.data.role}`);
    console.log(`Token received: ${patientLoginRes.body.data.token ? 'Yes' : 'No'}`);
    if (patientLoginRes.statusCode !== 200 || !patientLoginRes.body.data.token) {
      throw new Error('Test 3 Failed');
    }
    patientToken = patientLoginRes.body.data.token;
    patientId = patientLoginRes.body.data._id;

    // Test 4: Get All Users with Admin Token
    console.log('\nTest 4: GET /api/users (Access list with Admin credentials)');
    const usersRes = await makeRequest({
      hostname: 'localhost',
      port: TEST_PORT,
      path: '/api/users',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    console.log(`Status: ${usersRes.statusCode}`);
    console.log(`Users returned count: ${usersRes.body.count}`);
    if (usersRes.statusCode !== 200 || !usersRes.body.success) {
      throw new Error('Test 4 Failed');
    }

    // Test 5: Get All Users with Patient Token (Should FAIL - 403 Forbidden)
    console.log('\nTest 5: GET /api/users (Access list with Patient credentials - Unauthorized)');
    const usersResPatient = await makeRequest({
      hostname: 'localhost',
      port: TEST_PORT,
      path: '/api/users',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${patientToken}`,
      },
    });
    console.log(`Status: ${usersResPatient.statusCode}`);
    console.log(`Error message: ${usersResPatient.body.message}`);
    if (usersResPatient.statusCode !== 403) {
      throw new Error('Test 5 Failed - Expected 403 Forbidden status code');
    }

    // Test 6: Get Logged In User Profile (Me)
    console.log('\nTest 6: GET /api/auth/me (Get profile details)');
    const meRes = await makeRequest({
      hostname: 'localhost',
      port: TEST_PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${patientToken}`,
      },
    });
    console.log(`Status: ${meRes.statusCode}`);
    console.log(`User name: ${meRes.body.data.fullName}`);
    if (meRes.statusCode !== 200 || meRes.body.data.email !== 'john.doe@example.com') {
      throw new Error('Test 6 Failed');
    }

    // Test 7: Add Address to Patient's list
    console.log('\nTest 7: POST /api/users/:id/addresses (Add new address to profile)');
    const newAddressRes = await makeRequest(
      {
        hostname: 'localhost',
        port: TEST_PORT,
        path: `/api/users/${patientId}/addresses`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${patientToken}`,
          'Content-Type': 'application/json',
        },
      },
      {
        type: 'Work',
        addressLine: '999 Corporate Blvd',
        city: 'Metropolis',
        state: 'NY',
        pincode: '10022',
        isDefault: false,
      }
    );
    console.log(`Status: ${newAddressRes.statusCode}`);
    console.log(`Message: ${newAddressRes.body.message}`);
    console.log(`Total addresses: ${newAddressRes.body.data.length}`);
    if (newAddressRes.statusCode !== 201 || newAddressRes.body.data.length !== 3) {
      throw new Error('Test 7 Failed');
    }

    // Test 8: Get Orders
    console.log('\nTest 8: GET /api/orders (Fetch user orders list)');
    const ordersRes = await makeRequest({
      hostname: 'localhost',
      port: TEST_PORT,
      path: '/api/orders',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${patientToken}`,
      },
    });
    console.log(`Status: ${ordersRes.statusCode}`);
    console.log(`Orders found: ${ordersRes.body.count}`);
    if (ordersRes.statusCode !== 200 || ordersRes.body.count < 1) {
      throw new Error('Test 8 Failed');
    }

    console.log('\n=======================================');
    console.log('ALL TESTS PASSED SUCCESSFULLY! ✅');
    console.log('=======================================\n');
  } catch (error) {
    console.error('\n❌ TEST RUN FAILED:', error.message);
    process.exit(1);
  }
};

// Main runner flow
(async () => {
  await startServer();
  await runTests();
  await closeServer();
  process.exit(0);
})();
