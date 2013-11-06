
/*
 * GET list of contacts
 */

exports.list = function(req, res){
  res.render('contacts_list', { title: 'memoze| contacts' });
};
