import jwt from "jsonwebtoken"

const generateTokenAndSetCookie = async (res, id) => {
    try {
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        })

        return token
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export default generateTokenAndSetCookie
