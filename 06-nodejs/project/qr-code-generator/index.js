/*
1. Use inquirer to get user input
2. Generate a QR image from the URL
3. Save the URL in a text file
*/

import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import qrImage from "qr-image";

/* ---------- STEP 1: GET USER INPUT ---------- */
async function getUserInput() {
  const { url } = await inquirer.prompt([
    {
      type: "input",
      name: "url",
      message: "Enter URL:",
      validate: (value) => value.trim() !== "" || "URL cannot be empty"
    }
  ]);

  return url;
}

/* ---------- STEP 2: ENSURE FOLDERS EXIST ---------- */
function ensureFoldersExist(folders) {
  folders.forEach((folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
      console.log(`📁 Created folder: ${folder}`);
    }
  });
}

/* ---------- STEP 3: SAVE & READ TEXT ---------- */
function saveAndReadText(folderPath, baseName, data) {
  const timestamp = Date.now();
  const fileName = `${baseName}-${timestamp}.txt`;
  const filePath = path.join(folderPath, fileName);

  fs.writeFileSync(filePath, data, "utf8");
  console.log(`📝 Text saved: ${filePath}`);

  return fs.readFileSync(filePath, "utf8");
}

/* ---------- STEP 4: GENERATE QR ---------- */
function generateQR(text, folderPath, baseName) {
  const timestamp = Date.now();
  const fileName = `${baseName}-${timestamp}.png`;
  const filePath = path.join(folderPath, fileName);

  const qrStream = qrImage.image(text, { type: "png" });
  qrStream.pipe(fs.createWriteStream(filePath));

  console.log(`🔳 QR generated: ${filePath}`);
}

/* ---------- STEP 5: MAIN ---------- */
async function main() {
  try {
    const url = await getUserInput();

    const outputDir = "output";
    const textDir = path.join(outputDir, "text");
    const qrDir = path.join(outputDir, "qr");

    ensureFoldersExist([textDir, qrDir]);

    const savedUrl = saveAndReadText(textDir, "user-input", url);
    generateQR(savedUrl, qrDir, "qr");

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

/* ---------- RUN THE SHIT ---------- */
main();
