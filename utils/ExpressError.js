class ExpressError extends Error {
    constructor(message){
        super();
        this.message = message;
    }
}

module.exports = ExpressError;