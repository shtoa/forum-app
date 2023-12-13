

module.exports = function(app, forumData) {

    // Handle our routes
    app.get('/',function(req,res){

        let topicsQuery = "CALL getAvailableTopics(); CALL getRecentPosts;"; // query database to get all the books
                // execute sql query
                db.query(topicsQuery,[1,2],(err, results) => {
                    if (err) {
                        res.redirect('../'); 
                        console.log(err)
                    }
                    let topicData = Object.assign({}, forumData, {availableTopics:results[0],recentPosts:results[2], session: req.session});
            
                    res.render('index.ejs', topicData)
                });
     
    });


    app.get("/topics/:topic/posts",function(req,res){
        
        let postsQuery = `SELECT postTable.Title as postTitle, postTable.PostID ,users.Username, postTable.createdAt FROM (SELECT posts.PostID, posts.Title, posts.UserID, posts.createdAt from posts JOIN topics ON posts.TopicID = topics.TopicID where topics.Title = "${req.params.topic}") as postTable JOIN users ON users.UserID = postTable.UserID; CALL getAvailableTopics();`;
                // execute sql query
                db.query(postsQuery,[1,2],(err, results) => {
                    if (err) {
                        res.redirect('../'); 
                        console.log(err)
                    }
                    let postsData = Object.assign({}, forumData, {availablePosts:results[0], topic: req.params.topic,session: req.session, availableTopics:results[1]});
            
                    res.render('posts.ejs', postsData)
                
                });
        

    });

    app.get("/topics/:topic/posts/:postid/:post",function(req,res){
        
        let postQuery = `CALL getPostInfo("${req.params.postid}"); CALL getAvailableTopics();`; // remove password



        db.query(postQuery,[1,2], (err, results) => {
            if (err) {
                res.redirect('../'); 
                console.log(err)
            }
            //console.log(result);
            let postData = Object.assign({}, forumData, {post:results[0], topic: req.params.topic,session: req.session, availableTopics: results[2]});
    
            res.render('post.ejs', postData);
        
        });


    });

 
    app.post('/topicadded', function (req,res) {
        // saving data in database
        let sqlquery = `INSERT INTO topics (Title, UserID) VALUES (?,"${req.session.user_id}")`;
        // execute sql query
        let newrecord = [req.body.topic];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
            return console.error(err.message);
            } else {
                res.redirect(`./topics/${newrecord[0]}/posts`)
            }
        });

    });    

    app.post('/postadded', function (req,res) {
        
       

        //console.log(req.body.topic);

        // this was changed please check
        var sqlquery;
        // saving data in database
        if(req.body.topic == null){
            const regex = /(?<=topics\/)(.*)(?=\/posts)/
            var topic = regex.exec(req.get('Referrer'))[0];
            sqlquery = `INSERT INTO posts (TopicID,UserID,Title,Content) VALUES ((SELECT TopicID FROM topics where Title = "${topic}"),"${req.session.user_id}",?,?)`;
        } else {
            sqlquery = `INSERT INTO posts (TopicID,UserID,Title,Content) VALUES ((SELECT TopicID FROM topics where Title = "${req.body.topic}"),"${req.session.user_id}",?,?)`;
            var topic = req.body.topic;
        }

        // check if user is member 

        if(req.session.memberships.some((membership)=>(membership.Title == topic))){
            // execute sql query
            let newrecord = [req.body.title, req.body.content];
            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                res.send('<script>window.location.href = "/"; alert("This Topic Doesnt Exist"); </script>');
                return console.error(err.message);
    
                } else {
                    res.redirect(`./topics/${topic}/posts/${result.insertId}/${newrecord[0]}`)
                }
            });
        } else {
            res.send('<script>window.location.href = "/"; alert("Please Join Topic to Add Posts"); </script>')
        }

    });  
    
    app.get('/search',function(req,res){
        let searchData = Object.assign({}, forumData, {session: req.session});
        res.render("search.ejs", searchData);
    });


    app.get('/search-result', function (req, res) {
                //searching in the database
               
                let sqlquery = `CALL searchTopics("${req.query.keyword}"); CALL searchPostTitle("${req.query.keyword}"); CALL searchPostContent("${req.query.keyword}"); CALL searchUsers("${req.query.keyword}"); CALL getAvailableTopics();`; 
                // execute sql query
                db.query(sqlquery, [1,2,3,4,5], (err, results) => {
                    if (err) {
                        res.redirect('../'); 
                        console.log(err)
                    }

                    let searchData = Object.assign({}, forumData, {topicResults: results[0], postTitleResults: results[2], postContentsResults: results[4], userResults: results[6], availableTopics: results[8], keyword: req.query.keyword, session: req.session});
                    res.render("searchresult.ejs", searchData)
                 });
    });

    app.get('/topics/:topic/posts/search-result', function (req, res) {
        //searching in the database
       
        let sqlquery = "SELECT * FROM posts where title like " + "'%" + req.query.keyword + "%'"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('../',forumData); 
                console.log(err)
            }
            let searchData = Object.assign({}, forumData, {availableResults:result, keyword: req.query.keyword, session: req.session});
            res.render("searchresult.ejs", searchData)
         });
});

