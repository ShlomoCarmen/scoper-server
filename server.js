const mongoose = require('mongoose');

var mongoDB = 'mongodb://127.0.0.1/scoper_DB';

mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema;

var Actor = new Schema({
    actorName: String,
    actorDescription: String,
    userStoreis: [String]
});

var Version = new Schema({
    rejectionExplenation: String,
    editorName: String,
    projectDescription: String,
    versionNumber: Number,
    date: { type: Date, default: Date.now },
    allActors: [Actor],
    assumptions: [String]
});

var Project = new Schema({
    projectName: String,
    allVersions: [Version]
});


var newProject = mongoose.model("newProject", Project);


const express = require('express');
var bodyParser = require('body-parser')

var app = express();

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
app.post("/createNewProject", function (req, res) {

    firstVersion = {
        projectName: req.body.projectName,
        allVersions: {
            rejectionExplenation: "",
            editorName: req.body.editorName,
            projectDescription: '',
            versionNumber: 1,
            allActors: [],
            assumptions:[]
        }
    }
    newProject.create(firstVersion, function (err, newProject) {

    })
    res.send("new project creaeted")

});

app.get('/allProjects', function (req, res) {
    newProject.find({}, "projectName", (err, newProject) => {
        res.send(newProject);
    })
});

app.get('/allActors/:projectId', function (req, res) {
    newProject.findById(req.params.projectId, (err, newProject) => {

        actors = newProject.allVersions[newProject.allVersions.length - 1].allActors;
        res.send(actors);
    })
});

app.get('/allData/:projctId', function (req, res) {
    newProject.findById(req.params.projctId, (err, newProject) => {

        corentVersion = newProject.allVersions[newProject.allVersions.length - 1];

        res.send(corentVersion);
    })
});

app.put('/newVersion/:projctId', function (req, res) {
    newProject.findById(req.params.projctId, (err, newProject) => {

        var correntVersion = newProject.allVersions[newProject.allVersions.length - 1];

        newVersion = {
            rejectionExplenation: "",
            editorName: req.body.editorName,
            projectDescription: correntVersion.projectDescription,
            versionNumber: correntVersion.versionNumber + 1,
            allActors: correntVersion.allActors,
            assumptions: correntVersion.assumptions

        }

        newProject.allVersions.push(newVersion);
        newProject.save();
        
        res.send('new version creaeted');
    })
});


app.put('/projectDescription/:projctId', function (req, res) {
    newProject.findById(req.params.projctId, (err, newProject) => {
        
        newProject.allVersions[newProject.allVersions.length - 1].projectDescription = req.body.projectDescription;
        
        newProject.save();
        res.send('new version creaeted');
    })
});

app.put('/rejection/:projctId', function (req, res) {
    newProject.findById(req.params.projctId, (err, newProject) => {
        
        newProject.allVersions[newProject.allVersions.length - 1].rejectionExplenation = req.body.rejectionExplenation;
        
        newProject.save();
        res.send('rejectionExplenation saved');
    })
});

app.put('/actor/:projctId', function (req, res) {
    newProject.findById(req.params.projctId, (err, newProject) => {
        newActor = {
            actorName: req.body.actorName,
            actorDescription: req.body.actorDescription,
            userStoreis: []
        }
        newProject.allVersions[newProject.allVersions.length - 1].allActors.push(newActor);
        
        newProject.save();
        res.send('actor added');
    })
});

app.put('/userStoreis/:projctId/:location', function (req, res) {
    newProject.findById(req.params.projctId, (err, newProject) => {
       
        newProject.allVersions[newProject.allVersions.length - 1].allActors[req.params.location].userStoreis.push(req.body.userStory);
        
        newProject.save();
        res.send('user story added');
    })
});

app.put('/editActor/:projctId/:location', function (req, res) {
    newProject.findById(req.params.projctId, (err, newProject) => {
       
        // newProject.allVersions[newProject.allVersions.length - 1].allActors[req.params.location].allActors.push(req.body);
        var edit = newProject.allVersions[newProject.allVersions.length - 1].allActors[req.params.location];
        edit.actorName = req.body.actorName;
        edit.actorDescription = req.body.actorDescription;
        
        newProject.save();
        res.send('user story added');
    })
});

app.put('/assumptions/:projctId', function (req, res) {
    newProject.findById(req.params.projctId, (err, newProject) => {
       
        newProject.allVersions[newProject.allVersions.length - 1].assumptions = req.body.assumptions;
        
        newProject.save();
        res.send('assumptions added');
    })
   
});

app.delete('/actor/:projctId/:location', function (req, res) {
    newProject.findById(req.params.projctId, (err, newProject) => {
       
        newProject.allVersions[newProject.allVersions.length - 1].allActors.splice(req.params.location, 1);
       
        newProject.save();
        res.send('actor deleted');
    })
});

app.delete('/userStory/:projctId/:actorLocation/:storyLocation', function (req, res) {
    newProject.findById(req.params.projctId, (err, newProject) => {
       
        newProject.allVersions[newProject.allVersions.length - 1].allActors[req.params.actorLocation].userStoreis.splice(req.params.storyLocation, 1);
       
        newProject.save();
        res.send('actor deleted');
    })
});

app.put('/userStory/:projctId/:actorLocation/:storyLocation', function (req, res) {
    newProject.findById(req.params.projctId, (err, newProject) => {
        console.log('====================================');
        console.log(req.body);
        console.log('====================================');
       // לא עובד
        // newProject.allVersions[newProject.allVersions.length - 1].allActors[req.params.actorLocation].userStoreis[req.params.storyLocation] = req.body.userStory;
       var edit = newProject.allVersions[newProject.allVersions.length - 1].allActors[req.params.actorLocation].userStoreis[req.params.storyLocation];
       edit = req.body.userStory
       
        newProject.save();
        res.send('userStory updated');
    })
});


app.listen(5000);