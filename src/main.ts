#!/usr/bin/env node
import FS from "fs";
import OS from "os";
import PATH from "path";

import { imageSize } from "image-size";

const USER_HOME = OS.homedir();
const PACKAGES_PATH = PATH.join(USER_HOME, "AppData", "Local", "Packages");
// 锁屏图片所在文件夹路径
const WALLPAPER_DIR_PATH = PATH.join(
  PACKAGES_PATH,
  FS.readdirSync(PACKAGES_PATH).find((item) =>
    item.startsWith("Microsoft.Windows.ContentDeliveryManager")
  )!,
  "LocalState",
  "Assets"
);
// 设置横竖屏文件夹名
const HORIZONTAL_DIR = "horizontal";
const VERTICAL_DIR = "vertical";
// 最小(宽|高), 小于此值当作广告图片过滤
const MIN_PIC_SIZE = 500;

(function main(output = PATH.join(USER_HOME, "Desktop", "LockScreen")): void {
    dirCheck(output);

  for (let file of FS.readdirSync(WALLPAPER_DIR_PATH)) {
    try {
      copyFile(file,output);
    } catch (error) {
      console.log(`[${file} 提取失败]: ${error.message}`);
    }
  }

  console.log("提取完成");
})();

// utils

function dirCheck(output: string): void {
  let hd = PATH.join(output, HORIZONTAL_DIR);
  let vd = PATH.join(output, VERTICAL_DIR);

  if (!FS.existsSync(output)) {
    FS.mkdirSync(output);

    FS.mkdirSync(hd);
    FS.mkdirSync(vd);
  } else {
    if (!FS.existsSync(hd)) {
      FS.mkdirSync(hd);
    }

    if (!FS.existsSync(vd)) {
      FS.mkdirSync(vd);
    }
  }
}

function copyFile(file: string,output:string): void {
  let path = PATH.join(WALLPAPER_DIR_PATH, file);
  let { width = 0, height = 0, type } = imageSize(path);

  if (width === height || width <= MIN_PIC_SIZE || height <= MIN_PIC_SIZE) {
    return;
  }

  FS.copyFileSync(
    path,
    PATH.join(
        output,
      width > height ? HORIZONTAL_DIR : VERTICAL_DIR,
      `${file}.${type}`
    )
  );
}
