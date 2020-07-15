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

    return User;
}

module.exports = user;