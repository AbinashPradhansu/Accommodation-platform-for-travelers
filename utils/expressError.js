//  it is use to show which type of error 

class expressError extends Error
{
    constructor(StatusCode,message){
        super();
        this.StatusCode=StatusCode;
        this.message=message;
    }
}
module.exports=expressError;
