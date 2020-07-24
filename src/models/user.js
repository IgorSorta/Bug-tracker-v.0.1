const {
    DataTypes,
    Model,
} = require('sequelize');

const sequelize = require('./sequelize');
const bcrypt = require('bcrypt');
const Message = require('./message');
const Bug = require('./bug');
const createUUID = require('../helpers/createUUID');

class User extends Model {
    async generatePasswordHash() {
        const salt = 10;
        return await bcrypt.hash(this.password, salt);
    }

    async validatePassword(password) {
        return await bcrypt.compare(password, this.password);
    }
}
User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: () => createUUID(),
        primaryKey: true,
        allowNull: false,
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
            },
            isEmail: true
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
            },
            len: [6, 36],
        }
    },
    role: {
        type: DataTypes.STRING
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            user.password = await user.generatePasswordHash();
        }
    },
    sequelize: sequelize,
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