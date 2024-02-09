addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});



async function handleRequest(request) {
  let url = new URL(request.url);
  let path = url.pathname.split("/").filter(p => p);

  if (request.method === "POST" && path[0] === "signup") {
    return addCorsHeaders(signUp(request));
  } else if (request.method === "POST" && path[0] === "login") {
    return addCorsHeaders(logIn(request));
  } else if (request.method === "GET" && path[0] === "data") {
    return addCorsHeaders(fetchUserData(request));
  } else if (request.method === "POST" && path[0] === "data") {
    return addCorsHeaders(updateUserData(request));
  } else {
    return new Response("Not found", { status: 404 });
  }
}

function addCorsHeaders(responsePromise) {
  return responsePromise.then(response => {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "X-User-Id, Content-Type");
    return response;
  });
}



async function signUp(request) {
  const { username, fullName, passwordHash } = await request.json();
  const existingUser = await pfmLogin.get(username);

  if (existingUser) {
    return new Response("Username already exists", { status: 409 });
  }

  const userId = generateUniqueId();
  const userData = { fullName, passwordHash, userId };
  
  await pfmLogin.put(username, JSON.stringify(userData));
  
  // Create an empty data object in pfmUserData
  await pfmUserData.put(userId, JSON.stringify({}));

  return new Response("User created successfully", { status: 201 });
}

async function logIn(request) {
  const { username, passwordHash } = await request.json();
  const userDataString = await pfmLogin.get(username);
  if (!userDataString) {
    return new Response("Username not found", { status: 404 });
  }

  const userData = JSON.parse(userDataString);
  if (userData.passwordHash !== passwordHash) {
    return new Response("Invalid password", { status: 403 });
  }

  return new Response(JSON.stringify({ userId: userData.userId }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function fetchUserData(request) {
  const userId = request.headers.get("X-User-Id");
  const data = await pfmUserData.get(userId);

  if (data) {
    return new Response(data, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response("User data not found", { status: 404 });
  }
}

async function updateUserData(request) {
  const userId = request.headers.get("X-User-Id");
  const content = await request.json();

  await pfmUserData.put(userId, JSON.stringify(content));

  return new Response("User data updated successfully", { status: 200 });
}

function generateUniqueId() {
  // Implement a unique ID generation logic suitable for your application
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
