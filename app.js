const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect('mongodb://localhost:27017/wikiDB');

const articlesSchema ={
  title: String,
  content: String
};

const Article = mongoose.model('Article', articlesSchema)

////////////request targeting all articles/////////////

app.route('/articles')

.get(function(req, res){
  Article.find(function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err)
    }

  })
})

.post( function(req, res){

  const newArticle = new Article({
    title: req.body.title ,
    content: req.body.content
  }) ;
  newArticle.save(function(err){
    if(!err){
      res.send('successfully added the article')
    }else{
      res.send(err)
    }
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send('successfuly deleted the articles')
    }else{
      res.send(err)
    }
  })
});


////////////request targeting specific article/////////////

app.route('/articles/:articleTitle')
.get(function(req, res){
  Article.findOne({title:req.params.articleTitle}, function(err, specificArticle){
    if(!err){
      res.send(specificArticle)
    }else{
      res.send('no match article title was found')
    }
  })
})
.put(function(req, res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    function(err){
      if(!err){
        res.send('succecfully updated article')
      }
    }
  )
})
.patch(function(req, res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send('successfuly updated article')
      }
    }
  )
})
.delete(function(req, res){
  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
      if(!err){
        res.send('succecfully deleted article')
      }
    }
  )
})




app.listen(3000, function(){
  console.log('server runs on port 3000');
})
