import imagemin from 'imagemin-keep-folder';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';
// const 
// imagemin = require('imagemin-keep-folder'),
// imageminGuetzli = require('imagemin-guetzli'),
// imageminJpegoptim = require('imagemin-jpegoptim'),
// imageminPngquant = require('imagemin-pngquant'),
// imageminGifsicle = require('imagemin-gifsicle'),
// imageminSvgo = require('imagemin-svgo'),
/*
files = await imagemin(['src/*.{jpg,png,gif,svg}'],{
  destination: 'build',
  plugins: [
    imageminMozjpeg(),
    imageminPngquant({
      quality: [.8, .85],
      speed: 1
    }),
    imageminGifsicle(),
    imageminSvgo()
  ]
});
console.log(files);
*/

const
changed = process.argv[2],
filetypes = {
  '.jpg': imageminMozjpeg({
    // max: 90,
  }),
  '.png': imageminPngquant({
    quality: [.8, .85],
    speed: 1
  }),
  '.gif': imageminGifsicle(),
  '.svg': imageminSvgo()
},
setFiletype = (value) => {
  let plgin;
  for(var ele in filetypes){
    if(value.indexOf(ele) !== -1){
      plgin = filetypes[ele];
      break;
    }
  }
  return plgin;
};
console.log(`'optimize start : ${changed}`);

(async () => {
  const fnc = await setFiletype(changed);
  const files = await imagemin([changed], {
    plugins: [fnc],
    replaceOutputDir: output => {
      return output.replace(/src\//, 'build/')
    }
  });
  console.log('optimized : ' + changed);
})();
