// 프로젝트 이미지 압축 스크립트 (파일명·포맷 유지, 내용만 압축)
// - 100KB 초과 PNG/JPG 대상
// - 최대 변 1080px로 리사이즈 (402px 모바일 디자인 기준 ~2.7x DPR 커버)
// - PNG: 팔레트 압축 / JPG: mozjpeg 재압축
// - 압축 결과가 원본보다 크면 원본 유지
// - 원본은 백업 폴더에 보관
import sharp from "sharp";
import { readdirSync, statSync, mkdirSync, copyFileSync, writeFileSync, renameSync } from "fs";
import { join, relative, dirname } from "path";

const ROOT = process.argv[2];
const BACKUP = process.argv[3];
const TARGET_DIRS = ["src/assets", "public"];
const MIN_SIZE = 100 * 1024;
const MAX_DIM = 1080;

const walk = (dir) => {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else out.push({ full, size: st.size });
  }
  return out;
};

const files = TARGET_DIRS.flatMap((d) => walk(join(ROOT, d)))
  .filter((f) => /\.(png|jpe?g)$/i.test(f.full) && f.size > MIN_SIZE);

let before = 0;
let after = 0;
const rows = [];

for (const file of files) {
  const rel = relative(ROOT, file.full);
  const backupPath = join(BACKUP, rel);
  mkdirSync(dirname(backupPath), { recursive: true });
  copyFileSync(file.full, backupPath);

  const isPng = /\.png$/i.test(file.full);
  const image = sharp(file.full, { animated: false });
  const meta = await image.metadata();

  let pipeline = sharp(file.full);
  if (Math.max(meta.width, meta.height) > MAX_DIM) {
    pipeline = pipeline.resize({
      width: MAX_DIM,
      height: MAX_DIM,
      fit: "inside",
      withoutEnlargement: true,
    });
  }
  pipeline = isPng
    ? pipeline.png({ palette: true, quality: 85, compressionLevel: 9, effort: 8 })
    : pipeline.jpeg({ quality: 80, mozjpeg: true });

  const tmp = file.full + ".tmp";
  await pipeline.toFile(tmp);

  const newSize = statSync(tmp).size;
  before += file.size;
  if (newSize < file.size) {
    renameSync(tmp, file.full);
    after += newSize;
    rows.push(`${rel}: ${(file.size/1024).toFixed(0)}KB -> ${(newSize/1024).toFixed(0)}KB (${meta.width}x${meta.height})`);
  } else {
    const { unlinkSync } = await import("fs");
    unlinkSync(tmp);
    after += file.size;
    rows.push(`${rel}: 유지 (압축 이득 없음)`);
  }
}

const summary = [
  ...rows,
  "",
  `TOTAL: ${(before/1024/1024).toFixed(1)}MB -> ${(after/1024/1024).toFixed(1)}MB (${files.length} files)`,
].join("\n");

writeFileSync(join(BACKUP, "report.txt"), summary);
console.log(summary.split("\n").slice(-3).join("\n"));
