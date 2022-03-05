const bcrypt = require('bcryptjs');


exports.hashedPassword = async password => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        console.log(error);
    }
}