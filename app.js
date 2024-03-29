const express = require('express');
const pdf = require('html-pdf');
const fs = require('fs');
const app = express();
const port = 3000;
const path = require('path');


const htmlTemplatePath = path.join(__dirname, 'certificate-template.html');
let htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf-8');


function generateCertificate(data, res) {
    const options = { format: 'Letter' };
  
    pdf.create(htmlTemplate, options).toStream((err, stream) => {
      if (err) return console.log(err);
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${data.courseName}Certificate.pdf`);
  
      stream.pipe(res);
    });
  }
  
  app.get('/generateCertificate', (req, res) => {
    const assessmentData = {
      userName: req.query.userName || 'Default User',
      courseName: req.query.courseName || 'Default Course',
      issueDate: req.query.issueDate || 'Default Date',
      certificateId: req.query.certificateId || 'Default ID',
    };
    assessmentData.userName = assessmentData.userName.toUpperCase();
  
    htmlTemplate = htmlTemplate.replace('<span id="userName"></span>', assessmentData.userName);
    htmlTemplate = htmlTemplate.replace('<span id="courseName"></span>', assessmentData.courseName);
    htmlTemplate = htmlTemplate.replace('<span id="issueDate"></span>', assessmentData.issueDate);
    htmlTemplate = htmlTemplate.replace('<span id="certificateId"></span>', assessmentData.certificateId);
  
    generateCertificate(assessmentData, res);
  });
  
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
  