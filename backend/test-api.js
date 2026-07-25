import http from 'http';

const testAPI = async () => {
  try {
    const apiUrl = 'http://localhost:5000/api';

    console.log('Testing Admin Seed...');
    const seedRes = await fetch(`${apiUrl}/admin/auth/seed`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'testing12345',
        secretKey: 'SHARDA_SECRET_INIT'
      })
    });
    const seedText = await seedRes.text();
    console.log(`Seed Status: ${seedRes.status}, Response: ${seedText}`);
    
    console.log('Testing User Registration...');
    const registerRes = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      })
    });
    const registerText = await registerRes.text();
    console.log(`Register Status: ${registerRes.status}, Response: ${registerText}`);
    
    console.log('Testing User Login...');
    const loginRes = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const loginText = await loginRes.text();
    console.log(`Login Status: ${loginRes.status}, Response: ${loginText}`);

    console.log('All API tests finished.');
  } catch (e) {
    console.error('Error during testing:', e);
  }
};

testAPI();
