let fs=require("fs");
var path=require("path");


function getDirFiles(extensions, p){
  return new Promise((resolve, reject)=>{
fs.readdir(
  p ,
  (err,files)=>{
    if(err){reject(err);return;}
    let obj={}
      files.map((file)=>{
        return path.join(p,file);
      }).filter(
        (file, f)=>{
          return extensions.indexOf(path.extname(file))!== -1

    }).forEach((file)=>{
      let ext=path.extname(file);
      let fileName=path.basename(file);

      if(!obj.hasOwnProperty(ext)){
        obj[ext]={}
      }
       obj[ext][fileName]={};
       obj[ext][fileName].path=p
       obj[ext][fileName].content=fs.readFileSync(file)

    //  console.log("%s (%s)", file, path.extname(file));
    })
    resolve(obj)
  })
})
}
function extractJson(filesObj){
  return new Promise((resolve, reject)=>{
    try{
  if(filesObj.hasOwnProperty(".json")){
    jsonObj=filesObj[".json"];//console.log(jsonObj)
    for(let key in jsonObj){//console.log(jsonObj[key])
      jsonObj[key].content=JSON.parse(jsonObj[key].content.toString())
    }
    resolve(Object.assign({},filesObj,{".json":jsonObj}))
  }
  else{resolve(filesObj)}
}
catch(e){reject(e)}

  })

}
function extractText(filesObj){
  return new Promise((resolve, reject)=>{
    let txtExt=['.txt','.md'];
    let newObj;
    try{

    txtExt.forEach((ext)=>{
      let txtObj=filesObj[ext]
      if(filesObj.hasOwnProperty(ext)){

        for(let key in txtObj){
          txtObj[key].content=txtObj[key].content.toString();
        }
        newObj=Object.assign({},filesObj[ext],txtObj)
      }
      })
      resolve(Object.assign({},filesObj,newObj))
}
catch(e){reject(e)}

  })

}
getDirFiles([".md",".json"],"/projects/personal/testing" )
.then(extractJson)
.then(extractText)
.then((fileData)=>{
  console.log(fileData)
}).catch((e)=>{console.log(e)})
