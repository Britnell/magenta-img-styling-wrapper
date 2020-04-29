var cmd = require("node-cmd");
const fs = require("fs");

var sizeOf = require("image-size");
const readline = require("readline");

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
var content_i, style_i;

// input
const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// * print folders
console.log(" # Folders : ");
folders.forEach((x, i) => {
  console.log(i, "\t", x);
});

input.question("choose content image folder index [i] : ", (res) => {
  content_folder = folders[res];
  choose_image();
});

function choose_image() {
  // get images
  content_images = fs.readdirSync("./images/" + content_folder);
  // print
  console.log(" content images");
  content_images.forEach((x, i) => {
    console.log(i, "\t", x);
  });
  input.question("choose content image , index [i] : ", (res) => {
    content_i = res;
    choose_style_f();
  });
  // Eo choose image
}

//    **   style folder choice

function choose_style_f() {
  // print
  console.log(" folders : ");
  folders.forEach((x, i) => {
    console.log(i, "\t", x);
  });

  // ask
  input.question("choose style folder , with index [i] : ", (res) => {
    style_folder = folders[res];
    style_images = fs.readdirSync("./images/" + style_folder);
    choose_style();
  });
}

function choose_style() {
  // print
  console.log(" style images  : ");
  style_images.forEach((x, i) => {
    console.log(i, "\t", x);
  });

  // ask
  input.question("choose style image , with index [i] : ", (res) => {
    style_i = res;
    loop();
    input.close();
  });
}

// lets go

var THECMD =
  "arbitrary_image_stylization_with_weights \
--checkpoint=models/model.ckpt \
--output_dir=output/ \
--style_images_paths=style_images/black_zigzag.jpg \
--content_images_paths=content_images/eiffel_tower.jpg \
--image_size=256 \
--content_square_crop=False \
--style_image_size=256 \
--style_square_crop=False \
--logtostderr";

function image_stylization(contentimg, styleimg, callback) {
  // check for .jpg
  if (contentimg.slice(-4) == ".jpg" && styleimg.slice(-4) == ".jpg") {
    console.log(" styling ", contentimg, " with ", styleimg);
    let stylesize = sizeOf("./images/" + style_folder + "/" + styleimg);
    let contentsize = sizeOf("./images/" + content_folder + "/" + contentimg);

    //   console.log(" images sizes : ", contentsize, stylesize);

    let cmd =
      "arbitrary_image_stylization_with_weights  --checkpoint=models/model.ckpt \
    --output_dir=output/  \
    --style_images_paths=images/" +
      style_folder +
      "/" +
      styleimg +
      "  --content_images_paths=images/" +
      content_folder +
      "/" +
      contentimg +
      "  --image_size=" +
      contentsize.width +
      " --content_square_crop=False  --style_image_size=" +
      stylesize.width +
      "   --style_square_crop=False  --interpolation_weights=[0.0,0.2,0.4,0.6,0.8,1.0]  --logtostderr";

    exec(cmd, (res) => {
      console.log(" complete", res);
      if (callback) callback();
    });
  } else {
    console.log(" wrong file format : ", contentimg, " and ", styleimg);
    if (callback) setTimeout(callback, 50);
  }

  // Eo func
}

let x = 0;

function loop() {
  if (x < style_images.length) {
    image_stylization(content_images[content_i], style_images[style_i]);
  }
  x++;
}
