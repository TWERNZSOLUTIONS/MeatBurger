const bcrypt = require('bcrypt');


exports.hash = async (plain) => await bcrypt.hash(plain, 10);
exports.compare = async (plain, hash) => await bcrypt.compare(plain, hash);