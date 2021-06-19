class UserHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
    }

    async postUserHandler(request, h) {
        const { username, password, fullname } = request.payload;
        try {
            const id = await this._service.addUser({ username, password, fullname });
            return h.response({
                status: "success",
                message: "User berhasil ditambahkan",
                data: {
                    userId: id
                }
            }).code(201);
        } catch (error) {
            return h.response({
                status: 'error',
                message: '<apa pun selama tidak kosong>'
            }).code(500);
        }
    }
}

module.exports = UserHandler;