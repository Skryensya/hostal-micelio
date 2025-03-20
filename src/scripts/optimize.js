const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputFolder = path.join(__dirname, "../public/assets/images/original");
const outputFolder = path.join(__dirname, "../public/assets/images/_webp");

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

async function processFiles(folder) {
  const files = fs.readdirSync(folder);

  for (const file of files) {
    const currentPath = path.join(folder, file);
    const stats = fs.statSync(currentPath);

    if (stats.isDirectory() && file.includes("_")) {
      continue;
    }

    if (stats.isDirectory()) {
      const newOutputFolder = path.join(
        outputFolder,
        path.relative(inputFolder, currentPath)
      );
      if (!fs.existsSync(newOutputFolder)) {
        fs.mkdirSync(newOutputFolder, { recursive: true });
      }
      await processFiles(currentPath);
    } else if (/\.(jpg|jpeg|png|gif|webp|avif)$/i.test(file)) {
      const filename = path.parse(file).name;
      const outputPath = path.join(
        outputFolder,
        path.relative(inputFolder, path.dirname(currentPath)),
        `${filename}.webp`
      );

      try {
        const metadata = await sharp(currentPath).metadata();

        // Optimize based on image type and content
        let pipeline = sharp(currentPath);

        if (metadata.hasAlpha) {
          // Preserve transparency
          pipeline = pipeline.webp({
            quality: 80,
            lossless: false,
            alphaQuality: 100,
            effort: 6,
          });
        } else {
          // Optimize for non-transparent images
          pipeline = pipeline.webp({
            quality: 80,
            lossless: false,
            effort: 6,
            smartSubsample: true,
            reductionEffort: 6,
          });
        }

        await pipeline.toFile(outputPath);

        // Log size comparison
        const originalSize = stats.size;
        const convertedSize = fs.statSync(outputPath).size;
        const reduction = (
          ((originalSize - convertedSize) / originalSize) *
          100
        ).toFixed(2);

        console.log(`Converted: ${currentPath}`);
        console.log(
          `Size reduction: ${reduction}% (${(originalSize / 1024).toFixed(
            2
          )}KB → ${(convertedSize / 1024).toFixed(2)}KB)`
        );
      } catch (err) {
        console.error(`Error converting ${currentPath}:`, err);
      }
    } else {
      const outputPath = path.join(
        outputFolder,
        path.relative(inputFolder, currentPath)
      );
      fs.copyFileSync(currentPath, outputPath);
      console.log(`Copied: ${currentPath}`);
    }
  }
}

processFiles(inputFolder)
  .then(() => console.log("Conversion complete!"))
  .catch((err) => console.error("Error during conversion:", err));
