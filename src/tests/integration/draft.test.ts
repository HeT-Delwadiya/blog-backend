const request = require("supertest");
import User from "../../models/User";
let server:any;
let draft: {
       draftTitle: string,
       draftData: string,
       user: any
}, token:any, userId:any;

describe("POST: ", () => {

       beforeEach(async() => {
              server = require("../../app");

              const user:object = {
                     name : "het123",
                     email : "het@test.com",
                     password : "123456"
              }
              const u:any = await request(server).post("/api/register").send(user);
              token = u.body.authtoken;
              userId = u.body.user._id;
              draft = {
                     draftTitle: "im test title of draft",
                     draftData: "im test draft content",
                     user: userId
              }
       })

       afterEach(async() => {
              await server.close();
              await User.deleteMany({});
       })

       describe("POST /api/user/:userId/draft/create", () => {

              it("should return error if authtoken is not valid!", async() => {
                     const res = await request(server).post(`/api/user/${userId}/draft/create`).send(draft);
                     expect(res.status).toBe(401);
              })

              it("should return error if draftTitle is not valid!", async() => {
                     draft.draftTitle="";

                     const res = await request(server).post(`/api/user/${userId}/draft/create`).set("Authorization", `Bearer ${token}`).send(draft);
                     expect(res.status).toBe(400);
              })

              it("should return error if draftData is not valid!", async() => {
                     draft.draftData="";

                     const res = await request(server).post(`/api/user/${userId}/draft/create`).set("Authorization", `Bearer ${token}`).send(draft);
                     expect(res.status).toBe(400);
              })

              it("should return error if user id is not valid!", async() => {
                     draft.user="";

                     const res = await request(server).post(`/api/user/${userId}/draft/create`).set("Authorization", `Bearer ${token}`).send(draft);
                     expect(res.status).toBe(400);
              })

              it("should return draft and add draftid to users db if request is valid!", async() => {

                     const res = await request(server).post(`/api/user/${userId}/draft/create`).set("Authorization", `Bearer ${token}`).send(draft);
                     expect(res.status).toBe(200);
                     expect(res.body).toHaveProperty("draftTitle");

                     const userInDB = await User.findById(userId);
                     expect(userInDB.drafts.length).toBe(1);
              })
       })

       
})