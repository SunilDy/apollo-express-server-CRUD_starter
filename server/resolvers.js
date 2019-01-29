const { PubSub } = require('apollo-server-express');
const User = require('../Models/User');

// PUBSUB Consts
const NEW_USER = "NEW_USER";
const USER_DELETED = "USER_DELETED";
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
        deleteUser: (_, { name, password }, {pubsub}) => {
            User.findOneAndRemove({name, password}, (err, user) => {
                if(err) {
                    return err;
                }
                else {
                    pubsub.publish(USER_DELETED, {
                        userDeleted: user
                    });
                    return user;
                }
            });
        },
        updateUser: (_, {name, password, updateName}) => {
            User.findOneAndUpdate({name, password}, {$set: {name: updateName}}, (err, user) => {
                if(err) {
                    return err;
                } else {
                    pubsub.publish(USER_UPDATED, {
                        userUpdated: user
                    })
                    return user;
                }
                
            })
        }
    },
    Subscription: {
        newUser: {
            subscribe: () => pubsub.asyncIterator([NEW_USER])
        },
        userDeleted: {
            subscribe: () => pubsub.asyncIterator([USER_DELETED])
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