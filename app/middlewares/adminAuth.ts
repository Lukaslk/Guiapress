export default function adminAuth(req, res, next) {
    if(req.session.login != undefined) {
        next()
    } else {
        res.redirect("/login")
    }
}