var radius=4;
var sphereMesh=require('primitive-sphere')(radius, {
  segments: 16
});

const cols = 400, rows=400,scale=200;
function scaleRow(x){
  return ((x/cols)*scale)-(scale/2);
}
function scaleCol(y)
{
  return ((y/rows)*scale)-(scale/2);
}
var gridMesh={
    positions: (new Array(rows*cols).fill(0).map((v,i)=>{
                  let xp=i%cols;
                  let yp=(i-xp)/cols;

                return [
                  [scaleRow(xp),scaleCol(yp)],
                  [scaleRow(xp+1),scaleCol(yp)],
                  [scaleRow(xp),scaleCol(yp+1)],

                  [scaleRow(xp),scaleCol(yp+1)],
                  [scaleRow(xp+1),scaleCol(yp)],
                  [scaleRow(xp+1),scaleCol(yp+1)],

                ];
              }).reduce((v,i)=>v.concat(i))),
    cells: undefined
};


writeMeshToFile(gridMesh,'mesh.json');
function writeMeshToFile(mesh,fileName)
{
  var meshJSON=JSON.stringify(mesh);
  var fs=require('fs');
return fs.writeFile(fileName,meshJSON,'utf8',(e)=>console.log(!e?'done writing file':['error writing file',e],fileName));
}
