const express = require("express");
const path = require("path");
const session = require("express-session");
const crypto = require("crypto");
const sqlite3 = require("sqlite3");
const admin = require("./admin");

const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run("pragma foreign_keys = on");
  db.run(`create table thread(
    id text primary key,
    user text,
    title text,
    created_at integer
  )`);
  db.run("create index thread_index on thread(user, created_at)")
  db.run(`create table comment(
    id text primary key,
    thread text,
    text text,
    created_at integer,
    foreign key(thread) references thread(id) on delete cascade
  )`);
  db.run("create index comment_index on comment(thread, created_at)");
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public"), {index: false}));
app.use(session({
  secret: crypto.randomUUID(),
  resave: false,
  saveUninitialized: true,
  //  SameSite=Lax protects us from CSRF
  cookie: {sameSite: "lax"},
}));

function sendHtml(req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
}

app.get("/", sendHtml);
app.get("/threads/:id", sendHtml);
app.get("/report", sendHtml);

app.get("/api/threads", (req, res) => {
  //  Placeholders protect us from SQL injection
  db.all("select id, title from thread where user=$user order by created_at desc limit 1024",
    {$user: req.session.id},
    (err, rows) => {
      if (err) {
        res.json({error: "db error"});
        return;
      }
      res.json({threads: rows});
    });
});

app.post("/api/threads", (req, res) => {
  const title = req.body.title;
  if (!(typeof title==="string" && 0<title.length && title.length<=1024)) {
    res.json({error: "parameter error"});
    return;
  }
  const id = crypto.randomUUID();
  db.run("insert into thread(id, user, title, created_at) values($id, $user, $title, $created_at)",
    {$id: id, $user: req.session.id, $title: title, $created_at: new Date().getTime()},
    err => {
      if (err) {
        res.json({error: "db error"});
        return;
      }
      res.json({id});
    });
});

app.get("/api/threads/:id", (req, res) => {
  db.get("select title from thread where id=$id",
    {$id: req.params.id},
    (err, row) => {
      if (err) {
        res.json({error: "db error (thread)"});
        return;
      }
      if (row===undefined) {
        res.json({error: "not found"});
        return;
      }
      const title = row.title;
      db.all("select id, text from comment where thread=$thread order by created_at desc limit 1024",
        {$thread: req.params.id},
        (err, rows) => {
          if (err) {
            res.json({error: "db error (comments)"});
            return;
          }
          res.json({title, comments: rows});
        });
    });
});

app.post("/api/threads/:thread_id/comments", (req, res) => {
  const text = req.body.text;
  if (!(typeof text==="string" && 0<text.length && text.length<=1024)) {
    res.json({error: "parameter error"});
    return;
  }
  const comment_id = crypto.randomUUID();
  db.run("insert into comment(id, thread, text, created_at) values($id, $thread, $text, $created_at)",
    {$id: comment_id, $thread: req.params.thread_id, $text: text, $created_at: new Date().getTime()},
    err => {
      if (err) {
        res.json({error: "db error"});
        return;
      }
      res.json({id: comment_id});
    });
});

app.delete("/api/threads/:id", (req, res) => {
  db.run("delete from thread where id=$id",
    {$id: req.params.id},
    err => {
      if (err) {
        res.json({error: "db error"});
        return;
      }
      res.json({});
    });
});

//  There may be no vulnerabilities around report feature
//  ... at least, no intended vulnerabilities
const powTask = {};

app.post("/api/pow", (req, res) => {
  const task = crypto.randomUUID();
  powTask[req.session.id] = task;
  res.json({task});
});

app.post("/api/report", (req, res) => {
  const pow = req.body.pow;
  if (!(typeof pow==="string" && 0<pow.length && pow.length<=1024)) {
    res.json({result: "parameter error (pow)"});
    return;
  }
  const url = req.body.url;
  if (!(typeof url==="string" && 0<url.length && url.length<=1024)) {
    res.json({result: "parameter error (url)"});
    return;
  }

  //  check proof of work
  if (powTask[req.session.id]===undefined) {
    res.json({result: "no pow task"});
    return;
  }
  const hash = crypto.createHash("sha256").update(pow+powTask[req.session.id]).digest();
  if (!(hash[0]==0 && hash[1]==0 && hash[2]==0)) {
    res.json({result: "incorrect proof of work"});
    return;
  }
  delete powTask[req.session.id];
  //  admin can access only local network
  const urlLocal = url.replace(/^https?:\/\/[^\/]*/i, "http://localhost:3000");
  admin.checkPage(urlLocal)
    .then(result => {
      res.json({result});
    });
})

// error handler
app.use(function(err, req, res, next) {
  res.sendStatus(err.status || 500);
});

module.exports = app;
