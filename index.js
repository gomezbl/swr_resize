"use strict";

const Jimp = require("jimp");
var SizeOfImage = require('image-size');

module.exports = {};
module.exports.swr = {};

module.exports.swr.info = function() {
    return {
        name: "resize",
        description: "Smart Web Resource module for resizing image",
        params: [
            { name: "w", description: "Width in pixels", type: "integer", optional: true },
            { name: "h", description: "Height in pixels", type: "integer", optional: true }
        ],
        sampleO: "examples/resize_original.jpg",
        sampleM: "examples/resize_mod.png",
        example: "w(340)"
    }
}
        
module.exports.swr.perform = async function(params) {
    const originalImageSize = await getImageSize(params.sourceEntity);
    const finalSize = getFinalSize(originalImageSize, params.w, params.h);

    // Perform the resize
    const image = await Jimp.read(params.sourceEntity);
    await image.resize(parseInt(finalSize.finalWidth), parseInt(finalSize.finalHeight));
    await image.writeAsync(params.destEntity);
}

function getImageSize(fullPathToImage) {
    return new Promise((resolve, reject) => {
        SizeOfImage(fullPathToImage, (err, dimensions) => {
            if (!!err) reject(err);
            else resolve(dimensions);
        });
    });
}

function getFinalSize(originalImageSize, destWidth, destHeight) {
    let finalWidth, finalHeight;

    // Case 1) - destination width set, but no height
    if (destWidth && !destHeight) {
        finalWidth = destWidth;
        const ratio = originalImageSize.width / destWidth;
        finalHeight = originalImageSize.height / ratio;
    }

    // Case 2) - destination height set, but no width
    if (!destWidth && destHeight) {
        finalHeight = destHeight;
        const ratio = originalImageSize.height / destHeight;
        finalWidth = originalImageSize.width / ratio;
    }

    // Case 3) - no destination width or height set, then set with to DEFAULTWIDTH
    if (!destWidth && !destHeight) {
        finalWidth = destWidth;
        const ratio = originalImageSize.width / destWidth;
        finalHeight = originalImageSize.height / ratio;
    }

    // Case 4) - destination width and height set
    if (destWidth && destHeight) {
        finalWidth = destWidth;
        finalHeight = destHeight;
    }

    return {
        finalWidth: finalWidth,
        finalHeight: finalHeight
    }
}