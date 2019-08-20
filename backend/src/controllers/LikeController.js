const Dev = require("../models/Dev");

module.exports = {
    async store (req, res) {
        const { user } = req.headers;
        const { devId } = req.params;

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if (!targetDev) {
            return res.status(400).json({error: "Dev not Exists!"});
        }

        if(targetDev.likes.includes(loggedDev._id)){
            console.log("Deu MATCH!");
            const loggedSocket = req.connectedUsers[user];
            const targetSocket = req.connectedUsers[devId];

            if (loggedSocket) {
                console.log("Avisa dev que deu o Segundo like ==>");
                 req.io.to(loggedSocket).emit('match', targetDev)
            }

            if (targetSocket) {
                console.log("Avisa dev que deu o Primeiro like ==>");
                req.io.to(targetSocket).emit('match', loggedDev)
           }
        }

        loggedDev.likes.push(targetDev._id);

        await loggedDev.save();

        return res.json(loggedDev);
    }
}