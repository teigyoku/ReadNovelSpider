const fs = require('fs')

const request = require('syncrequest')
const cheerio = require('cheerio')

const log = console.log.bind(console)

class Book {
    constructor() {
        this.name = ''
        this.author = ''
        this.quote = ''
        this.ranking = 0
        this.type = ''
        this.finish = ''
        this.coverUrl = ''
    }
}

const bookFromDiv = (div) => {
    let e = cheerio.load(div)
    let book = new Book()
    let info = e('.book-mid-info')
    book.name = info.find('h4').text()
    book.quote = e('.intro').text().replace(/(^\s*)|(\s*$)/g, "")
    book.coverUrl = 'http:' + e('.book-img-box').find('img').attr('src')
    book.ranking = e('.rank-tag').text()

    book.author = e('.name').text()

    let type = e('.author').find('a').slice(1)
    book.type = type.text()

    book.finish = e('.author').find('span').text()

    return book
}

const ensurePath = (path) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
}

const cachedUrl = (url) => {
    let directory = 'cached_html'
    ensurePath(directory)
    let file = url.slice(-1) + '.html'
    let cacheFile = directory + '/' + file
    log('cacheFile', cacheFile)
    let exists = fs.existsSync(cacheFile)
    log('fs.existsSync(cacheFile)',fs.existsSync(cacheFile))
    if (exists) {
        let data = fs.readFileSync(cacheFile)
        return data
    } else {
        let r = request.get.sync(url)
        let body = r.body
        fs.writeFileSync(cacheFile, body)
        return body
    }
}

const booksFromUrl = (url) => {
    let body = cachedUrl(url)
    let e = cheerio.load(body)
    let bookDivs = e('.rank-body').find('li')
    let books = []
    for (let i = 0; i < bookDivs.length; i++) {
        let div = bookDivs[i]
        let b = bookFromDiv(div)
        books.push(b)
    }
    return books
}

const saveBooks = (books) => {
    let s = JSON.stringify(books, null, 2)
    let path = './xs/book.json'
    fs.writeFileSync(path, s)
}

const downloadCovers = (books) => {
    let coverPath = 'covers'
    ensurePath(coverPath)
    const request = require('request')
    for (let i = 0; i < books.length; i++) {
        let b = books[i]
        let url = b.coverUrl
        let ranking = b.ranking
        let name = b.name.split(' / ')[0]
        let path = `${coverPath}/${ranking}_${name}.jpg`
        log('cover path', path)
        request(url).pipe(fs.createWriteStream(path))
    }
}

const __main = () => {
    let books = []
    for (let i = 1; i <= 7; i++) {
        let url = 'https://www.readnovel.com/rank/hotsales?period=3&pageNum=' + i
        let booksInPage = booksFromUrl(url)
        books = [...books, ...booksInPage]
    }
    saveBooks(books)
    downloadCovers(books)
    log('抓取成功, 数据已经写入到 book.json 中')
}

__main()
