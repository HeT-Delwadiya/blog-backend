const request = require("supertest");
import User from "../../models/User";
let server:any;
let token:any, adminId:any;

describe("POST: ", () => {

       beforeEach(async() => {
              server = require("../../app");

              const user:object = {
                     name: "het is admin",
                     email : "het@admin.com",
                     password : "123456",
                     role:33
              }
              const u:any = await request(server).post("/api/register").send(user);
              
              token = u.body.authtoken;
              adminId = u.body.user._id;
       })

       afterEach(async() => {
              await server.close();
              await User.deleteMany({});
       })

       describe("POST /api/admin/:adminId/users", () => {

              it("should return error if authtoken is not valid!", async() => {
                     const res = await request(server).get(`/api/admin/${adminId}/users`)
                     expect(res.status).toBe(401);
              })

              it("should return list of users if request is valid!", async() => {
                     const nUser:object = {
                            name: "dummy user",
                            email : "het@het.com",
                            password : "123456"
                     }
                     const nUserInDB =  await request(server).post("/api/register").send(nUser);
                     
                     const res = await request(server).get(`/api/admin/${adminId}/users`).set("Authorization",  `Bearer ${token}`);
                     expect(res.status).toBe(200);
                     expect(res.body.length).toBe(1);
              })


       })

       
})