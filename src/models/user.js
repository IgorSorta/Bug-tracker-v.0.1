const {
    DataTypes,
    Model,
} = require('sequelize');

const sequelize = require('./sequelize');
const Message = require('./message');
const Bug = require('./bug');

class User extends Model {}
User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'A user has have a name.'
            },
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'A user has have a email.'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                args: true,
                msg: 'A user has have a password.'
            }
        }
    },
}, {
    sequelize: sequelize,
    createdAt: false,
    updatedAt: false,
    modelName: 'user'
});

User.findByLogin = async (login) => {
    try {
        let user = await User.findOne({
            where: {
                name: login
            },
            include: [Message, Bug]
        });

        if (!user) {
            user = await User.findOne({
                where: {
                    email: login
                },
            });
        }
        return user;
    } catch (error) {
        console.log('Error: findByLogin ', error);
    }

};

module.exports = User;