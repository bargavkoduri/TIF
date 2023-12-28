const {Snowflake} = require("@theinternetfolks/snowflake")
var slugify = require("slugify");

const generateId = () => {
    return Snowflake.generate()
}

const generateUniqueSlug = (count,name) => {
    return (count+1)+"-"+slugify(name)
}

module.exports = {generateId,generateUniqueSlug}