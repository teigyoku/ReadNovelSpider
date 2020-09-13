const fs = require('fs')

const bookFilePath = 'xs/book.json'

const loadBooks = () => {
    let content = fs.readFileSync(bookFilePath, 'utf8')
    let bs = JSON.parse(content)
    return bs
}

const b = {
    data: loadBooks()
}

b.all = function() {
    let bs = this.data
    return bs
}

module.exports = b
