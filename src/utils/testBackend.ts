// Test backend connectivity
export const testBackendConnection = async () => {
  try {
    const response = await fetch('http://localhost:5089/api/auth/customer/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'test123'
      })
    });
    
    console.log('Backend Status:', response.status);
    console.log('Backend Response:', await response.text());
    return response.status !== 500;
  } catch (error) {
    console.error('Backend connection failed:', error);
    return false;
  }
};