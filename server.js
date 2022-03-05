const express = require('express');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectToDataBase } = require('./utils/connectToDB');
require('dotenv').config();
const { add_user, removeUser } = require('./utils/room');
const { getMessages, sendNewMessage } = require('./utils/messageActions');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());



connectToDataBase(process.env.MONGO_URL);

io.on('connection', socket => {
    console.log(socket.id);

    socket.on('be_online', async ({ user_id }) => {
        const users = await add_user(user_id, socket.id)

        setInterval(() => {
            socket.emit("connect_users", {
                users: users.filter(user => user.user_id !== user_id)
            })
        }, 1000)
    })


    socket.on('$loading_messages$', async ({ user_id, messageWith }) => {
        const { chat, error } = await getMessages(user_id, messageWith)

        if (!error) {
            console.log(chat);
            socket.emit('$messages_loaded$', { chat })
        }
    })


    socket.on('$sending_new_messages$', async ({ user_id, receiver_id, text }) => {
        const { new_msg, error } = await sendNewMessage(user_id, receiver_id, text);

        if (!error) {
            socket.emit('%_new_msg_sent%', new_msg)
        }
    })


    socket.on('disconnect', () => removeUser(socket.id));
})

app.get('/', (req, res) => {
    res.send('woooooooooooork')
})

app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/post', require('./routes/postRouter'));
app.use('/api/v1/profile', require('./routes/profileRoute'));
app.use('/api/v1/search', require('./routes/searchRoutes'));
app.use('/api/v1/notifications', require('./routes/notificationRoute'));

const PORT = process.env.PORT || 3500;
server.listen(PORT);

console.log(`Your app running on ${PORT}`)