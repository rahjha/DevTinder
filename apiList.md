# DevTinder API's

# authRouter
- POST/signup
- POST/login
- POST/logout

# profileRouter
- GET /profile/view
- GET /profile/edit
- GET /profile/password

# connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

# userRouter
- GET /user/connection
- GET /user/requests/received
- GET /user/feed - Gets you the profiles of other users on platform

Status : ignore, interested, accepted, rejected