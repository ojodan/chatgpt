const http = require('http');
const url = require('url');

const port = process.env.PORT || 3000;

// Mock in-memory data
let courses = [
  {
    id: 1,
    title: 'Node.js Basics',
    description: 'Introductory Node.js course',
    start_time: '2025-07-01T10:00:00Z',
    end_time: '2025-07-01T12:00:00Z',
    capacity: 30,
    attendees: 0
  },
  {
    id: 2,
    title: 'Express Framework',
    description: 'Building APIs with Express',
    start_time: '2025-07-02T13:00:00Z',
    end_time: '2025-07-02T15:00:00Z',
    capacity: 20,
    attendees: 0
  }
];

const members = {}; // key: line user id -> { id, displayName, email }
const registrations = []; // { memberId, courseId, status }
let nextMemberId = 1;

function getOrCreateMember(userId, info) {
  if (!members[userId]) {
    members[userId] = { id: nextMemberId++, lineUserId: userId, ...info };
  }
  return members[userId];
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1e6) {
        req.socket.destroy();
        reject(new Error('request body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

function sendJSON(res, status, obj) {
  const data = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  });
  res.end(data);
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  if (req.method === 'GET' && pathname === '/api/courses') {
    return sendJSON(res, 200, courses);
  }

  if (req.method === 'POST' && /^\/api\/courses\/(\d+)\/register$/.test(pathname)) {
    const match = pathname.match(/^\/api\/courses\/(\d+)\/register$/);
    const courseId = parseInt(match[1], 10);
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return sendJSON(res, 400, { error: 'Missing X-User-Id header' });
    }

    const course = courses.find(c => c.id === courseId);
    if (!course) {
      return sendJSON(res, 404, { error: 'Course not found' });
    }
    if (course.attendees >= course.capacity) {
      return sendJSON(res, 400, { error: 'Course is full' });
    }

    let body = {};
    try {
      body = await parseBody(req);
    } catch (e) {
      return sendJSON(res, 400, { error: 'Invalid JSON body' });
    }

    const member = getOrCreateMember(userId, {
      displayName: body.displayName || 'LINE User',
      email: body.email || ''
    });

    registrations.push({ memberId: member.id, courseId: course.id, status: 'confirmed' });
    course.attendees += 1;

    return sendJSON(res, 200, { message: 'Registration successful' });
  }

  if (req.method === 'GET' && pathname === '/api/members/me/registrations') {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return sendJSON(res, 400, { error: 'Missing X-User-Id header' });
    }

    const member = members[userId];
    if (!member) {
      return sendJSON(res, 200, []);
    }
    const myRegs = registrations.filter(r => r.memberId === member.id);
    return sendJSON(res, 200, myRegs);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
