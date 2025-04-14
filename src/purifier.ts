import fs from "fs/promises";
import path from "path";

export async function removeIfConditions(files: string[]) {
  files.forEach(async (filePath) => {
    // read the file
    let content = await fs.readFile(filePath, "utf-8");
    const name = path.basename(filePath);
    const pureName = name.replace(".", "_pure.");

    if (name.endsWith("sol")) {
      const splitText = "function getMorphoCollateral";
      const tempContent = content.split(splitText);
      const regex =
        /if\s*\([^)]*\)\s*({(?:[^{}]*|{(?:[^{}]*|{[^{}]*})*})*}|[^;\n]*;)/g;
      content = tempContent[0]!.replaceAll(regex, "");
      content += splitText + tempContent[1]!;
    } else if (name.endsWith("ts")) {
      const regex =
        /if\s*\([^)]*\)\s*({(?:[^{}]*|{(?:[^{}]*|{[^{}]*})*})*}|[^;\n]*;)/g;
      content = content.replaceAll(regex, "");
    } else throw new Error("Unsupported file type");
    // save the new file
    const newPath = filePath.replace(name, pureName);
    await fs.writeFile(newPath, content);
  });
}
