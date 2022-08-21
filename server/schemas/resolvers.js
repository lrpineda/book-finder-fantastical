const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user){
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('savedBooks');
                return userData;
            }
            throw new AuthenticationError('You must be logged in');
        },

        users: async () => {
            return User.find()
                .select('-__v -password')
                .populate('savedBooks');
        },
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, {email, password} ) => {
            const user = await User.findOne({ email });
            if(!User) {
                throw new AuthenticationError('Invalid credentials');
            }
            const correctPassword = await user.isCorrectPassword(password);
            if(!correctPassword){
                throw new AuthenticationError('Invalid credentials');

            }
            const token = signToken(user);
            return {token, user};

        },
        saveBook: async (parent, args, context) => {
            if(context.user){
                const user = await User.findOneAndUpdate({ _id: context.user._id }, { $push: { savedBooks: args } }, { new: true });
                return user.savedBooks[user.savedBooks.length - 1];
            }
            throw new AuthenticationError('You must be logged in');
        },
        removeBook: async (parent, args, context) => {
            if(context.user){
                const user = await User.findOneAndUpdate({ _id: context.user._id }, { $pull: { savedBooks: { bookId: args.bookId } } }, { new: true });
                return user.savedBooks[user.savedBooks.length - 1];
            }
            throw new AuthenticationError('You must be logged in');
        }
    }
};

module.exports = resolvers;