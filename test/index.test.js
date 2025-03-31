const { axios, head } = require("axios");

function sum(a, b) {
  return a + b;
}

// test("adds 1 + 2 to equal 3", () => {
//   expect(sum(1, 2)).not.toBe(4);
// });

// Describe blocks -> the what is this suite testing

const BACKEND_URL = "http://localhost:3000 ";
const WS_URL = "ws://localhost:3001";

describe("Authentication", () => {
  test("User is able to signup only once", async () => {
    const username = "abh" + Math.random();
    const password = "1234567";

    const response = axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    expect(response.statusCode).toBe(200);

    const updatedResponse = axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Signup req failed when username is empty", async () => {
    const username = "abh" + Math.random();
    const password = 1234567;
    axios.post(`${BACKEND_URL}/api/v1/signup`, {
      password,
    });
    expect(response.statusCode).toBe(400);
  });

  test("Login succeeds if the username ans password are correct", async () => {
    const username = "abh" + Math.random();
    const password = "12345";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    const response = await axios.post(`${BACKEND_URL}/api/v1/login`, {
      username,
      password,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test("Signin fails if the username passwaord is incorrect", async () => {
    const username = "abh" + Math.random();
    const passwaord = "1234567";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      passwaord,
      role: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/login`, {
      username: "WrongName",
      passwaord,
    });
    expect(response.statusCode).toBe(403);
  });
});

describe("User metadata endpoints", () => {
  let token = "";
  let avatarId = "";
  beforeAll(async () => {
    const username = "abh" + Math.random();
    const passwaord = "123456";
    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      passwaord,
      type: "admin",
    });
    const response = await axioss.post(`${BACKEND_URL}/api/v1/login`, {
      username,
      passwaord,
    });
    token = response.data.token;
    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl: "https://picsum.photos/200/300",
        name: "Tom",
      },
      {
        Headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    avatarId = avatarResponse.data.avatarId;
  });
  test("User cant update their metadata with a wrong avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId: "12212121212",
      },
      {
        Headers: { authorization: `Bearer ${token}` },
      }
    );
    expect(response.statusCode).toBe(400);
  });
  test("User can update their metadata with right avatarId", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId,
      },
      {
        Headers: { authorization: `Bearer ${token}` },
      }
    );
    expect(response.statusCode).toBe(200);
  });
  test("User cant update their metadata if they dont give token", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId,
    });
    expect(response.statusCode).toBe(403);
  });
});

describe("User avatar information", () => {
  let avatarId = "";
  let token = "";
  let userId = "";
  beforeAll(async () => {
    const username = "abh" + Math.random();
    const passwaord = "123456";
    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      passwaord,
      type: "admin",
    });
    userId = signupResponse.data.userId;
    const response = await axioss.post(`${BACKEND_URL}/api/v1/login`, {
      username,
      passwaord,
    });
    token = response.data.token;
    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl: "https://picsum.photos/200/300",
        name: "Tom",
      },
      {
        Headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    avatarId = avatarResponse.data.avatarId;
  });
  test("Get back avatar info from user", async () => {
    axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`);
    expect(response.data.avatars.length).toBe(1);
    expect(response.data.avatars[0].userId).toBe(userId);
  });
  test("Available avatars lists the recently created avatar", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
    expect(response.data.avatars.length).not.toBe(0);
    const currAvatar = response.data.avatars.find((x) => x.id == avatarId);
    expect(currAvatar).toBeDefined();
  });
});

describe("Space Info", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let adminToken;
  let adminId;
  let userToken;
  let userId;

  beforeAll(async () => {
    const username = "abh" + Math.random();
    const passwaord = "123456";
    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      passwaord,
      type: "admin",
    });
    adminId = signupResponse.data.userId;
    const response = await axioss.post(`${BACKEND_URL}/api/v1/login`, {
      username,
      passwaord,
    });
    adminToken = response.data.token;

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        passwaord,
        type: "user",
      }
    );
    userId = userSignupResponse.data.userId;
    const userLoginResponse = await axioss.post(`${BACKEND_URL}/api/v1/login`, {
      username: username + "-user",
      passwaord,
    });
    userToken = userLoginResponse.data.token;

    const element1Response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl: "https://picsum.photos/200/300",
        width: 1,
        height: 1,
        static: true,
      },
      {
        Headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    const element2Response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl: "https://picsum.photos/200/300",
        width: 1,
        height: 1,
        static: true,
      },
      {
        Headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    element1Id = element1Response.data.id;
    element2Id = element2Response.data.id;
    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://picsum.photos/200/300",
        dimensions: "100x200",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        Headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    mapId = mapResponse.id;
  });

  test("User is able to create space", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: mapId,
      },
      {
        Headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.data.spaceId).toBeDefined();
  });

  test("User is able to create space without mapId(empty space)", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        Headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.data.spaceId).toBeDefined();
  });

  test("User is not able to create space without dimension", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
      },
      {
        Headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });

  test("User is not able to delete space that does not exist", async () => {
    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/space/randomIdDoesntExist`,
      {
        Headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });

  test("User is able to delete space that does exist", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        Headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const deleteResponse = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,
      {
        Headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(deleteResponse.statusCode).toBe(200);
  });

  test("User should not be able to delete a space created by another user", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        Headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const deleteResponse = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,
      {
        Headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(deleteResponse.statusCode).toBe(400);
  });

  test("Admin has no spaces intitially", async () => {
    const response = axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      Headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    expect(response.data.spaces.length).toBe(0);
  });

  test("Admin has no spaces intitially", async () => {
    const spaceCreateResponse = axios.post(
      `${BACKEND_URL}/api/v1/space/all`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        Headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const response = axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      Headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    const filteredSpace = response.data.spaces.find(
      (x) => x.id == spaceCreateResponse.spaceId
    );
    expect(filteredSpace).toBeDefined();
    expect(response.data.spaces.length).toBe(1);
  });
});

describe("Areana endpoints", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let adminToken;
  let adminId;
  let userToken;
  let userId;
  let spaceId;

  beforeAll(async () => {
    const username = "abh" + Math.random();
    const passwaord = "123456";
    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      passwaord,
      type: "admin",
    });
    adminId = signupResponse.data.userId;
    const response = await axioss.post(`${BACKEND_URL}/api/v1/login`, {
      username,
      passwaord,
    });
    adminToken = response.data.token;

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        passwaord,
        type: "user",
      }
    );
    userId = userSignupResponse.data.userId;
    const userLoginResponse = await axioss.post(`${BACKEND_URL}/api/v1/login`, {
      username: username + "-user",
      passwaord,
    });
    userToken = userLoginResponse.data.token;

    const element1Response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl: "https://picsum.photos/200/300",
        width: 1,
        height: 1,
        static: true,
      },
      {
        Headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    const element2Response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl: "https://picsum.photos/200/300",
        width: 1,
        height: 1,
        static: true,
      },
      {
        Headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    element1Id = element1Response.data.id;
    element2Id = element2Response.data.id;
    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://picsum.photos/200/300",
        dimensions: "100x200",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        Headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    mapId = mapResponse.id;
    const spaceResponse = await axios.post(
      `${BACKEND_URL}/api/v1/`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: mapId,
      },
      {
        Headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    spaceId = spaceResponse.data.id;
  });

  test("Incorrect spaceId returns a 400", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/123saur`, {
      Headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    expect(response.statusCode).toBe(400);
  });

  test("Correct spaceId returns all the elements", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
      Headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    expect(response.dimensions).toBe("100x200");
    expect(response.data.elements.length).toBe(3);
  });

  test("Delete endpoint is able to delete an element", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
      Headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    await axios.delete(
      `${BACKEND_URL}/api/v1/space/element`,
      {
        spaceId: spaceId,
        elementId: response.data.elements[0].id,
      },
      {
        Headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const newResponse = await axios.get(
      `${BACKEND_URL}/api/v1/space/${spaceId}`,
      {
        Headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(newResponse.data.elements.length).toBe(2);
    expect(response.dimensions).toBe("100x200");
    expect(response.data.elements.length).toBe(3);
  });

  test("Adding an element fails if element lies outside the dimension work as expected", async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/space/element`,
      {
        elementId: element1Id,
        spaceId: spaceId,
        x: 100000,
        y: 2100000,
      },
      {
        Headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const newResponse = await axios.get(
      `${BACKEND_URL}/api/v1/space/${spaceId}`,
      {
        Headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(newResponse.statusCode).toBe(400);
  });

  test("Adding an element work as expected", async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/space/element`,
      {
        elementId: element1Id,
        spaceId: spaceId,
        x: 50,
        y: 20,
      },
      {
        Headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const newResponse = await axios.get(
      `${BACKEND_URL}/api/v1/space/${spaceId}`,
      {
        Headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(newResponse.data.elements.length).toBe(3);
  });
});

describe("Admin endpoints", () => {
  let adminToken;
  let adminId;
  let userToken;
  let userId;
  beforeAll(async () => {
    const username = "abh" + Math.random();
    const passwaord = "123456";
    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      passwaord,
      type: "admin",
    });
    adminId = signupResponse.data.userId;
    const response = await axioss.post(`${BACKEND_URL}/api/v1/login`, {
      username,
      passwaord,
    });
    adminToken = response.data.token;
    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        passwaord,
        type: "user",
      }
    );
    userId = userSignupResponse.data.userId;
    const userLoginResponse = await axioss.post(`${BACKEND_URL}/api/v1/login`, {
      username: username + "-user",
      passwaord,
    });
    userToken = userLoginResponse.data.token;
  });

  test("Admin is able to hit admin endpoints", async () => {
    const elementResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl: "https://picsum.photos/200/300",
        width: 1,
        height: 1,
        static: true,
      },
      {
        Headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://picsum.photos/200/300",
        dimensions: "100x200",
        defaultElements: [],
      },
      {
        Headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl: "https://picsum.photos/200/300",
        name: "Tom",
      },
      {
        Headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const updateElementResponse = await axios.put(
      `${BACKEND_URL}/api/v1/admin/elenent/123`,
      {
        imageUrl: "https://picsum.photos/id/237/200/300",
        name: "Tom",
      },
      {
        Headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(elementResponse.statusCode).toBe(403);
    expect(mapResponse.statusCode).toBe(403);
    expect(avatarResponse.statusCode).toBe(403);
    expect(updateElementResponse.statusCode).toBe(403);
  });

  test("User is not able to hit admin endpoints", async () => {
    const elementResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl: "https://picsum.photos/200/300",
        width: 1,
        height: 1,
        static: true,
      },
      {
        Headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://picsum.photos/200/300",
        dimensions: "100x200",
        defaultElements: [],
      },
      {
        Headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl: "https://picsum.photos/200/300",
        name: "Tom",
      },
      {
        Headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(elementResponse.statusCode).toBe(200);
    expect(mapResponse.statusCode).toBe(200);
    expect(avatarResponse.statusCode).toBe(200);
  });

  test("Admin is able to update the imageUrl for an element", async () => {
    const elementResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl: "https://picsum.photos/200/300",
        width: 1,
        height: 1,
        static: true,
      },
      {
        Headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const updateElementResponse = await axios.put(
      `${BACKEND_URL}/api/v1/admin/elenent/${elementResponse.data.id}`,
      {
        imageUrl: "https://picsum.photos/id/237/200/300",
        name: "Tom",
      },
      {
        Headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(updateElementResponse.statusCode).toBe(200);
  });

  test("");
});

describe("Websocket tests", () => {
  let adminToken;
  let adminUserId;
  let userToken;
  let userId;
  let mapId;
  let element1Id;
  let element2Id;
  let spaceId;
  let ws1;
  let ws2;
  let ws1Messages = [];
  let ws2Messages = [];
  let userX;
  let userY;
  let adminX;
  let adminY;

  function waitForAndPopLatestMessage(messageArray) {
    return new Promise((r) => {
      if (messageArray.length > 0) {
        resolve(messageArray.shift());
      } else {
        let interval = setInterval(() => {
          if (messageArray.length > 0) {
            resolve(messageArray.shift());
            clearInterval(interval);
          }
        }, 100);
      }
    });
  }
  async function setupHTTP() {
    const username = "abh" + Math.random();
    const passwaord = "1234567";
    const adminSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username,
        passwaord,
        role: "admin",
      }
    );
    const adminLoginResponse = await axios.post(`${BACKEND_URL}/api/v1/login`, {
      username,
      passwaord,
    });
    adminToken = adminLoginResponse.data.token;
    adminUserId = adminSignupResponse.data.userId;
    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        passwaord,
        role: "user",
      }
    );
    const userLoginResponse = await axios.post(`${BACKEND_URL}/api/v1/login`, {
      username: username + "-user",
      passwaord,
    });
    userToken = userLoginResponse.data.token;
    userId = userSignupResponse.data.userId;
    const element1Response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl: "https://picsum.photos/200/300",
        width: 1,
        height: 1,
        static: true,
      },
      {
        Headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    const element2Response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl: "https://picsum.photos/200/300",
        width: 1,
        height: 1,
        static: true,
      },
      {
        Headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    element1Id = element1Response.data.id;
    element2Id = element2Response.data.id;
    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://picsum.photos/200/300",
        dimensions: "100x200",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        Headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    mapId = mapResponse.id;
    const spaceResponse = await axios.post(
      `${BACKEND_URL}/api/v1/`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: mapId,
      },
      {
        Headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    spaceId = spaceResponse.data.id;
  }
  async function setupWs() {
    ws1 = new WebSocket(WS_URL);
    await new Promise((r) => {
      ws1.onopen = r;
    });
    ws1.onmessage = (event) => {
      ws1.push(JSON.parse(event.data));
    };

    ws2 = new WebSocket(WS_URL);
    await new Promise((r) => {
      ws2.onopen = r;
    });
    ws2.onmessage = (event) => {
      ws2.push(JSON.parse(event.data));
    };
  }

  beforeAll(async () => {
    setupHTTP();
    setupWs();
  });

  test("Get bacl ack for joining the space", async () => {
    ws1.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          token: userToken,
        },
      })
    );
    const message1 = await waitForAndPopLatestMessage(ws1Messages);

    ws2.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          token: userToken,
        },
      })
    );

    const message2 = await waitForAndPopLatestMessage(ws2Messages);
    const message3 = await waitForAndPopLatestMessage(ws1Messages);

    expect(message1.type).toBe("space-joined");
    expect(message2.type).toBe("space-joined");

    expect(message1.payload.users.length).toBe(0);
    expect(message2.payload.users.length).toBe(1);
    expect(message3.payload.x).toBe(message2.payload.spawn.x);
    expect(message3.payload.y).toBe(message2.payload.spawn.y);
    expect(message3.type).toBe("user-join");
    expect(message3.payload.userId).toBe(userId);

    adminX = message1.payload.spawn.x;
    adminY = message1.payload.spawn.y;

    userX = message2.payload.spawn.x;
    userY = message2.payload.spawn.y;
  });

  test("Not been able to move across the boundary", async () => {
    ws1.send(
      JSON.stringify({
        type: "movement",
        payload: {
          x: 1000000,
          y: 10000,
        },
      })
    );
    const message = await waitForAndPopLatestMessage(ws1Messages);
    expect(message.type).toBe("movement-rejected");
    expect(message.payload.x).toBe(adminX);
    expect(message.payload.y).toBe(adminY);
  });

  test("Not been able to move two blocks at the same time", async () => {
    ws1.send(
      JSON.stringify({
        type: "movement",
        payload: {
          x: adminX + 2,
          y: adminY,
        },
      })
    );
    const message = await waitForAndPopLatestMessage(ws1Messages);
    expect(message.type).toBe("movement-rejected");
    expect(message.payload.x).toBe(adminX);
    expect(message.payload.y).toBe(adminY);
  });

  test("Correct movemeny should be broadcasted to other socket", async () => {
    ws1.send(
      JSON.stringify({
        type: "movement",
        payload: {
          x: adminX + 1,
          y: adminY,
          userId: adminId,
        },
      })
    );
    const message = await waitForAndPopLatestMessage(ws2Messages);
    expect(message.type).toBe("movement");
    expect(message.payload.x).toBe(adminX + 1);
    expect(message.payload.y).toBe(adminY);
  });

  test("If a user leaves the other user receives a leave event ", async () => {
    ws1.close();
    const message = await waitForAndPopLatestMessage(ws2Messages);
    expect(message.type).toBe("user-left");
    expect(message.payload.userId).toBe(adminUserId);
  });
});
