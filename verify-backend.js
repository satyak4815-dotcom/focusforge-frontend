import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config({ path: '.env.local' });

async function verify() {
  let apiUrl = process.env.VITE_API_URL || 'http://localhost:3000/api';
  if (apiUrl === '/api') {
    apiUrl = 'https://focusforge-backend-jsji.onrender.com/api';
  }
  console.log('Testing backend at:', apiUrl);
  
  try {
    // Attempt Kid Create
    const kidname = 'testkid_' + Date.now();
    console.log(`\n[1] Creating kid ${kidname}...`);
    const kidCreateRes = await axios.post(`${apiUrl}/auth/register`, {
      username: kidname,
      email: `${kidname}@example.com`,
      password: 'password123'
    });
    console.log('Kid creation SUCCESS:', kidCreateRes.data);

    // Attempt Parent Create
    const username = 'testparent_' + Date.now();
    console.log(`\n[2] Creating parent ${username}...`);
    const createRes = await axios.post(`${apiUrl}/parents/register`, {
      username,
      email: `${username}@example.com`,
      password: 'password123'
    });
    console.log('Parent creation SUCCESS:', createRes.data);

    // Attempt Kid Login
    console.log(`\n[4] Logging in kid ${kidname}...`);
    const kidLoginRes = await axios.post(`${apiUrl}/auth/login`, {
      identifier: kidname,
      password: 'password123'
    });
    console.log('Kid login SUCCESS:', kidLoginRes.data);

    console.log('\n✅ All backend endpoints connected and verified successfully!');

  } catch (error) {
    if (error.response) {
      console.error('\n❌ API Error:', error.response.status, error.response.data);
    } else {
      console.error('\n❌ Network/Other Error (Is the backend running?):', error.message);
    }
  }
}

verify();
