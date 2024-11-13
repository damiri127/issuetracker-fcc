'use strict';

const IssueModel = require("../model/model").Issue;
const ProjectModel = require("../model/model").Project;

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async (req, res) => {
      let projectName = req.params.project;
      try{
        const project = await ProjectModel.findOne({name: projectName});
        if(!project){
          res.json([{
            status_code: 404,
            error: "project not found"
          }]);
          return;
        }else{
          const issue = await IssueModel.find({
            projectId: project._id,
            ...req.query,
          });
          if(!issue){
            res.json([{
              status_code: 404,
              error: "issue not found"
            }]);
            return;
          }
          res.json(issue);
          return;
        }
      }catch(err){
        res.json({error: "couldn't get data", _id: _id});
      }
      
    })
    
    .post(async (req, res) => {
      let projectName = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text} = req.body;
      if (!issue_title || !issue_text || !created_by){
        res.json({error: "required field(s) missing"});
        return;
      }
      try{
        let projectModel = await ProjectModel.findOne({name: projectName});
        if(!projectModel){
          projectModel = new ProjectModel({name: projectName});
          projectModel = await projectModel.save();
        }
        const issueModel = new IssueModel({
          projectId: projectModel._id,
          issue_title: issue_title || "",
          issue_text: issue_text || "",
          created_on: new Date(),
          updated_on: new Date(),
          created_by: created_by || "",
          assigned_to: assigned_to || "",
          open: true,
        });
        const issue = await issueModel.save();
      }catch(err){
        res.json({error: "could not post data", err});
      }
    })
    
    .put(async (req, res) => {
      let projectName = req.params.project;
      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open,
      } = req.body;
      if (!_id){
        res.json([{
          status_code: 404,
          error: "missing_id"
        }]);
        return;
      }
      if (
        !issue_title &&
        !issue_text &&
        !created_by &&
        !assigned_to &&
        !status_text &&
        !open
      ){
        res.json([{
          status_code: 500,
          error: "no update fields sent", _id: _id
        }]);
        return;
      }
      try{
        const projectModel = await ProjectModel.findOne({name: projectName});
        if(!projectModel){
          throw new Error("project not found");
        }
        let issue = await IssueModel.findByIdAndUpdate(_id, {
          ...req.body,
          updated_on: new Date(),
        });
        await issue.save();
        res.json([{
          status_code: 200,
          result: "successfuly updated", _id: _id
        }]);
      }catch(err){
        res.json([{
          status_code: 500,
          error: "could not update", _id: _id
        }]);
      }
    })
    
    .delete(async (req, res) => {
      let projectName = req.params.project;
      const { _id } = req.body;
      if(!_id){
        res.json([{
          status_code: 404,
          error: "missing _id"
        }]);
        return;
      }
      try{
        const projectModel = await ProjectModel.findOne({name: projectName});
        if(!projectModel){
          throw new Error("project not found");
        }
        const result = await IssueModel.deleteOne({
          _id: _id
        });
        await result.delete();
      }catch(err){
        res.json([{
          status_code: 500,
          error: "could not delete", _id: _id
        }]);
      }
    });
    
};
