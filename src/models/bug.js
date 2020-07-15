const bug = (sequelize, DataTypes) => {
    const Bug = sequelize.define('bug', {
        text: {
            type: DataTypes.STRING,
        },
    });

    Bug.associate = models => {
        Bug.belongsTo(models.User);
    };

    return Bug;
};

module.exports = bug;