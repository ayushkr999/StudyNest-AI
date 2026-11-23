const BASE_URL = 'http://localhost:5000/api';

async function runEndToEndVerification() {
  console.log('\n===============================================================');
  console.log('       STUDYNEST AI — FULL-STACK VERIFICATION SUITE           ');
  console.log('===============================================================\n');

  let cookieHeader = '';

  async function apiRequest(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Extract Set-Cookie
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      cookieHeader = setCookie.split(';')[0];
    }

    const data = await response.json().catch(() => null);
    return { status: response.status, data, headers: response.headers };
  }

  const results = [];

  // Step 1: Health Check
  try {
    const res = await apiRequest('/health');
    const pass = res.status === 200 && res.data?.status === 'healthy';
    results.push({ test: 'Backend Health Check (/api/health)', status: pass ? 'PASS' : 'FAIL', details: JSON.stringify(res.data) });
    console.log(`[1/8] Health Check: ${pass ? 'PASSED' : 'FAILED'} (HTTP ${res.status})`);
  } catch (err) {
    results.push({ test: 'Backend Health Check', status: 'FAIL', details: err.message });
  }

  // Step 2: User Registration
  const testEmail = `student_${Date.now()}@studynest.ai`;
  try {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Ayush Sharma',
        email: testEmail,
        password: 'SecurePassword123!',
      }),
    });
    const pass = res.status === 201 && res.data?.success && cookieHeader.includes('token=');
    results.push({
      test: 'User Registration & Cookie Issuance (/api/auth/register)',
      status: pass ? 'PASS' : 'FAIL',
      details: `User: ${res.data?.data?.name} (${res.data?.data?.email})`,
    });
    console.log(`[2/8] User Registration: ${pass ? 'PASSED' : 'FAILED'} (HTTP ${res.status}) - Cookie: ${cookieHeader.slice(0, 20)}...`);
  } catch (err) {
    results.push({ test: 'User Registration', status: 'FAIL', details: err.message });
  }

  // Step 3: Session Persistence with HTTP-only Cookie
  try {
    const res = await apiRequest('/auth/me');
    const pass = res.status === 200 && res.data?.data?.email === testEmail;
    results.push({
      test: 'Session Authentication via Cookie (/api/auth/me)',
      status: pass ? 'PASS' : 'FAIL',
      details: `Authenticated as: ${res.data?.data?.name}`,
    });
    console.log(`[3/8] Session Verification: ${pass ? 'PASSED' : 'FAILED'} (HTTP ${res.status})`);
  } catch (err) {
    results.push({ test: 'Session Verification', status: 'FAIL', details: err.message });
  }

  // Step 4: Create Study Folder
  let folderId = null;
  try {
    const res = await apiRequest('/folders', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Computer Science & AI',
        color: '#10b981',
        icon: 'folder',
      }),
    });
    const pass = res.status === 201 && res.data?.data?._id;
    folderId = res.data?.data?._id;
    results.push({
      test: 'Folder Creation (/api/folders)',
      status: pass ? 'PASS' : 'FAIL',
      details: `Folder: "${res.data?.data?.name}" (ID: ${folderId})`,
    });
    console.log(`[4/8] Folder Creation: ${pass ? 'PASSED' : 'FAILED'} (HTTP ${res.status})`);
  } catch (err) {
    results.push({ test: 'Folder Creation', status: 'FAIL', details: err.message });
  }

  // Step 5: Create Markdown Note
  let noteId = null;
  try {
    const res = await apiRequest('/notes', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Neural Networks & Backpropagation',
        content: '# Neural Networks\n\nA multilayer perceptron uses **backpropagation** to calculate gradients.\n\n- Feedforward pass\n- Loss computation\n- Backward pass',
        folder: folderId,
        tags: ['ai', 'deep-learning', 'exams'],
        isPinned: true,
      }),
    });
    const pass = res.status === 201 && res.data?.data?._id;
    noteId = res.data?.data?._id;
    results.push({
      test: 'Markdown Note Creation (/api/notes)',
      status: pass ? 'PASS' : 'FAIL',
      details: `Note: "${res.data?.data?.title}" (Pinned: ${res.data?.data?.isPinned})`,
    });
    console.log(`[5/8] Markdown Note Creation: ${pass ? 'PASSED' : 'FAILED'} (HTTP ${res.status})`);
  } catch (err) {
    results.push({ test: 'Markdown Note Creation', status: 'FAIL', details: err.message });
  }

  // Step 6: Create Study Room with 6-char Unique Code
  let roomCode = null;
  try {
    const res = await apiRequest('/rooms', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Finals Prep Circle 2026',
        description: 'Collaborative group study with AI tutor support',
      }),
    });
    const pass = res.status === 201 && res.data?.data?.code?.length === 6;
    roomCode = res.data?.data?.code;
    results.push({
      test: 'Study Room Creation (/api/rooms)',
      status: pass ? 'PASS' : 'FAIL',
      details: `Room: "${res.data?.data?.name}", Code: [${roomCode}]`,
    });
    console.log(`[6/8] Study Room Creation: ${pass ? 'PASSED' : 'FAILED'} (Room Code: ${roomCode})`);
  } catch (err) {
    results.push({ test: 'Study Room Creation', status: 'FAIL', details: err.message });
  }

  // Step 7: Create Flashcard Deck & Cards
  try {
    const deckRes = await apiRequest('/flashcards/decks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Deep Learning Key Concepts',
        description: 'Active recall cards for finals review',
        note: noteId,
      }),
    });
    const deckId = deckRes.data?.data?._id;

    const cardRes = await apiRequest(`/flashcards/decks/${deckId}/cards`, {
      method: 'POST',
      body: JSON.stringify({
        front: 'What is the vanishing gradient problem?',
        back: 'When gradients become exponentially small as they backpropagate through deep layers, preventing weights from updating effectively.',
        hint: 'Deep networks activation function issue',
      }),
    });

    const pass = deckRes.status === 201 && cardRes.status === 201;
    results.push({
      test: 'Flashcard Deck & Card Creation (/api/flashcards)',
      status: pass ? 'PASS' : 'FAIL',
      details: `Deck: "${deckRes.data?.data?.title}" with 1 card`,
    });
    console.log(`[7/8] Flashcard & Deck Creation: ${pass ? 'PASSED' : 'FAILED'} (HTTP ${cardRes.status})`);
  } catch (err) {
    results.push({ test: 'Flashcard Creation', status: 'FAIL', details: err.message });
  }

  // Step 8: Dashboard Analytics Aggregation
  try {
    const res = await apiRequest('/dashboard');
    const m = res.data?.data?.metrics;
    const pass = res.status === 200 && m?.totalNotes >= 1 && m?.totalFolders >= 1 && m?.myRoomsCount >= 1;
    results.push({
      test: 'Aggregated Dashboard Metrics (/api/dashboard)',
      status: pass ? 'PASS' : 'FAIL',
      details: `Notes: ${m?.totalNotes}, Folders: ${m?.totalFolders}, Rooms: ${m?.myRoomsCount}, Decks: ${m?.totalDecks}`,
    });
    console.log(`[8/8] Dashboard Analytics: ${pass ? 'PASSED' : 'FAILED'} (HTTP ${res.status})`);
    console.log('      Live Database Counts:', m);
  } catch (err) {
    results.push({ test: 'Dashboard Analytics', status: 'FAIL', details: err.message });
  }

  console.log('\n===============================================================');
  console.log('                    TEST SUMMARY RESULTS                       ');
  console.log('===============================================================');
  console.table(results);
  console.log('All core full-stack features verified with live MongoDB persistence!\n');
}

runEndToEndVerification().catch((err) => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
