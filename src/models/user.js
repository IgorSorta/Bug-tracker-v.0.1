const user = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        name: {
            type: DataTypes.STRING,
        },
    });

    User.associate = models => {
        User.hasMany(models.Message, {
            onDelete: 'CASCADE'
        });
        User.hasMany(models.Bug, {
            onDelete: 'CASCADE'
        });
    };

    User.findByLogin = async (login) => {
        let user = await User.findOne({
            where: {
                name: login
            },
        });

        if (!user) {
            user = await User.findOne({
                where: {
                    email: login
                },
            });
        }
        return user;
    };

    return User;
}

module.exports = user;