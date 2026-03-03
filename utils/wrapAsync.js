// we can write wrap function to arrow function
module.exports =  (fn) => {
    return (req,res,next) =>{
        fn(req,res,next).catch(next);
    };
 };