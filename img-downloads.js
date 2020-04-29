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
  console.log(i, "\t\t", x);
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
    console.log(i, "\t\t", x);
  });
  input.question("choose content image , index [i] : ", (res) => {
    console.log(" input : ", res);
    img_content = content_images[res];

    //    **   style folder
    style_folder = "sketch";
    img_style = "test.jpg";
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
function init() {
  console.log(" chose content  : ", img_content, "\t and style : ", img_style);

  console.log(" setting up file watcher on ", style_folder + "/" + img_style);

  fs.watch("./" + style_folder, (event, filename) => {
    debounce = !debounce;
    if (debounce) {
      console.log(" Change! ", event, " event on ", filename);
      restyle();
    }
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

function restyle() {
  console.log(" restyling : ", img_content, img_style, null, weight.toString());
  image_stylization(img_content, img_style, null, weight.toString());
  // Eo func
}

function image_stylization(contentimg, styleimg, callback) {
  // check for .jpg
  if (contentimg.slice(-4) == ".jpg" && styleimg.slice(-4) == ".jpg") {
    console.log(" styling ", contentimg, " with ", styleimg);
    // let weight = "[0.0,0.2,0.4,0.6,0.8,1.0]";
    let stylesize = sizeOf("./sketch/" + styleimg);
    let contentsize = sizeOf("./images/" + content_folder + "/" + contentimg);

    //   console.log(" images sizes : ", contentsize, stylesize);

    let cmd =
      "arbitrary_image_stylization_with_weights  --checkpoint=models/model.ckpt \
    --output_dir=output/  \
    --style_images_paths=sketch/" +
      styleimg +
      "  --content_images_paths=images/" +
      content_folder +
      "/" +
      contentimg +
      "  --image_size=" +
      contentsize.width +
      " --content_square_crop=False  --style_image_size=" +
      stylesize.width +
      "   --style_square_crop=False --interpolation_weights=[1] --logtostderr";

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
    image_stylization(content_images[c_i], style_images[x], loop);
  }
  x++;
}
