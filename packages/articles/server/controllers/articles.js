'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Article = mongoose.model('Article'), 
  _ = require('lodash');

/**
 * Find article by id
 */
exports.article = function(req, res, next, id) {
  Article.load(id, function(err, article) {
    if (err) return next(err);
    if (!article) return next(new Error('Failed to load article ' + id));
    req.article = article;
    next();
  });
};

/**
 * Create an article
 */
exports.create = function(req, res) {
  var article = new Article(req.body);
  article.user = req.user;

  article.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot save the article'
      });
    }
    res.json(article);

  });
};

/**
 * Update an article
 */
exports.update = function(req, res) {
  var article = req.article;

  article = _.extend(article, req.body);

  article.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot update the article'
      });
    }
    res.json(article);

  });
};

/**
 * Delete an article
 */
exports.destroy = function(req, res) {
  var article = req.article;

  article.remove(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot delete the article'
      });
    }
    res.json(article);

  });
};

/**
 * Show an article
 */
exports.show = function(req, res) {
  var article = req.article;
  article.visit += 1;
  article.save();
  res.json(req.article);
};

/**
 * List of Articles
 */
exports.all = function(req, res) {
  var page = req.param('page') || 1;
  var num = req.param('num') || 20;
  Article.find().sort('-created').skip((page - 1) * num).limit(num).populate('user', 'name username').exec(function(err, articles) {
    if (err) {
      return res.json(500, {
        error: 'Cannot list the articles'
      });
    }
    
    for (var i = articles.length - 1; i >= 0; i-=1) {
      var content = articles[i].content;
      if (content.length > 200) {
        var idx = content.indexOf('\n', 200);
        if (idx === -1 || idx > 400) {
          idx = 200;
        }
        articles[i].content = content.substring(0, idx);
      }
    }

    res.json(articles);

  });
};

exports.total = function(req, res) {
  Article.count().exec(function(err, num){
    if (err) {
      return res.json(500, {
        error: 'Cannot count the articles'
      });
    }
    
    res.json({total: num});
  });
};