app.get("/login", function(req,res){

    let topicQuery = "CALL getAvailableTopics();"

    db.query(topicQuery, (err, result) => {
        if (err) {
            res.redirect('../',forumData); 
            console.log(err)
        }
        let loginData = Object.assign({}, forumData, {session: req.session, availableTopics: result[0]});
        res.render("login.ejs",loginData)
     });


   

})

app.get("/register", function(req,res){

    let topicQuery = "CALL getAvailableTopics();"

    db.query(topicQuery, (err, result) => {
        if (err) {
            res.redirect('../',forumData); 
            console.log(err)
        }
        let registerData = Object.assign({}, forumData, {session: req.session, availableTopics: result[0]});
        res.render("register.ejs",registerData);
     });


})

app.post("/registered", function(req,res){
    let newrecord = [req.body.password, req.body.username, req.body.email,req.body.firstname,req.body.lastname];
    let sqlquery = `INSERT INTO users (Password,Username,Email,Firstname,Lastname) VALUES (?,?,?,?,?)`;

    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
        return console.error(err.message);
        } else {
            res.redirect("./login")
        }
    });
})

app.post("/login", function(req,res,next){

  

    var user_email = req.body.email;
    var user_password = req.body.password;

    if(user_email && user_password){

        let loginQuery = `SELECT * from users where Email = "${user_email}"`;
        db.query(loginQuery, (err, result) => {
            if (err) {
                res.redirect('./'); 
                console.log(err)
            }

            if(result[0].Password == user_password){
                req.session.user_id = result[0].UserID;
                
                let membershipQuery = `CALL getMemberships(${result[0].UserID})`;

                db.query(membershipQuery, (err, result) => {
                    if (err) {
                        res.redirect('./'); 
                        console.log(err)
                    } else {
                        //console.log(req.session)
                        req.session.memberships = result[0];
                        console.log(req.session.memberships);
                        res.redirect("./")

                    }
                });

            } else {
                res.send('<script>window.location.href = "./login"; alert("Incorrect Email or Password"); </script>')
            }
         });

    } else {

        res.send('<script>window.location.href = "./"; alert("Please Enter Email and Password"); </script>');
    }

})

app.get('/logout',function(req,res,next){
    
    req.session.destroy();
    res.redirect("./")

})
                  
app.get('/account',function(req,res){
    // this breaks if there arent any posts
    let accountQuery = `CALL getAccountInfo(${req.session.user_id}); CALL checkUsersPosts(${req.session.user_id}); CALL checkUsersTopics(${req.session.user_id});`

         db.query(accountQuery, [1,2,3],(err, result) => {
            if (err) {
            return console.error(err.message);
            } else {
                //console.log(result[2]);
                let accountData = Object.assign({}, forumData, {accountInfo: result[0], availablePosts: result[2], availableTopics: result[4], session: req.session});
                console.log("----")
                console.log(accountData.availableTopics);
                console.log("----")
                res.render('account.ejs',accountData)
            }
        });

   

})

