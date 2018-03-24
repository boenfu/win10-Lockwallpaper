import * as fs from "fs";
import * as os from "os";
var sizeOf =  require('image-size');

const h = "\\horizontal\\";
const v = "\\vertical\\";

const source = (()=>{
    let path = os.homedir()+"\\AppData\\Local\\Packages";
    let arr = fs.readdirSync(path);
    for (let i of arr){
        if(i.indexOf("Microsoft.Windows.ContentDeliveryManager")>-1){
            return `${path}\\${i}\\LocalState\\Assets\\`;
        }
    }
})();
const desktop = os.homedir()+"\\Desktop\\LockScreen\\";
const screens = fs.readdirSync(source);


const copy = screen=>{
    let img = sizeOf(`${source+screen}`);
    let direction;
    if(img.width != img.height && img.width > 500 && img.height > 500){
        img.width > img.height
            ? direction = h
            : direction = v
            fs.copyFile(`${source+screen}`, `${desktop+direction+screen}.${img.type}`, (err) => {
                if (err) throw err;
            });
    }
};

(()=>{
    try {
        fs.mkdirSync(desktop);
        fs.mkdirSync(desktop + h);
        fs.mkdirSync(desktop + v);
    }catch (e){
        console.log("目录已存在");
    }
    for (let i of screens){copy(i)};
    console.log("提取完成");
})();
