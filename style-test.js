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

var content_folder = "content_images";
var style_folder = "style_images"; // nypl , style_images

var content_images = fs.readdirSync("./" + content_folder);
var style_images = fs.readdirSync("./styles/" + style_folder);

console.log(" style images : ", style_images);
console.log(" content images");
content_images.forEach((x, i) => {
  console.log(i, "\t\t", x);
});

console.log(" choose image : ");

const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

var c_i;

input.question("choose image withh index [i] : ", (res) => {
  console.log(" input : ", res);
  c_i = res;
  loop();
  input.close();
});

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
    let weight = "[0.0,0.2,0.4,0.6,0.8,1.0]";
    let stylesize = sizeOf("./styles/" + style_folder + "/" + styleimg);
    let contentsize = sizeOf("./" + content_folder + "/" + contentimg);

    //   console.log(" images sizes : ", contentsize, stylesize);

    let cmd =
      "arbitrary_image_stylization_with_weights  --checkpoint=models/model.ckpt \
    --output_dir=output/  --style_images_paths=styles/" +
      style_folder +
      "/" +
      styleimg +
      "  --content_images_paths=" +
      content_folder +
      "/" +
      contentimg +
      "  --image_size=" +
      contentsize.width +
      " --content_square_crop=False  --style_image_size=" +
      stylesize.width +
      "   --style_square_crop=False  --logtostderr";

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
