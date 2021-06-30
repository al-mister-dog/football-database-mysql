const sqlMethods = require('../utils/sql')

exports.getData = (req, res, next) => {
  const sql = sqlMethods.getData(req.body.id);
  sqlMethods.query(sql, res);
};

exports.filter = (req, res, next) => {
  const sql = sqlMethods.filter(req.body.selected, req.body.id)
  sqlMethods.query(sql, res);
};

exports.sort = (req, res, next) => {
  const sql = sqlMethods.sort(req.body.field, req.body.id, req.body.direction ? 'ASC' : 'DESC');
  sqlMethods.query(sql, res);
};

exports.sortFiltered = (req, res, next) => {
  const sql = sqlMethods.sortFiltered(req.body.selected, req.body.fieldToOrderBy, req.body.id, req.body.direction)
  sqlMethods.query(sql, res)
};