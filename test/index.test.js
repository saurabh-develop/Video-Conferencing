const { axios } = require("axios");

function sum(a, b) {
  return a + b;
}

// test("adds 1 + 2 to equal 3", () => {
//   expect(sum(1, 2)).not.toBe(4);
// });

// Describe blocks -> the what is this suite testing

const BACKEND_URL = "http://localhost:3000 ";

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
