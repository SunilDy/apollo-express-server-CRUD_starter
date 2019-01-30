const { PubSub } = require('apollo-server-express');
const User = require('../Models/User');

// PUBSUB Consts
const NEW_USER = "NEW_USER";
const USER_UPDATED = "USER_UPDATED";

const resolvers = {
    Query: {
        users: (_, __) => {
            return User.find({})
        },
        findUser: (_, { name, password }) => {
            const user = User.findOne({name, password});
            return user;
        }
    },
    Mutation: {
        createUser: (_, {name, email, password}, {pubsub}) => {

            let user = new User({
                name,
                email,
                password
            });

            pubsub.publish(NEW_USER, {
                newUser: user
            });
            return user.save();
           
        },
        updateUser: (_, args, {res}) => {
            return User.findByIdAndUpdate({_id:args.id}, args, {new: true}, (err, _) => {
                if(err) {
                    return res.status(500).send(err)
                }
                pubsub.publish(USER_UPDATED, {
                    userUpdated: args.name
                })
                return
            })
        },
        addUserDetails: async (_, {name, password, nickname}) => {
            return await User.findOneAndUpdate({name, password}, {$set: {userDetails: {nickname}}}, {new: true} );
        },
        addJoke: async (_, {name, password, joke}) => {
            return await User.findOneAndUpdate({name, password}, {$set: {userDetails: {joke}}});
        }
    },
    Subscription: {
        newUser: {
            subscribe: () => pubsub.asyncIterator([NEW_USER])
        },
        userUpdated: {
            subscribe: () => pubsub.asyncIterator([USER_UPDATED])
        }
    }
}

const pubsub = new PubSub();

module.exports = {
    resolvers, pubsub
 } ;