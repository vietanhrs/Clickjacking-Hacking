module.exports = (sequelize, Sequelize) => {
    const Account = sequelize.define("account", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING(30),
            allowNull: false
        },
        password: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
    }, {
        timestamps: false
    });

    return Account;

};