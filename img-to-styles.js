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
var weight = "0.5";

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
    content_i = res;
    choose_style();
  });
  // Eo choose image
}

//    **   style folder choice

function choose_style() {
  // print
  console.log(" folders : ");
  folders.forEach((x, i) => {
    console.log(i, "\t\t", x);
  });
  // ask
  input.question("choose style folder , with index [i] : ", (res) => {
    style_folder = folders[res];
    style_images = fs.readdirSync("./images/" + style_folder);
    console.log(" style list : ", style_images);
    choose_weight();
  });
}

function choose_weight() {
  input.question("finally choose weighting 0 < 1 ", (res) => {
    weight = res;
    input.close();
    loop();
  });
}

//  **  Stylization

function image_stylization(contentimg, styleimg, callback, weight) {
  // check for .jpg
  if (contentimg.slice(-4) == ".jpg" && styleimg.slice(-4) == ".jpg") {
    console.log(" styling ", contentimg, " with ", styleimg);
    // let weight = "[0.0,0.2,0.4,0.6,0.8,1.0]";
    let stylesize = sizeOf("./images/" + style_folder + "/" + styleimg);
    let contentsize = sizeOf("./images/" + content_folder + "/" + contentimg);

    let cmd =
      "arbitrary_image_stylization_with_weights  --checkpoint=models/model.ckpt \
    --output_dir=output/  \
    --style_images_paths=images/" +
      style_folder +
      // "/*.jpg " +
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
      "   --style_square_crop=False  --interpolation_weights=[" +
      weight +
      "]  --logtostderr";

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
    console.log(
      x,
      " of ",
      style_images.length,
      "\tstyling :",
      content_images[content_i],
      style_images[x]
    );
    image_stylization(
      content_images[content_i],
      style_images[x],
      loop,
      weight.toString()
    );
  }
  x++;
}
