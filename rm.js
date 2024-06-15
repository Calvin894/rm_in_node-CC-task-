const fs = require('fs')

recur = false
dirs= []
for(let i=2;i<process.argv.length;i++){
    let arg = process.argv[i]
    if(arg[0] == '-'){
        if(arg=='--recursive'){
            recur = true
        }
        else{
            console.log("unknown option "+arg)
            process.exit(1)
        }
    }
    else{
        dirs.push(arg)
    }
}
if(dirs.length ==0){
    console.log('No files/directories provided')
    process.exit(0)
}
function del(path, opts={}){
    return new Promise( (resolve, reject) => {
        fs.rm(path,opts, (err) =>{
            if(err){
                //console.log("test")
                reject(err)
            }
            else{resolve()}
        })
    })
}
async function removeAll(){
    for(let i in dirs){
        if(fs.existsSync(dirs[i])){
            if(fs.statSync(dirs[i]).isDirectory()){
                if(recur){
                    await del(dirs[i],{recursive: true, force : true})
                    .catch( (_) => console.log("could not delete directory: "
                                                +dirs[i]+
                                                " or its subdirectories"))
                }
                else{
                    console.log(dirs[i]+" is a directory(--recursive not specified)")
                }
            }
            else{
                await del(dirs[i])
                .catch( (_) => console.log("could not delete file: "+dirs[i]))
            }
        }
        else{
            console.log("file or directory: "+dirs[i]+" does not exist or is not visible")
        }
    }
}
removeAll()