import fs from "fs";
import path from "path";

const logDir = path.join(__dirname, "../logs");

fs.existsSync(logDir) || fs.mkdirSync(logDir);

export default fs.createWriteStream(path.join(logDir, "access.log"), { flags: "a" });
