const fs = require('fs')

const bookmarksTxt = fs.readFileSync(__dirname + '/bookmarks.txt', 'utf-8')

var result = bookmarksTxt.split('\n').reduce(function (memo, line) {
	if (line.startsWith('\t\t\t')) { // passage
		var dayString = memo.state.month + '/' + memo.state.dayOfMonth
		if (!memo.result[dayString]) {
			memo.result[dayString] = []
		}
		var passage = memo.state.book + ' ' + line.trim()
		memo.result[dayString].push(passage)
		memo.state.dayOfMonth++
	} else if (line.startsWith('\t\t')) { // book
		memo.state.book = line.trim()
	} else if (line.startsWith('\t')) { // month
		memo.state.dayOfMonth = 1
		memo.state.month = line.trim()
	}
	return memo
}, {
	state: {
		month: null,
		book: null,
		dayOfMonth: 1
	},
	result: {
		// 'January 1': [ 'Genesis 1-2', 'Psalms 1', 'Matthew 1:1-17', 'Acts 1:1-11' ]
	}
}).result

const newIndexHtml = 'window.dayToPassagesMap = ' + JSON.stringify(result)
fs.writeFileSync(__dirname + '/../dayToPassagesMap.js', newIndexHtml)
