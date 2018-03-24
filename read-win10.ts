import * as fs from "fs";
import * as os from "os";

const sizeOf =  require('image-size');
//设置横竖屏路径
const h = "\\horizontal\\";
const v = "\\vertical\\";
//获取锁屏地址
const source = (()=>{
    let path = os.homedir()+"\\AppData\\Local\\Packages";
    let arr = fs.readdirSync(path);
    for (let i of arr){
        if(i.indexOf("Microsoft.Windows.ContentDeliveryManager")>-1){
            return `${path}\\${i}\\LocalState\\Assets\\`;
        }
    }
})();
//设置输出路径
const desktop = os.homedir()+"\\Desktop\\LockScreen\\";
//获取锁屏图片列表
const screens = fs.readdirSync(source);

//拷贝函数
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
//主函数
(()=>{
    try {
        //创建目录
        fs.mkdirSync(desktop);
        fs.mkdirSync(desktop + h);
        fs.mkdirSync(desktop + v);
    }catch (e){
        console.log("目录已存在");
    }
    //遍历提取
    for (let i of screens){copy(i)};
    console.log("提取完成");
})();
