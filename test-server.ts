// Simple server test script
import axios, { AxiosError } from 'axios';

const testServer = async () => {
  try {
    console.log('🧪 Testing Quantum Charts Server...\n');
    
    // Test health endpoint
    console.log('📡 Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:3001/health');
    console.log('✅ Health Check Response:', JSON.stringify(healthResponse.data, null, 2));
    
    // Test market endpoint (should work without auth)
    console.log('\n📊 Testing market endpoint...');
    try {
      const marketResponse = await axios.get('http://localhost:3001/api/market/stocks/AAPL');
      console.log('✅ Market Data Response:', JSON.stringify(marketResponse.data, null, 2));
    } catch (error) {
        const err = error as AxiosError;
      console.log('📊 Market endpoint response:', err.response?.status, err.response?.data);
    }
    
    // Test auth endpoint (should require authentication)
    console.log('\n🔐 Testing auth endpoint...');
    try {
      const authResponse = await axios.get('http://localhost:3001/api/auth/me');
      console.log('✅ Auth Response:', authResponse.data);
    } catch (error) {
        const err = error as AxiosError;
      console.log('🔐 Auth endpoint (expected 401):', err.response?.status, err.response?.data);
    }
    
    console.log('\n🎉 Server tests completed!');
    
  } catch (error) {
    const err = error as AxiosError;
    console.error('❌ Server test failed:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running with: npm run server:dev');
    }
  }
};

testServer();