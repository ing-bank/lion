import path from "path";
import { globby } from "globby";

function generateEmbeddingsForPortal({ cwd = path.join(process.cwd()) } = {}) {
  const files = globby(["./**/*.html"], { cwd });

  const fileObjects = files.map((file) => ({
    content: fs.readFileSync(path.join(cwd, file), "utf8"),
    filePath: file,
  }));

  console.log(files);
}
