const main = {
    1: {
        id: '1',
        userId: '1',
        text: 'Main: mess 1',
    },
    2: {
        id: '2',
        userId: '2',
        text: 'Main: kess 2',
    }
};

const bugs = {
    1: {
        id: '1',
        userId: '1',
        title: 'system error',
        description: 'lorenfksdl ksflksdl sdlksdlksdf kl s lksdflsdfsfsf'
    },
    2: {
        id: '2',
        userId: '2',
        title: 'DOM bug',
        description: 'slsfkl fjldios lposfifjslkfsf[sfpo3399dfkd   lkfosfjk 099sfjij 0ijksf'
    }
};

let users = {
    1: {
        id: '1',
        name: 'John',
        messageIds: [1],
        bugIds: [1],

    },
    2: {
        id: '2',
        name: 'Roma',
        messageIds: [2],
        bugIds: [2],
    },
}

module.exports = {
    main,
    bugs,
    users
};