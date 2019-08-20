const axios = require("axios");
const Dev = require("../models/Dev");

module.exports = {
    async index (req, res) {
        const { user } = req.headers;
        const loggedDev = await Dev.findById(user);

        const users = await Dev.find({
            $and: [
                { _id: { $ne: user } },
                { _id: { $nin: loggedDev.likes } },
                { _id: { $nin: loggedDev.dislikes } }
            ]
        });

        return res.json(users);
    },

    async store(req, res) {
        const { username } = req.body;

        if (!username){
            console.log("Usuário não informado na requisição.")
        }

        const userExists = await Dev.findOne({ user: username });

        if (userExists) {
            return res.json(userExists);
        }

        const response = await axios.get(`https://api.github.com/users/${username}`);

        if (!response){
            console.log("Usuário não encontrado no GitHub.")
        }

        const { name, bio, avatar_url: avatar } = response.data;

        if (!name || !bio || !avatar){
            console.log("Usuário com informações imcompletas do GitHub")
        }

        const dev = await Dev.create({
            name,
            user: username,
            bio,
            avatar
        });

        return res.json(dev);
    }
};