app.get('/user/:username',function(req,res){


    let userIDQuery = `SELECT UserID FROM users WHERE Username = "${req.params.username}"; CALL getAvailableTopics();`

    
  

    Forum_UserID = db.query(userIDQuery, [1,2],(err, results) => {
        if (err) {
            return console.error(err.message);
            } else {
       
                var UserID = results[0][0].UserID;
                console.log(results[3]);
                var availableTopics = results[1];
                
                
                let userQuery = `CALL getAccountInfo(${UserID}); CALL checkUsersPosts(${UserID}); CALL getMemberships(${UserID});`

                db.query(userQuery, (err, result) => {
                    if (err) {
                        return console.error(err.message);
                    } else {

                        let accountData = Object.assign({}, forumData, {accountInfo: result[0], userPosts: result[2], userTopics: result[4], availableTopics: availableTopics, session: req.session});
                        res.render('user.ejs',accountData)
                    }
                });


            }
    });   

})
            
app.post('/account/change/:property',function(req,res){

    let userQuery = `SELECT *  FROM (SELECT posts.PostID as postID, posts.Title as postTitle, posts.Content as postContent, 
        posts.CreatedAt as postCreatedAt, topics.Title as topicTitle, 
        topics.CreatedAt as topicCreatedAt, posts.UserID
         from posts INNER JOIN topics ON posts.TopicID = topics.TopicID 
         where topics.UserID = "${req.session.user_id}" && posts.UserID = "${req.session.user_id}") as userMade 
         JOIN users ON users.UserID = userMade.UserID;`

         db.query(userQuery, (err, result) => {
            if (err) {
            return console.error(err.message);
            } else {
                
                if(req.params.property == "password"){
                    if(result[0].Password != req.body.oldpassword){
                        res.send('<script>window.location.href = "./"; alert("Wrong Old Password"); </script>');
                    } else {
                        let userUpdated = `UPDATE users set ${req.params.property.charAt(0).toUpperCase() + req.params.property.slice(1)} = "${req.body.newpassword}" where UserID = "${req.session.user_id}"`
                        
                        db.query(userUpdated, (err, result) => {
                            if (err) {
                                return console.error(err.message);
                            }else{
                                res.send('<script>window.location.href = "./"; alert("Password Changed"); </script>');
                            }
                        });
            }
                } else {
                    // check if there is better way to do it
                    let userUpdated = `UPDATE users set ${req.params.property.charAt(0).toUpperCase() + req.params.property.slice(1)} = "${Object.values(req.body)[0]}" where UserID = "${req.session.user_id}"`
                    db.query(userUpdated, (err, result) => {
                        if (err) {
                            return console.error(err.message);
                        } else{
                            res.redirect("../");
                        }
                    });
                }
                
            }
        });




});

app.post('/topics/:topicTitle/posts/:postID/edit',function(req,res){

    let updatePost = `UPDATE posts set Title = "${req.body.newtitle}", Content = "${req.body.newcontent}" where ((PostID = "${req.params.postID}") & (UserID = "${req.session.user_id}"))`;
    db.query(updatePost, (err, result) => {
        if (err) {
            return console.error(err.message);
        } else{
            res.redirect("../../../../account");
        }
    });

})

app.post('/topics/:topicTitle/posts/:postID/delete',function(req,res){

    let deletePost = `DELETE FROM posts where ((PostID = "${req.params.postID}") & (UserID = "${req.session.user_id}"))`;
    db.query(deletePost, (err, result) => {
        if (err) {
            return console.error(err.message);
        } else{
            res.redirect("../../../../account");
        }
    });

})

app.post("/topics/:topic/join", function(req,res,next){

    let joinTopic = `CALL joinTopic(${req.session.user_id},"${req.params.topic}");`;

    db.query(joinTopic, (err, result) => {
        if (err) {
            return console.error(err.message);
        } else{

            let membershipQuery = `CALL getMemberships(${req.session.user_id})`;

                db.query(membershipQuery, (err, result) => {
                    if (err) {
                        res.redirect(`./../topics/${req.params.topic}/posts`);
                        console.log(err)
                    } else {
                        //console.log(req.session)
                        req.session.memberships = result[0];
                        console.log(req.session.memberships);
                        res.redirect(`./../topics/${req.params.topic}/posts`);

                    }
                });
            
        }
    });

});

}