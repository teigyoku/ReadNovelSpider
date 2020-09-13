const book = require('../model/book')

const all = {
    path: '/api/book/all',
    method: 'get',
    func: function(request, response) {
        let bs = book.all()
        let r = JSON.stringify(bs)
        response.send(r)
    }
}

const routes = [
    all,
]

module.exports.routes = routes
