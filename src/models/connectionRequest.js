const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
    {
        fromUserId :{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        toUserId :{
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: "User",
        },
        status: {
            type: String,
            requireed: true,
            enum: {
                values : ["ignored", "interested", "accepted", "rejected"],
                message: `{VALUE} is not valid status`
            }
        },
    },{
        timestamps: true
    }
);

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});
connectionRequestSchema.pre("save", function(next){
    
    const connectionRequest = this;

    //check if toUserId is same as fromUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself!");
    }
    next();
});

const connectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = connectionRequestModel;