
/*
 * GET social network search page (start of adding contact process).
 */

exports.search = function(req, res){
  res.render('sn_search', { title: 'memozer | search network' });
};
