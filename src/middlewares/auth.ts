const { expressjwt: jwt } = require("express-jwt");

exports.isSignedIn = jwt({
       secret: process.env.SECRET,
       algorithms: ['sha1', 'RS256', 'HS256'],
       userProperty: "auth"
});

exports.isAuthenticated = (req: any, res: any, next: Function) => {
       let checker = req.profile && req.auth && req.profile._id == req.auth._id;
       if (!checker) {
              return res.status(403).json({
                     error: "ACCESS DENIED"
              });
       }
       next();
};

exports.isAdmin = (req: any, res: any, next: Function) => {
       if(req.auth.role == 33) {
              next();
       } else {
              return res.status(403).json({
                     error: "You are not ADMIN, Access denied!"
              });
       }
};