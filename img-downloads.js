var cmd = require("node-cmd");
const fs = require("fs");
var sizeOf = require("image-size");
const readline = require("readline");
const { Image } = require("image-js");

//          **          Functions

function exec(arg, callback) {
  cmd.get(arg, function (err, data, stderr) {
    if (err === null) {
      //console.log(" output : ", data);
      callback(data);
    } else {
      console.log(
        " Erreor on : ",
        arg,
        "\t\t #err : ",
        err,
        " std err : ",
        stderr
      );
    }
  });
}

//  *****           file system org

var content_images, style_folder, style_images, content_folder;
var folders = fs.readdirSync("./images");
var content_i;

var img_content, img_style;

// input
const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// * print folders
console.log(" # Folders : ");
folders.forEach((x, i) => {
  console.log(i, "   ", x);
});

input.question("choose content image folder index [i] : ", (res) => {
  content_folder = folders[res];
  console.log(" input : ", res);
  c_i = res;
  choose_image();
});

function choose_image() {
  // get images
  content_images = fs.readdirSync("./images/" + content_folder);
  // print
  console.log(" content images");
  content_images.forEach((x, i) => {
    console.log(i, "   ", x);
  });
  input.question("choose content image , index [i] : ", (res) => {
    console.log(" input : ", res);
    img_content = content_images[res];

    choose_weight();
  });
  // Eo choose image
}

function choose_weight() {
  input.question("finally choose weighting 0 < 1 ", (res) => {
    weight = res;
    input.close();
    init();
  });
}

//    **    Main

var debounce = true;
let download_path = "/Users/thomas.britnelldesignaffairs.com/Downloads";

function init() {
  console.log(" chose content  : ", content_folder, " / ", img_content);

  console.log(" setting up .jpg watcher on Downloads folder ");

  fs.watch(download_path, (event, filename) => {
    debounce = !debounce;
    if (debounce)
      try {
        console.log(" Folder ", event, "-event on ", filename);
        resize_img(filename);
      } catch (error) {
        console.log(" went wrong ,  ", error);
      }
  });
}

var STLSZ = 256;

function resize_img(filename) {
  let stylesize = sizeOf(download_path + "/" + filename);

  console.log(" Copying image and checking.\n image size : ", stylesize);
  // if (stylesize.width > 600 || stylesize.height > 600)

  Image.load(download_path + "/" + filename).then(function (image) {
    filename = filename.split(" ").join("_");
    // if (stylesize.width * stylesize.height > 600000)
    if (stylesize.width > STLSZ) image = image.resize({ width: STLSZ });
    image.save("./images/sketched/DWNLD_" + filename).then(function () {
      console.log(" SAVED");
      restyle("./images/sketched/DWNLD_" + filename);
    });
  });

  // restyle(download_path + "/" + filename);

  // Eo resize
}
// lets go

function image_stylization(contentPath, stylePath, callback) {
  // check for .jpg
  // if (contentimg.slice(-4) == ".jpg" && styleimg.slice(-4) == ".jpg") {
  if (true) {
    console.log(" styling files ", contentPath, " with ", stylePath);

    // let weight = "[0.0,0.2,0.4,0.6,0.8,1.0]";
    let stylesize = sizeOf(stylePath);
    let contentsize = sizeOf(contentPath);

    console.log(" Image sizes : ", contentsize, " > ", stylesize);

    let cmd =
      "arbitrary_image_stylization_with_weights  --checkpoint=models/model.ckpt \
    --output_dir=output/  \
    --style_images_paths=" +
      stylePath +
      "  --content_images_paths=" +
      contentPath +
      "  --image_size=" +
      contentsize.width +
      " --content_square_crop=False  --style_image_size=" +
      stylesize.width +
      "   --style_square_crop=False --interpolation_weights=[1] --logtostderr";

    exec(cmd, (res) => {
      if (callback) callback();
    });
  } else {
    console.log(" wrong file format : ", contentimg, " and ", styleimg);
    if (callback) setTimeout(callback, 50);
  }

  // Eo func
}

function restyle(name) {
  let stylePath = name;
  let contentPath = "./images/" + content_folder + "/" + img_content;

  console.log(" restyling : ", contentPath, " with ", stylePath);
  image_stylization(contentPath, stylePath, function () {
    console.log("Stylisation complete ");
  });

  //
}
