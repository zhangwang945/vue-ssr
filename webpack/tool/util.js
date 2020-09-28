module.exports = {
    getEntry(items) {
        return items.reduce(function (entry, item) {
            entry[item.entryName] = item.entryPath
            return entry
        }, {})
    }
}