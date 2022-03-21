const usersConnect = [];

const add_user = async (user_id, socket_id) => {
    const user = usersConnect.find(user => user.user_id === user_id)
    if (user && user.socket_id === socket_id) {
        return usersConnect
    } else {
        if (user && user.socket_id !== socket_id) {
            await removeUser(user.socket_id);
        }
        
        const newUser = {
            user_id,
            socket_id
        }
        
        usersConnect.push(newUser)
        return usersConnect;
    }
}

const removeUser = async (socket_id) => {
    const index = usersConnect.findIndex(user => user.socket_id === socket_id);
    usersConnect.splice(index, 1)
    return;
}

const getConnectUsers = user_id => usersConnect.find(user => user.user_id === user_id);

module.exports = { add_user, removeUser, getConnectUsers }