import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputFolder = path.join(__dirname, "../public/assets/images/_webp");
const outputFolder = path.join(
  __dirname,
  "../public/assets/images/_thumbnails"
);

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

function processImages(folder) {
  fs.readdirSync(folder).forEach((file) => {
    const currentPath = path.join(folder, file);
    const stats = fs.statSync(currentPath);

    if (stats.isDirectory() && file.includes("_")) {
      return;
    }

    if (stats.isDirectory()) {
      const newOutputFolder = path.join(
        outputFolder,
        path.relative(inputFolder, currentPath)
      );
      if (!fs.existsSync(newOutputFolder)) {
        fs.mkdirSync(newOutputFolder, { recursive: true });
      }
      processImages(currentPath);
    } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
      const filename = path.parse(file).name;
      const outputPath = path.join(
        outputFolder,
        path.relative(inputFolder, path.dirname(currentPath)),
        `${filename}.webp`
      );

      sharp(currentPath)
        .resize(100, 100)
        .blur(5)
        .webp({ quality: 80 })
        .toFile(outputPath)
        .then(() => {
          console.log(`Processed: ${currentPath}`);
        })
        .catch((err) => {
          console.error(`Error processing ${currentPath}:`, err);
        });
    }
  });
}

processImages(inputFolder);
