const User=require("../models/user");
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.signup=async(req,res,next)=>{
    try{
    let{username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser= await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust!");
        res.redirect("/listings");

    })
    
    }catch(e){
        console.log(e);
        req.flash("error",e.message);
        res.redirect("/signup");  
    }
};
module.exports.loginRender=(req,res)=>{
    res.render("users/login.ejs");
};
module.exports.login=(req,res)=>{
    // res.send("welcome to wanderlust,you are logged in");
    req.flash("success","welcome to wanderlust ");
    let redirectUrl=res.locals.redirectUrl ||"/listings";
    res.redirect(redirectUrl);
};
module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
             return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
};