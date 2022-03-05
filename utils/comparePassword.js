const bcrypt = require('bcryptjs');

exports.comparePassword = async (userPassword, password) => {
    try {
        const isPassword = await bcrypt.compare(password, userPassword);
        return isPassword;
    } catch (err) {
        return res.status(500).json({ msg: err });
    }
}