const request = require("supertest");
import User from "../../models/User";
let server:any;
let post: {
       postTitle: string,
       postData: string,
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
              post = {
                     postTitle: "im test title of post",
                     postData: "im test post content",
                     user: userId
              }
       })

       afterEach(async() => {
              await server.close();
              await User.deleteMany({});
       })

       describe("POST /api/user/:userId/post/create", () => {

              it("should return error if authtoken is not valid!", async() => {
                     const res = await request(server).post(`/api/user/${userId}/post/create`).send(post);
                     expect(res.status).toBe(401);
              })

              it("should return error if postTitle is not valid!", async() => {
                     post.postTitle="";

                     const res = await request(server).post(`/api/user/${userId}/post/create`).set("Authorization", `Bearer ${token}`).send(post);
                     expect(res.status).toBe(400);
              })

              it("should return error if postData is not valid!", async() => {
                     post.postData="";

                     const res = await request(server).post(`/api/user/${userId}/post/create`).set("Authorization", `Bearer ${token}`).send(post);
                     expect(res.status).toBe(400);
              })

              it("should return error if user id is not valid!", async() => {
                     post.user="";

                     const res = await request(server).post(`/api/user/${userId}/post/create`).set("Authorization", `Bearer ${token}`).send(post);
                     expect(res.status).toBe(400);
              })

              it("should return post and add postid to users db if request is valid!", async() => {

                     const res = await request(server).post(`/api/user/${userId}/post/create`).set("Authorization", `Bearer ${token}`).send(post);
                     expect(res.status).toBe(200);
                     expect(res.body).toHaveProperty("_id");
                     expect(res.body.isApproved).toBe(false);

                     const userInDB = await User.findById(userId);
                     expect(userInDB.posts.length).toBe(1);
              })
       })

       
})