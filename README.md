# magenta-img-styling-wrapper

a simple node wrapper for running magenta image stylisation scripts

Setup

This is based on [magenta](https://github.com/tensorflow/magenta/blob/master/README.md) , so first follow the [Installation](https://github.com/tensorflow/magenta/blob/master/README.md#installation) there.

This is just running the [Arbitrary Image Stylisation](https://github.com/tensorflow/magenta/tree/master/magenta/models/arbitrary_image_stylization) and follow the setup there for downloading models etc.

Then try running the python scripts
‘‘‘arbitrary*image_stylization_with_weights \
 --checkpoint=/path/to/arbitrary_style_transfer/model.ckpt \
 --output_dir=/path/to/output_dir \
 --style_images_paths=images/style_images/*.jpg \
 --content*images_paths=images/content_images/*.jpg \
 --image_size=256 \
 --content_square_crop=False \
 --style_image_size=256 \
 --style_square_crop=False \
 --logtostderr‘‘‘

These node scripts just run the python scripts for you more easily.

### img-weighted.js

will run one style on one content image in weights from 0 to 1

### img-to-styles.js

Will style one content image with all style images in a selected folder

### img-sketch-js

lets you choose draw a style image and applies this to a content image, the image is then monitored for changes so you can keep editing and see the changes in applied style.

# Styling

Important factor I have learnt so far is that the size and resolution of style picture and content picture really matter. If the result is not great, crop out only one part of your style image or reduce the resolution / size. same thing counts for the content image.
