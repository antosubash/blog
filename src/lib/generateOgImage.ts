import { createCanvas, loadImage, registerFont } from "canvas";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

type OgImagePayload = {
  slug: string;
  title: string;
};

export const generateOgImage = async ({ slug, title }: OgImagePayload) => {
  const dir = path.resolve("public", "og");
  const filepath = path.resolve(dir, `${slug}.png`);

  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  if (!existsSync(filepath)) {
    const imgBuffer = await createImage({ title });

    writeFileSync(filepath, imgBuffer);
  }
};

function getLines(ctx: any, text: string, maxWidth: number) {
  var words = text.split(" ");
  var lines = [];
  var currentLine = words[0];

  for (var i = 1; i < words.length; i++) {
    var word = words[i];
    var width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

export const createImage = async ({ title }: Pick<OgImagePayload, "title">) => {
  const width = 853;
  const height = 480;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);

  const image = await loadImage(path.resolve("public", "frame.png"));

  context.drawImage(image, 0, 0);

  context.font = "900 60px Arial";
  context.fillStyle = "#fff";

  getLines(context, title, 800).forEach((line, i) => {
    context.fillText(line, 40, 100 + i * 60);
  });

  return canvas.toBuffer("image/png");
};
