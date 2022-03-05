const UserModel = require("../models/UserModel");



exports.searchUser = async (req, res) => {
    try {
        const { text } = req.params;

        if (text.length === 0) return;
        
        const user = await UserModel.find({ name: {
            $regex: text,
            $options: 'i'
        } });

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).send('Server Error');
    }
}