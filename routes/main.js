

module.exports = function(app, forumData) {

    // Handle our routes
    app.get('/',function(req,res){

        let topicsQuery = "CALL getAvailableTopics(); CALL getRecentPosts;"; 
                // execute sql query
                db.query(topicsQuery,[1,2],(err, results) => {
                    if (err) {
                        res.redirect('../'); 
                        console.log(err)
                    }
                    let topicData = Object.assign({}, forumData, {availableTopics:results[0],recentPosts:results[2], session: req.session, page: req.query.page ?? 1});
            
                    res.render('index.ejs', topicData)
                });
     
    });

    app.get('/about',function(req,res){

        let topicsQuery = "CALL getAvailableTopics();"; 
                // execute sql query
                db.query(topicsQuery,(err, results) => {
                    if (err) {
                        res.redirect('../'); 
                        console.log(err)
                    }
                    let topicData = Object.assign({}, forumData, {availableTopics:results[0], session: req.session});
            
                    res.render('about.ejs', topicData)
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
                    let postsData = Object.assign({}, forumData, {availablePosts:results[0], topic: req.params.topic,session: req.session, availableTopics:results[1], page: req.query.page ?? 1});
            
                    res.render('posts.ejs', postsData)
                
                });
        

    });

    app.get("/topics/:topic/posts/:postid/:post",function(req,res){
        
        let postQuery = `CALL getPostInfo("${req.params.postid}"); CALL getAvailableTopics(); CALL getComments(${req.params.postid})`; 



        db.query(postQuery,[1,2,3], (err, results) => {
            if (err) {
                res.redirect('../'); 
                console.log(err)
            }
            //console.log(results[4]);
            let postData = Object.assign({}, forumData, {post:results[0], topic: req.params.topic,session: req.session, availableTopics: results[2], comments: results[4], page: req.query.page ?? 1});
    
            res.render('post.ejs', postData);
        
        });


    });

 
    app.post('/topicadded', function (req,res) {
        // saving data in database
        let sqlquery = `SELECT * FROM topics; INSERT INTO topics (Title, UserID) VALUES ("${req.body.topic}",${req.session.user_id});`;
        // execute sql query
        db.query(sqlquery, [1,2], (err, result) => {
            if (err) {
                if(Object(result[0]).some((topic)=>(topic.Title == req.body.topic))){
                    res.send(`<script>window.location.href = "/topics/${req.body.topic}/posts"; alert("This Topic Already Exists"); </script>`)
                } 

                return console.error(err.message);
        
            } else {
                res.redirect(`./topics/${req.body.topic}/posts`)
            }
        });

    });    


    app.post('/commentadded', function (req,res) {
        // saving data in database

        const regex = /(?<=posts\/)(.*)(?=\/)/i;
        var PostID = regex.exec(req.get('Referrer'))[0];

        console.log(req.body.comment);
        let addcomment = `CALL addComment("${req.body.comment}",${req.session.user_id},${PostID});`;
        
        db.query(addcomment, (err, result) => {
            if (err) {
            return console.error(err.message);
            } else {
                res.redirect(req.get('Referrer'));
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

        if(!req.session.memberships.some((membership)=>(membership.Title == topic))){
            res.send(`<script>window.location.href = "./topics/${topic}/posts"; alert("Please Join Topic to Add Posts"); </script>`);
        } else{


        // check if user is member 

        
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

                    if(req.query.results == "Topics"){
                        console.log("hello");
                    }

                    let searchData = Object.assign({}, forumData, {topicResults: results[0], postTitleResults: results[2], postContentsResults: results[4], userResults: results[6], availableTopics: results[8], keyword: req.query.keyword, session: req.session, page: req.query.page ?? 1, tab: req.query.tab ?? "Topics"});
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

    db.query(topicQuery,(err, result) => {
        if (err) {
            res.redirect('../',forumData); 
            console.log(err)
        }



        let registerData = Object.assign({}, forumData, {session: req.session, availableTopics: result[0]});


      

        res.render("register.ejs",registerData);
     });


})

app.post("/registered", function(req,res){
    
    let userQuery = "SELECT * FROM users;"

    db.query(userQuery,(err, result) => {
        if (err) {
            res.redirect('../',forumData); 
            console.log(err)
        } else {

    if(Object(result).some((user)=>(user.Username == req.body.username)) && Object(result).some((user)=>((user.Email == req.body.email)))){
        res.send(`<script>window.location.href = "${req.get('Referrer')}"; alert("Username and Email Already Exist"); </script>`);
    } else if (Object(result).some((user)=>((user.Email == req.body.email)))){

        res.send(`<script>window.location.href = "${req.get('Referrer')}"; alert("Email Already Exists"); </script>`);  

    } else if (Object(result).some((user)=>((user.Username == req.body.username)))) {

        res.send(`<script>window.location.href = "${req.get('Referrer')}"; alert("Username Already Exists"); </script>`);  

    } else {
    
        let newrecord = [req.body.password, req.body.username, req.body.email,req.body.firstname,req.body.lastname];
        let registerQuery = ` INSERT INTO users (Password,Username,Email,Firstname,Lastname) VALUES (?,?,?,?,?);`;

        db.query(registerQuery, newrecord,(err, result) => {
            if (err) {
            return console.error(err.message);
            } else {

                res.redirect("./login")

                

        
            }
        });
    }
    }
});
});

app.post("/login", function(req,res,next){

  

    var user_email = req.body.email;
    var user_password = req.body.password;

    if(user_email && user_password){

        let loginQuery = `SELECT * from users where Email = "${user_email}"`;
        db.query(loginQuery, (err, result) => {
            if (err) {
                
                return console.log(err)
            } else {

                console.log(result);
            
            if (result.length == 0){
                res.send('<script>window.location.href = "./login"; alert("Incorrect Email or Password"); </script>') 
            }

            else if(result[0].Password == user_password){
                req.session.user_id = result[0].UserID;
                req.session.admin = result[0].adminRights;
                
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
    let accountQuery = `CALL getAccountInfo(${req.session.user_id}); CALL checkUsersPosts(${req.session.user_id}); CALL checkUsersTopics(${req.session.user_id}); CALL getAvailableTopics();`

         db.query(accountQuery, [1,2,3,4],(err, result) => {
            if (err) {
            return console.error(err.message);
            } else {
                //console.log(result[2]);
                let accountData = Object.assign({}, forumData, {accountInfo: result[0], accountPosts: result[2], accountTopics: result[4], availableTopics: result[6],session: req.session, page: req.query.page ?? 1, tab: req.query.tab ?? "Details"});
                console.log("----")
                console.log(accountData.availableTopics);
                console.log("----")
                res.render('account.ejs',accountData)
            }
        });

   

})

app.get('/admin',function(req,res){
    // this breaks if there arent any posts

    let adminQuery = "SELECT * FROM topicsauthors JOIN users ON topicsauthors.UserID = users.UserID; SELECT * FROM postsusername; SELECT * FROM users; CALL getAvailableTopics();"

         db.query(adminQuery, [1,2,3,4],(err, result) => {
            if (err) {
            return console.error(err.message);
            } else {
                console.log(result[2]);
                let adminData = Object.assign({}, forumData, {allTopics: result[0], allPosts: result[1], allUsers: result[2], availableTopics: result[3], session: req.session, page: req.query.page ?? 1, tab: req.query.tab ?? "All Topics"});
                res.render('admin.ejs',adminData)
            }
        });

   

   

})

app.get('/user/:username',function(req,res){


    let userIDQuery = `SELECT UserID FROM users WHERE Username = "${req.params.username}"; CALL getAvailableTopics();`

    
  

    Forum_UserID = db.query(userIDQuery, [1,2,3],(err, results) => {
        if (err) {
            return console.error(err.message);
            } else {
       
                var UserID = results[0][0].UserID;
                console.log(results[3]);
                var availableTopics = results[1];
                
                
                let userQuery = `CALL getAccountInfo(${UserID}); CALL checkUsersPosts(${UserID}); CALL getMemberships(${UserID}); CALL checkUsersTopics(${UserID});`

                db.query(userQuery, (err, result) => {
                    if (err) {
                        return console.error(err.message);
                    } else {

                        let accountData = Object.assign({}, forumData, {accountInfo: result[0], userPosts: result[2], userMemberships: result[4], userTopics: result[6],availableTopics: availableTopics, session: req.session, page: req.query.page ?? 1, tab: req.query.tab ?? "Posts"});
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
                        res.send('<script>window.location.href = "../"; alert("Wrong Old Password"); </script>');
                    } else {
                        let userUpdated = `UPDATE users set ${req.params.property.charAt(0).toUpperCase() + req.params.property.slice(1)} = "${req.body.newpassword}" where UserID = "${req.session.user_id}"`
                        
                        db.query(userUpdated, (err, result) => {
                            if (err) {
                                return console.error(err.message);
                            }else{
                                res.send('<script>window.location.href = "../"; alert("Password Changed"); </script>');
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
            res.redirect(req.get('Referrer'));
        }
    });

})

app.post('/topics/:topicTitle/posts/:postID/delete',function(req,res){

    let deletePost = `DELETE FROM posts where ((PostID = "${req.params.postID}") & (UserID = "${req.session.user_id}"))`;
    db.query(deletePost, (err, result) => {
        if (err) {
            return console.error(err.message);
        } else{
            res.redirect(req.get('Referrer'));
        }
    });

})


app.post('/topics/:topicTitle/posts/:PostID/comment/:ReplyID/delete',function(req,res){

    let deleteComment = `CALL deleteComment(${req.params.ReplyID},${req.session.user_id});`;
    db.query(deleteComment, (err, result) => {
        if (err) {
            return console.error(err.message);
        } else{
            res.redirect(req.get('Referrer'));
        }
    });

})


app.post('/topics/:topicTitle/posts/:PostID/comment/:ReplyID/edit',function(req,res){

    let deleteComment = `CALL editComment("${req.body.newcontent}",${req.params.ReplyID},${req.session.user_id});`;
    db.query(deleteComment, (err, result) => {
        if (err) {
            return console.error(err.message);
        } else{
            res.redirect(req.get('Referrer'));
        }
    });

})




app.post('/account/delete',function(req,res){

    let deletePost = `CALL deleteAccount("${req.session.user_id}");`;
    db.query(deletePost, (err, result) => {
        if (err) {
            return console.error(err.message);
        } else{
            res.redirect("/logout");
        }
    });

})

app.post('/topics/:topicTitle/delete',function(req,res){

    let deletePost = `CALL deleteTopic("${req.params.topicTitle}");`;
    db.query(deletePost, (err, result) => {
        if (err) {
            return console.error(err.message);
        } else{
            res.redirect(req.get('Referrer'));
        }
    });

})

app.post('/topics/:topicTitle/edit',function(req,res){

    let deletePost = `CALL editTopic("${req.params.topicTitle}","${req.body.newtitle}");`;
    db.query(deletePost, (err, result) => {
        if (err) {
            return console.error(err.message);
        } else{
            res.redirect(req.get('Referrer'));
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
                        res.redirect(`../../topics/${req.params.topic}/posts`);
                        console.log(err)
                    } else {
                        //console.log(req.session)
                        req.session.memberships = result[0];
                        console.log(req.session.memberships);
                        res.redirect(`../../topics/${req.params.topic}/posts`);

                    }
                });
            
        }
    });

});

app.post("/topics/:topic/leave", function(req,res,next){

    let joinTopic = `CALL leaveTopic(${req.session.user_id},"${req.params.topic}");`;

    db.query(joinTopic, (err, result) => {
        if (err) {
            return console.error(err.message);
        } else{

            let membershipQuery = `CALL getMemberships(${req.session.user_id})`;

                db.query(membershipQuery, (err, result) => {
                    if (err) {
                        res.redirect(req.get('Referrer'));
                        console.log(err)
                    } else {
                        //console.log(req.session)
                        req.session.memberships = result[0];
                        console.log(req.session.memberships);
                        res.redirect(req.get('Referrer'));

                    }
                });
            
        }
    });

});

}