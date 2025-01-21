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
- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

# userRouter
- GET /user/requests/received
- GET /user/connection
- GET /user/feed - Gets you the profiles of other users on platform

Status : ignored, interested, accepted, rejected