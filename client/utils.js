var THREE = require("three");

module.exports = {
  getChildrenByName:getChildrenByName,

};

function getChildrenByName (name){
  var children = [];
  this.traverse(function (child){
    if (child.name === name){
      children.push(child);
    }
  });
  return children;
}