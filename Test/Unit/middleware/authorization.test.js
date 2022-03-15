const {User}=require('../../../Models/user');
const authz=require('../../../middleware/Authorization');
const mongoose=require('mongoose');
const { expectCt } = require('helmet');


describe('auth middleware',() =>{
    it('should populate the payload with a valid JWT',() =>{
        const user={
            _id:mongoose.Types.ObjectId().toHexString(),
        };
        const token=new User(user).generateAuthToken();

        const req={
            header:jest.fn().mockReturnValue(token)
        };

        const res={};
        const next=jest.fn();

        authz(req,res,next);
        expect(req.user).toMatchObject(user);
    });
    
});