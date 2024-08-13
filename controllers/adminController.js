

export const loginGet = (req, res) => {

    if(req.query){
        const err = Number(req.query.err);
        switch(err){
            case 1:
               return res.render('pages/admin/admin_login', {alertMessage : "user name or password not found!!"});
        }
    }

    res.render('pages/admin/admin_login' , {alertMessage : ''});
}

export const loginPost = (req, res) => {
    const {uname, password } = req.body;
    if(uname === 'Admin' && password === 'admin123'){
        return res.json({
            status: "success",
            message: "Admin verified successfully"
        })
    }

    res.redirect('/admin/login?err=1');

}