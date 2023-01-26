const auth = require("../../controllers/auth");
const request = require("supertest");
import User from "../../models/User";
let server:any, data:{
       name : string,
       email : string,
       password : string
};

describe("Auth: ", () => {

       beforeEach(() => {
              server = require("../../app");
              data = {
                     name : "het123",
                     email : "het@test.com",
                     password : "123456"
              }
       })

       afterEach(async() => {
              await server.close();
              await User.deleteMany({});
       })

       describe("POST /api/register", () => {
              it("should return error if name is not valid!", async() => {
                     data.name="";

                     const res = await request(server).post("/api/register").send(data);
                     expect(res.status).toBe(400);
                     expect(res.body.error).toMatch(/.*name.*/i)
              })

              it("should return error if email is not valid!", async() => {
                     data.email="";

                     const res = await request(server).post("/api/register").send(data);
                     expect(res.status).toBe(400);
                     expect(res.body.error).toMatch(/.*email.*/i)
              })

              it("should return error if password is not valid!", async() => {
                     data.password="";

                     const res = await request(server).post("/api/register").send(data);
                     expect(res.status).toBe(400);
                     expect(res.body.error).toMatch(/.*password.*/i)
              })

              it("should return authtoken and user details in object if request is valid!", async() => {
                     const user = new User(data);

                     const res = await request(server).post("/api/register").send(data);
                     expect(res.status).toBe(200);
                     expect(res.body).toHaveProperty("authtoken");
                     expect(res.body).toHaveProperty("user");

                     const userInDB = await User.findById(res.body.user._id);
                     expect(userInDB._id.toHexString()).toBe(res.body.user._id);
              })
       })

       describe("POST /api/login", () => {
              it("should return error if email is not provided!", async() => {
                     data.name="";
                     data.email="";

                     const res = await request(server).post("/api/login").send(data);
                     expect(res.status).toBe(400);
                     expect(res.body.error).toMatch(/.*email.*/i)
              })

              it("should return error if password is not provided!", async() => {
                     data.name="";
                     data.password="";

                     const res = await request(server).post("/api/login").send(data);
                     expect(res.status).toBe(400);
                     expect(res.body.error).toMatch(/.*password.*/i)
              })

              it("should return error if email is not registered!", async() => {
                     data.name="";
                     data.email="thisemailnotregistered@gmail.com";

                     const res = await request(server).post("/api/login").send(data);
                     expect(res.status).toBe(400);
                     expect(res.body.Message).toMatch(/.*email.*/i)
              })

              it("should return error if password is wrong!", async() => {
                     const saveUser = await request(server).post("/api/register").send(data);
                     expect(saveUser.status).toBe(200)

                     data.name="";
                     data.password="wrongpass"

                     const res = await request(server).post("/api/login").send(data);
                     expect(res.status).toBe(400);
                     expect(res.body.Message).toMatch(/.*password.*/i)
              })

              it("should return authtoken and user details in object if request is valid!", async() => {
                     const saveUser = await request(server).post("/api/register").send(data);
                     expect(saveUser.status).toBe(200)

                     data.name="";

                     const res = await request(server).post("/api/login").send(data);
                     expect(res.status).toBe(200);
                     expect(res.body).toHaveProperty("authtoken")
                     expect(res.body).toHaveProperty("user")
              })
       })

       describe("GET /api/logout", () => {

              it("should return 200 if its a valid request!", async() => {
                     const res = await request(server).get("/api/logout")
                     expect(res.status).toBe(200)
              })
       })
})